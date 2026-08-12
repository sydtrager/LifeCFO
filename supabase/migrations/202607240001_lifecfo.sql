-- LifeCFO V1 normalized schema. All amounts are user-entered planning values.
create extension if not exists pgcrypto;
create type ownership_type as enum ('individual','joint');
create type transaction_type as enum ('income','expense','transfer');
create type recommendation_status as enum ('open','accepted','declined','deferred','completed');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text, last_name text, display_name text, timezone text not null default 'America/New_York',
  currency_code char(3) not null default 'USD', onboarding_completed boolean not null default false,
  preferred_review_frequency text default 'monthly', preferred_communication_channel text default 'in_app',
  communication_intensity text default 'balanced', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table households (
  id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 1 and 120),
  created_by uuid not null references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table household_members (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade,
  user_id uuid references auth.users on delete cascade, display_name text not null, relationship text, role text not null default 'member',
  date_of_birth date, is_authenticated_member boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(user_id)
);
create table financial_preferences (
  id uuid primary key default gen_random_uuid(), household_id uuid not null unique references households on delete cascade,
  risk_tolerance text, cash_reserve_months numeric(4,1) check(cash_reserve_months between 0 and 36), debt_comfort text,
  investing_experience text, spending_style text, advice_style text, financial_rules jsonb not null default '{}',
  notification_preferences jsonb not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table life_priorities (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade,
  priority_type text not null, custom_label text, weight smallint not null check(weight between 1 and 10), rank smallint check(rank > 0),
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table accounts (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade,
  owner_member_id uuid references household_members on delete set null, ownership_type ownership_type not null, account_type text not null,
  institution_name text, account_name text not null, masked_identifier varchar(4), current_balance numeric(16,2) not null default 0,
  interest_rate_or_yield numeric(8,5) check(interest_rate_or_yield between 0 and 1), valuation_date date not null default current_date,
  input_method text not null default 'manual', status text not null default 'active', include_in_net_worth boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table income_sources (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade,
  owner_member_id uuid references household_members on delete set null, income_type text not null, employer_or_source text,
  gross_annual_amount numeric(16,2) not null check(gross_annual_amount >= 0), estimated_net_annual_amount numeric(16,2) check(estimated_net_annual_amount >= 0),
  bonus_target numeric(16,2) check(bonus_target >= 0), pay_frequency text, start_date date, end_date date,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check(end_date is null or start_date is null or end_date >= start_date)
);
create table transactions (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade,
  account_id uuid references accounts on delete set null, owner_member_id uuid references household_members on delete set null,
  transaction_date date not null, merchant_or_description text not null, category text not null, amount numeric(16,2) not null,
  transaction_type transaction_type not null, is_recurring boolean not null default false, source text not null default 'manual',
  review_status text not null default 'unreviewed', notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table investment_holdings (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade,
  account_id uuid not null references accounts on delete cascade, ticker text, security_name text not null, security_type text,
  asset_class text, quantity numeric(20,6), market_price numeric(16,4), market_value numeric(16,2) not null,
  cost_basis numeric(16,2), employer_related boolean not null default false, valuation_date date not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table retirement_plans (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade,
  owner_member_id uuid not null references household_members, account_id uuid references accounts on delete set null, plan_type text not null,
  eligible_salary numeric(16,2), employee_contribution_rate numeric(8,5) check(employee_contribution_rate between 0 and 1),
  employer_match_rate numeric(8,5) check(employer_match_rate between 0 and 1), employer_match_limit numeric(8,5) check(employer_match_limit between 0 and 1),
  annual_contribution numeric(16,2), expected_return_rate numeric(8,5) check(expected_return_rate between -1 and 1),
  target_retirement_age smallint check(target_retirement_age between 18 and 100), target_retirement_spending numeric(16,2),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table debts (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade,
  owner_member_id uuid references household_members, account_id uuid references accounts on delete set null, debt_type text not null,
  current_balance numeric(16,2) not null check(current_balance >= 0), interest_rate numeric(8,5) not null check(interest_rate between 0 and 1),
  minimum_payment numeric(16,2) not null default 0, scheduled_payment numeric(16,2) not null default 0, maturity_date date,
  is_paid_monthly boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table goals (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade,
  owner_member_id uuid references household_members, goal_type text not null, title text not null, description text,
  target_amount numeric(16,2) check(target_amount >= 0), current_amount numeric(16,2) not null default 0 check(current_amount >= 0),
  target_date date, priority_weight smallint not null default 5 check(priority_weight between 1 and 10), urgency text,
  status text not null default 'active', funding_account_id uuid references accounts on delete set null, assumptions jsonb not null default '{}',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table insurance_policies (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade,
  owner_member_id uuid references household_members, policy_type text not null, provider text,
  coverage_amount numeric(16,2), annual_premium numeric(16,2), renewal_date date, beneficiary_notes text, status text not null default 'active',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table financial_snapshots (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade, snapshot_date date not null,
  cash_total numeric(16,2), taxable_investments_total numeric(16,2), retirement_total numeric(16,2), other_assets_total numeric(16,2),
  total_assets numeric(16,2), total_debt numeric(16,2), net_worth numeric(16,2), monthly_income numeric(16,2), monthly_spending numeric(16,2),
  monthly_savings numeric(16,2), savings_rate numeric(7,3), emergency_fund_months numeric(7,2), employer_stock_value numeric(16,2),
  employer_stock_concentration numeric(7,3), health_score smallint check(health_score between 0 and 100),
  health_score_components jsonb not null, data_completeness_score smallint check(data_completeness_score between 0 and 100),
  created_at timestamptz not null default now(), unique(household_id,snapshot_date)
);
create table reviews (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade,
  review_period_start date not null, review_period_end date not null, review_type text not null, status text not null default 'draft',
  executive_summary text, wins jsonb not null default '[]', risks jsonb not null default '[]', changes jsonb not null default '[]',
  forecast_summary jsonb not null default '{}', data_completeness_score smallint check(data_completeness_score between 0 and 100),
  generated_at timestamptz, reviewed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check(review_period_end >= review_period_start)
);
create table recommendations (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade, review_id uuid references reviews on delete set null,
  title text not null, description text not null, category text not null, priority_score smallint not null check(priority_score between 0 and 100),
  impact_score smallint not null check(impact_score between 0 and 100), urgency_score smallint not null check(urgency_score between 0 and 100),
  ease_score smallint not null check(ease_score between 0 and 100), goal_alignment_score smallint not null check(goal_alignment_score between 0 and 100),
  confidence_score smallint not null check(confidence_score between 0 and 100), risk_reduction_score smallint not null check(risk_reduction_score between 0 and 100),
  estimated_annual_impact numeric(16,2), estimated_lifetime_impact numrange, impact_methodology text not null, assumptions jsonb not null default '{}',
  why_now text, tradeoffs text, goals_affected jsonb not null default '[]', professional_review_type text, status recommendation_status not null default 'open',
  due_date date, accepted_at timestamptz, completed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table recommendation_actions (
  id uuid primary key default gen_random_uuid(), recommendation_id uuid not null references recommendations on delete cascade,
  household_id uuid not null references households on delete cascade, action_type text not null, notes text,
  previous_status recommendation_status, new_status recommendation_status, created_at timestamptz not null default now(), created_by uuid not null references auth.users
);
create table statement_uploads (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade, account_id uuid references accounts on delete set null,
  storage_path text not null unique, original_filename text not null, mime_type text not null check(mime_type in ('application/pdf','text/csv','application/vnd.ms-excel')),
  file_size integer not null check(file_size between 1 and 10485760), statement_period_start date, statement_period_end date,
  processing_status text not null default 'uploaded', extraction_result jsonb, extraction_confidence numeric(5,4) check(extraction_confidence between 0 and 1),
  user_confirmed boolean not null default false, confirmed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check(statement_period_end is null or statement_period_start is null or statement_period_end >= statement_period_start)
);
create table review_schedules (
  id uuid primary key default gen_random_uuid(), household_id uuid not null unique references households on delete cascade, frequency text not null,
  preferred_day smallint check(preferred_day between 0 and 31), preferred_hour smallint check(preferred_hour between 0 and 23), timezone text not null,
  next_review_at timestamptz, is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table notifications (
  id uuid primary key default gen_random_uuid(), household_id uuid not null references households on delete cascade, user_id uuid not null references auth.users,
  notification_type text not null, title text not null, body text not null, channel text not null, severity text not null default 'info',
  scheduled_for timestamptz, sent_at timestamptz, read_at timestamptz, status text not null default 'scheduled', metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create table audit_events (
  id uuid primary key default gen_random_uuid(), household_id uuid references households on delete set null, user_id uuid references auth.users on delete set null,
  event_type text not null, entity_type text, entity_id uuid, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);

create index on household_members(household_id); create index on accounts(household_id); create index on transactions(household_id,transaction_date desc);
create index on goals(household_id,status); create index on reviews(household_id,status); create index on recommendations(household_id,status,priority_score desc);
create index on notifications(household_id,status,scheduled_for); create index on financial_snapshots(household_id,snapshot_date desc);
create index on statement_uploads(household_id,created_at desc); create index on audit_events(household_id,created_at desc);

create function set_updated_at() returns trigger language plpgsql security invoker set search_path='' as $$ begin new.updated_at=now(); return new; end $$;
do $$ declare t text; begin foreach t in array array['profiles','households','household_members','financial_preferences','life_priorities','accounts','income_sources','transactions','investment_holdings','retirement_plans','debts','goals','insurance_policies','reviews','recommendations','statement_uploads','review_schedules'] loop execute format('create trigger set_updated_at before update on %I for each row execute function set_updated_at()',t); end loop; end $$;

create function is_household_member(target uuid) returns boolean language sql stable security definer set search_path=public as
  $$ select exists(select 1 from household_members where household_id=target and user_id=(select auth.uid()) and is_authenticated_member) $$;
revoke all on function is_household_member(uuid) from public; grant execute on function is_household_member(uuid) to authenticated;

create function create_new_user_household() returns trigger language plpgsql security definer set search_path=public as $$
declare household uuid; display text;
begin
  display=coalesce(new.raw_user_meta_data->>'display_name',split_part(new.email,'@',1));
  insert into profiles(id,display_name) values(new.id,display);
  insert into households(name,created_by) values(display||'''s Household',new.id) returning id into household;
  insert into household_members(household_id,user_id,display_name,relationship,role,is_authenticated_member) values(household,new.id,display,'self','owner',true);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function create_new_user_household();

alter table profiles enable row level security;
create policy "profiles_select_self" on profiles for select using(id=(select auth.uid()));
create policy "profiles_insert_self" on profiles for insert with check(id=(select auth.uid()));
create policy "profiles_update_self" on profiles for update using(id=(select auth.uid())) with check(id=(select auth.uid()));
create policy "profiles_delete_self" on profiles for delete using(id=(select auth.uid()));

alter table households enable row level security;
create policy "households_select_member" on households for select using(is_household_member(id));
create policy "households_insert_creator" on households for insert with check(created_by=(select auth.uid()));
create policy "households_update_member" on households for update using(is_household_member(id)) with check(is_household_member(id));
create policy "households_delete_owner" on households for delete using(created_by=(select auth.uid()));

alter table household_members enable row level security;
create policy "members_select_household" on household_members for select using(is_household_member(household_id) or user_id=(select auth.uid()));
create policy "members_insert_household" on household_members for insert with check(is_household_member(household_id) or user_id=(select auth.uid()));
create policy "members_update_household" on household_members for update using(is_household_member(household_id)) with check(is_household_member(household_id));
create policy "members_delete_household" on household_members for delete using(is_household_member(household_id));

do $$ declare t text; begin
foreach t in array array['financial_preferences','life_priorities','accounts','income_sources','transactions','investment_holdings','retirement_plans','debts','goals','insurance_policies','financial_snapshots','reviews','recommendations','recommendation_actions','statement_uploads','review_schedules','notifications','audit_events'] loop
  execute format('alter table %I enable row level security',t);
  execute format('create policy %I on %I for select using (is_household_member(household_id))',t||'_select',t);
  execute format('create policy %I on %I for insert with check (is_household_member(household_id))',t||'_insert',t);
  execute format('create policy %I on %I for update using (is_household_member(household_id)) with check (is_household_member(household_id))',t||'_update',t);
  execute format('create policy %I on %I for delete using (is_household_member(household_id))',t||'_delete',t);
end loop; end $$;

-- Snapshots are append-only: members can read/insert, but never update/delete.
drop policy if exists financial_snapshots_update on financial_snapshots;
drop policy if exists financial_snapshots_delete on financial_snapshots;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('financial-statements','financial-statements',false,10485760,array['application/pdf','text/csv','application/vnd.ms-excel'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "statement_objects_select" on storage.objects for select to authenticated using(bucket_id='financial-statements' and is_household_member((storage.foldername(name))[1]::uuid));
create policy "statement_objects_insert" on storage.objects for insert to authenticated with check(bucket_id='financial-statements' and is_household_member((storage.foldername(name))[1]::uuid));
create policy "statement_objects_update" on storage.objects for update to authenticated using(bucket_id='financial-statements' and is_household_member((storage.foldername(name))[1]::uuid)) with check(bucket_id='financial-statements' and is_household_member((storage.foldername(name))[1]::uuid));
create policy "statement_objects_delete" on storage.objects for delete to authenticated using(bucket_id='financial-statements' and is_household_member((storage.foldername(name))[1]::uuid));
