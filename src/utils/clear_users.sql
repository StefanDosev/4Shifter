-- DANGER: This script will delete ALL users and their stats from the database.
-- Use this ONLY if you want to start from a completely fresh state.

-- 1. Delete dependent data first
DELETE FROM "daily_stats";
DELETE FROM "shift_overrides";
DELETE FROM "extra_hours";
DELETE FROM "leaves";
DELETE FROM "audit_logs";

-- 2. Finally delete the users
DELETE FROM "users";

-- If you only want to delete a SPECIFIC user by email:
-- DELETE FROM "daily_stats" WHERE user_id = (SELECT id FROM users WHERE email = 'target@email.com');
-- DELETE FROM "users" WHERE email = 'target@email.com';
