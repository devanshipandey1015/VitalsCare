-- Correct weight column for VitalsCare (kilograms)
-- Safe to run: adds weight_kg, migrates any weight_lbs data, removes old column.

-- 1. Add weight_kg if missing
alter table public.readings
  add column if not exists weight_kg numeric(5,1);

-- 2. Migrate lbs → kg and drop old column (only if weight_lbs exists)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'readings'
      and column_name = 'weight_lbs'
  ) then
    update public.readings
    set weight_kg = round((weight_lbs * 0.453592)::numeric, 1)
    where weight_lbs is not null;

    alter table public.readings drop column weight_lbs;
  end if;
end $$;

-- 3. Fix check constraint: 20–500 kg (not 50–1000, which was the old lbs range)
alter table public.readings drop constraint if exists readings_weight_kg_check;

alter table public.readings
  add constraint readings_weight_kg_check
  check (weight_kg is null or weight_kg between 20 and 500);

-- 4. Tell Supabase API to pick up the new column
notify pgrst, 'reload schema';
