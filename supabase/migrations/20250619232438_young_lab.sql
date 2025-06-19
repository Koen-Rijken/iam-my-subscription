/*
  # Fix user subscriptions unique constraint

  1. Database Changes
    - Remove duplicate user_id entries, keeping only the most recent one
    - Add unique constraint on user_id to support upsert operations
  
  2. Data Cleanup
    - Delete older duplicate subscriptions for the same user
    - Keep the subscription with the latest updated_at timestamp
  
  3. Constraints
    - Add unique constraint on user_id column
*/

-- First, delete duplicate subscriptions, keeping only the most recent one for each user
DELETE FROM user_subscriptions 
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM user_subscriptions 
  ORDER BY user_id, updated_at DESC, created_at DESC
);

-- Now add the unique constraint on user_id
ALTER TABLE user_subscriptions 
ADD CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id);