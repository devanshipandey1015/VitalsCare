-- Migration: store weight in kilograms
-- Run in Supabase SQL Editor

-- Convert existing lbs column to kg, if present
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'readings'
      and column_name = 'weight_lbs'
  ) then
    alter table public.readings
      add column if not exists weight_kg numeric(5,1);

    update public.readings
    set weight_kg = round((weight_lbs * 0.453592)::numeric, 1)
    where weight_lbs is not null;

    alter table public.readings drop column weight_lbs;
  end if;
end $$;

alter table public.readings
  add column if not exists weight_kg numeric(5,1)
  check (weight_kg is null or weight_kg between 20 and 500);
