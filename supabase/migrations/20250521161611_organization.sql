-- Create member table
create table if not exists public.member (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text not null
);

-- Create enums
create type public.member_roles as enum ('ADMIN', 'USER');
create type public.member_status as enum ('ACTIVE', 'RESIGNED');

-- Create permission table
create table if not exists public.permission (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  role member_roles not null,
  status member_status not null,
  member_id uuid references public.member(id) on delete cascade
);
