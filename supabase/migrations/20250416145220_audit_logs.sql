create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  conversation_id uuid,
  action text not null,
  entity text not null,
  metadata json not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.audit_logs enable row level security;

create policy "Allow all"
on public.audit_logs
for all
using (true);