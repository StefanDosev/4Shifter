-- Fix existing user data to use new shift group values
-- Run this BEFORE the migration

-- Update existing users: I->D, II->B, III->C, REST->A
-- But first we need to temporarily change to text, update, then change back

-- Step 1: Add a temporary column
ALTER TABLE users ADD COLUMN shift_group_temp TEXT;

-- Step 2: Copy and transform the data
UPDATE users 
SET shift_group_temp = CASE shift_group::text
  WHEN 'I' THEN 'D'      -- First shift -> D
  WHEN 'II' THEN 'B'     -- Second shift -> B  
  WHEN 'III' THEN 'C'    -- Night shift -> C
  WHEN 'REST' THEN 'A'   -- Rest -> A
  ELSE 'A'               -- Default fallback
END;

-- Step 3: Drop the old column
ALTER TABLE users DROP COLUMN shift_group;

-- Step 4: Rename temp column
ALTER TABLE users RENAME COLUMN shift_group_temp TO shift_group;

-- Step 5: Drop old enum type
DROP TYPE IF EXISTS shift_group CASCADE;

-- Now you can run: npm run db:migrate
