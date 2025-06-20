import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !stripeSecretKey) {
      console.error('Missing environment variables:', {
        supabaseUrl: !!supabaseUrl,
        supabaseAnonKey: !!supabaseAnonKey,
        stripeSecretKey: !!stripeSecretKey
      });
      throw new Error('Missing required environment variables');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    // Get the user
    const {
      data: { user },
      error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('User authentication error:', userError);
      throw new Error('User not authenticated');
    }

    const requestBody = await req.json();
    const { planType, tokenTier, billingCycle } = requestBody;

    console.log('Creating checkout session for:', {
      userId: user.id,
      email: user.email,
      planType,
      tokenTier,
      billingCycle
    });

    // Validate request data
    if (!planType || !tokenTier || !billingCycle) {
      throw new Error('Missing required parameters');
    }

    // Calculate price based on plan and billing cycle
    let unitAmount = tokenTier.price * 100; // Convert to cents
    if (billingCycle === 'annual') {
      unitAmount = Math.round(unitAmount * 0.9); // 10% discount for annual
    }

    // Create Stripe checkout session
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const origin = req.headers.get('origin') || 'http://localhost:5173';
    
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${planType === 'developer' ? 'Developer' : 'Enterprise'} SaaS - ${tokenTier.tokens.toLocaleString()} tokens`,
              description: `${billingCycle === 'annual' ? 'Annual' : 'Monthly'} subscription`,
            },
            unit_amount: unitAmount,
            recurring: {
              interval: billingCycle === 'annual' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
        token_tier: JSON.stringify(tokenTier),
        billing_cycle: billingCycle,
      },
    });

    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Checkout session error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});