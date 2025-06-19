import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { MySubscription, createDefaultSubscription } from '../types/subscription';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<MySubscription>(createDefaultSubscription());
  const [loading, setLoading] = useState(false);

  // Load subscription from database
  const loadSubscription = async () => {
    if (!user) {
      setSubscription(createDefaultSubscription());
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading subscription:', error);
        return;
      }

      if (data) {
        setSubscription({
          id: data.id,
          userId: data.user_id,
          planType: data.plan_type,
          planName: data.plan_name,
          tokenTier: data.token_tier,
          billingCycle: data.billing_cycle,
          isActive: data.is_active,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          nextBillingDate: data.next_billing_date ? new Date(data.next_billing_date) : null,
          remainingTokens: data.remaining_tokens,
          totalTokensPurchased: data.total_tokens_purchased,
          features: data.features || []
        });
      } else {
        // Create default subscription for new users
        const defaultSub = createDefaultSubscription();
        defaultSub.userId = user.id;
        await saveSubscription(defaultSub);
        setSubscription(defaultSub);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save subscription to database
  const saveSubscription = async (sub: MySubscription) => {
    if (!user) return;

    try {
      const subscriptionData = {
        user_id: user.id,
        plan_type: sub.planType,
        plan_name: sub.planName,
        token_tier: sub.tokenTier,
        billing_cycle: sub.billingCycle,
        is_active: sub.isActive,
        remaining_tokens: sub.remainingTokens,
        total_tokens_purchased: sub.totalTokensPurchased,
        features: sub.features,
        next_billing_date: sub.nextBillingDate?.toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving subscription:', error);
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  };

  // Update subscription
  const updateSubscription = async (updates: Partial<MySubscription>) => {
    const updatedSub = {
      ...subscription,
      ...updates,
      updatedAt: new Date()
    };
    
    setSubscription(updatedSub);
    await saveSubscription(updatedSub);
  };

  // Load subscription when user changes
  useEffect(() => {
    loadSubscription();
  }, [user]);

  return {
    subscription,
    loading,
    updateSubscription,
    refreshSubscription: loadSubscription
  };
};