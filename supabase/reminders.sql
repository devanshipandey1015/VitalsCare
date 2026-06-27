-- Reminder preferences only (run if you already created the readings table)
-- Supabase Dashboard → SQL Editor → New query → Run

create table if not exists public.reminder_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  reminder_type text not null check (reminder_type in ('morning', 'evening', 'after_meal')),
  enabled boolean not null default false,
  reminder_time time not null default '08:00',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, reminder_type)
);

create index if not exists reminder_preferences_user_id_idx
  on public.reminder_preferences (user_id);

alter table public.reminder_preferences enable row level security;

create policy "Users can select own reminder preferences"
  on public.reminder_preferences
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own reminder preferences"
  on public.reminder_preferences
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own reminder preferences"
  on public.reminder_preferences
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own reminder preferences"
  on public.reminder_preferences
  for delete
  to authenticated
  using (auth.uid() = user_id);
