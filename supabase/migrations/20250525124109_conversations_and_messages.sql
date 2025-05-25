-- Create enum type for sender
do $$
begin
  if not exists (select 1 from pg_type where typname = 'sender_type') then
    create type sender_type as enum ('USER', 'BOT');
  end if;
end$$;

-- Create 'conversations' table
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now(),
  title text not null
);

-- Disable RLS on 'conversations'
alter table public.conversations disable row level security;

-- Create 'messages' table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  content text not null,
  trace text, -- Optional trace field (can be null)
  sender sender_type not null,
  created_at timestamp with time zone default now()
);

-- Disable RLS on 'messages'
alter table public.messages disable row level security;

-- Enable Realtime by modifying the publication
alter publication supabase_realtime set table public.conversations, public.messages;
