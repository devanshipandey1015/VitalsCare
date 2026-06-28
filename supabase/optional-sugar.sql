-- Migration: make blood sugar optional (only BP is required)
-- Run in Supabase SQL Editor if your database was created before this change

alter table public.readings alter column sugar_value drop not null;
alter table public.readings alter column sugar_type drop not null;
