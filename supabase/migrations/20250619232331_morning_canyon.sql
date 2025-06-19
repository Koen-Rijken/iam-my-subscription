/*
  # Add unique constraint for user_id in user_subscriptions

  1. Database Changes
    - Add unique constraint on `user_id` column in `user_subscriptions` table
    - This allows upsert operations to work correctly with onConflict

  2. Security
    - No changes to existing RLS policies
    - Maintains data integrity by ensuring one active subscription per user

  3. Notes
    - This constraint is required for the upsert operation in the frontend
    - Ensures each user can only have one active subscription record
*/

-- Add unique constraint on user_id to support upsert operations
ALTER TABLE user_subscriptions 
ADD CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id);