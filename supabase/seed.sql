-- Insert a new user into the auth.users table
insert into auth.users (id, email, encrypted_password, email_confirmed_at)
values (
  gen_random_uuid(), -- Generates a random UUID for the user ID
  'testuser@example.com', -- Replace with the user's email
  crypt('password123', gen_salt('bf')), -- Replace with the user's password
  now() -- Marks the email as confirmed
);