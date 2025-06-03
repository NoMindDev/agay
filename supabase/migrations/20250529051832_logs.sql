create table if not exists public.logs (
    "id" uuid primary key not null default gen_random_uuid(),
    "date" timestamp with time zone default now(),
    "user_name" text,
    "user_email" text,
    "event" text,
    "description" text,
    "resource_name" text,
    "resource_link" text
);