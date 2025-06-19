import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  const body = await request.text()
  let receivedEvent
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message)
    return new Response(err.message, { status: 400 })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  switch (receivedEvent.type) {
    case 'checkout.session.completed': {
      const session = receivedEvent.data.object
      const { user_id, plan_type, token_tier, billing_cycle } = session.metadata

      // Parse token tier
      const tokenTierData = JSON.parse(token_tier)

      // Calculate next billing date
      const nextBillingDate = new Date()
      if (billing_cycle === 'annual') {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
      } else {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
      }

      // Update user subscription
      const { error } = await supabaseAdmin
        .from('user_subscriptions')
        .upsert({
          user_id,
          plan_type,
          plan_name: `${plan_type === 'developer' ? 'Developer' : 'Enterprise'} SaaS`,
          token_tier: tokenTierData,
          billing_cycle,
          is_active: true,
          remaining_tokens: tokenTierData.tokens,
          total_tokens_purchased: tokenTierData.tokens,
          features: plan_type === 'developer' 
            ? ['Same as Freemium SaaS']
            : [
                'Same as Developer SaaS',
                'SAML and OIDC integration',
                'Hierarchical organization',
                'Active Directory integration',
                'User synchronization & provisioning',
                'Enterprise SLA'
              ],
          next_billing_date: nextBillingDate.toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) {
        console.error('Error updating subscription:', error)
        return new Response('Error updating subscription', { status: 500 })
      }

      break
    }
    case 'invoice.payment_succeeded': {
      const invoice = receivedEvent.data.object
      
      // Get subscription details
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
      const session = await stripe.checkout.sessions.list({
        subscription: invoice.subscription,
        limit: 1
      })

      if (session.data.length > 0) {
        const { user_id, token_tier } = session.data[0].metadata
        const tokenTierData = JSON.parse(token_tier)

        // Add tokens to user's account (for recurring payments)
        const { error } = await supabaseAdmin
          .from('user_subscriptions')
          .update({
            remaining_tokens: tokenTierData.tokens,
            total_tokens_purchased: tokenTierData.tokens,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user_id)

        if (error) {
          console.error('Error updating tokens:', error)
        }
      }
      break
    }
    case 'invoice.payment_failed': {
      // Handle failed payment
      console.log('Payment failed for invoice:', receivedEvent.data.object.id)
      break
    }
    default:
      console.log(`Unhandled event type: ${receivedEvent.type}`)
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})