-- Synthetic-only seed guard. The dashboard demo is deterministic and bundled client-side.
do $$ begin
  if exists(select 1 from auth.users where email='demo@lifecfo.local') then
    raise notice 'Synthetic LifeCFO demo user already exists';
  else
    raise notice 'Create demo@lifecfo.local through Supabase Auth to attach persisted demo records';
  end if;
end $$;
