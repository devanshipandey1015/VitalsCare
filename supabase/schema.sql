-- VitalsCare Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

-- Create readings table
create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  systolic integer not null check (systolic between 70 and 250),
  diastolic integer not null check (diastolic between 40 and 150),
  sugar_value integer not null check (sugar_value between 30 and 600),
  sugar_type text not null check (sugar_type in ('fasting', 'post_meal', 'random')),
  measured_at timestamptz not null,
  notes text,
  created_at timestamptz not null default now()
);

-- Index for faster user queries sorted by date
create index if not exists readings_user_id_measured_at_idx
  on public.readings (user_id, measured_at desc);

-- Enable Row Level Security
alter table public.readings enable row level security;

-- RLS Policies: users can only access their own readings

create policy "Users can select own readings"
  on public.readings
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own readings"
  on public.readings
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own readings"
  on public.readings
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own readings"
  on public.readings
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Reminder preferences
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
