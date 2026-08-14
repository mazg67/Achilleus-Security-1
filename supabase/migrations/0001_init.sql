-- Achilleus Security Hospitality Suite Manager — initial schema
-- Run this in the Supabase SQL editor, or via `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text not null check (role in ('admin', 'editor', 'viewer')),
  must_change_password boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  dietary text default 'None',
  notes text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists fixtures (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  kickoff_time time not null,
  opponent text not null,
  opponent_primary_colour text,
  opponent_secondary_colour text,
  opponent_abbreviation text,
  competition text default 'Premier League',
  venue text default 'Portman Road',
  status text default 'upcoming' check (status in ('upcoming', 'today', 'completed')),
  notes text,
  football_data_fixture_id integer unique,
  created_at timestamptz default now()
);

create table if not exists seat_config (
  id int primary key,
  label text not null,
  type text not null check (type in ('fixed', 'rotating', 'host')),
  default_guest_id uuid references guests(id) on delete set null
);

create table if not exists seat_allocations (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid references fixtures(id) on delete cascade,
  seat_id int references seat_config(id),
  guest_id uuid references guests(id) on delete set null,
  host_name text,
  arrival_time time,
  notes text,
  unique(fixture_id, seat_id)
);

create table if not exists menus (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid references fixtures(id) on delete cascade unique,
  welcome_drinks text,
  starter text,
  main_course text,
  dessert text,
  drinks_included text,
  additional_notes text,
  updated_at timestamptz default now()
);

create table if not exists settings (
  id int primary key default 1,
  box_name text default 'Achilleus Security Hospitality Suite',
  suite_name text default 'Sir Bobby Robson Executive Suite',
  hospitality_entrance text default 'Sir Alf Ramsey Stand — Portman Road Entrance',
  box_office_location text default 'East of England Co-op Stand, Gate C',
  stadium_address text default 'Portman Road, Ipswich, Suffolk, IP1 2DA',
  box_opens_before_ko int default 120,
  box_closes_after_ko int default 75,
  season text default '2026/27',
  total_seats int default 14,
  constraint settings_singleton check (id = 1)
);

-- ---------------------------------------------------------------------------
-- Helper functions (SECURITY DEFINER so they can read profiles under RLS)
-- ---------------------------------------------------------------------------

create or replace function public.current_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select role from profiles where id = auth.uid()) = 'admin', false);
$$;

create or replace function public.is_editor_or_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select role from profiles where id = auth.uid()) in ('admin', 'editor'), false);
$$;

-- Auto-create a profile row when a new auth user is created (used by the seed
-- script / future admin "create user" flow). name/role come from user_metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'viewer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Prevent non-admins from changing their own role via a self-service update.
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_role_change on profiles;
create trigger on_profile_role_change
  before update on profiles
  for each row execute function public.prevent_role_self_escalation();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table profiles enable row level security;
alter table guests enable row level security;
alter table fixtures enable row level security;
alter table seat_config enable row level security;
alter table seat_allocations enable row level security;
alter table menus enable row level security;
alter table settings enable row level security;

-- profiles
create policy "profiles_select_all" on profiles for select to authenticated using (true);
create policy "profiles_update_self_or_admin" on profiles for update to authenticated
  using (id = auth.uid() or public.is_admin());
create policy "profiles_insert_admin" on profiles for insert to authenticated
  with check (public.is_admin());
create policy "profiles_delete_admin" on profiles for delete to authenticated
  using (public.is_admin());

-- guests
create policy "guests_select_all" on guests for select to authenticated using (true);
create policy "guests_insert_editor_or_admin" on guests for insert to authenticated
  with check (public.is_editor_or_admin());
create policy "guests_update_editor_or_admin" on guests for update to authenticated
  using (public.is_editor_or_admin());
create policy "guests_delete_admin" on guests for delete to authenticated
  using (public.is_admin());

-- fixtures (create/edit/delete = admin only, per spec)
create policy "fixtures_select_all" on fixtures for select to authenticated using (true);
create policy "fixtures_insert_admin" on fixtures for insert to authenticated
  with check (public.is_admin());
create policy "fixtures_update_admin" on fixtures for update to authenticated
  using (public.is_admin());
create policy "fixtures_delete_admin" on fixtures for delete to authenticated
  using (public.is_admin());

-- seat_config
create policy "seat_config_select_all" on seat_config for select to authenticated using (true);
create policy "seat_config_write_admin" on seat_config for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- seat_allocations
create policy "seat_allocations_select_all" on seat_allocations for select to authenticated using (true);
create policy "seat_allocations_write_editor_or_admin" on seat_allocations for all to authenticated
  using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

-- menus
create policy "menus_select_all" on menus for select to authenticated using (true);
create policy "menus_write_editor_or_admin" on menus for all to authenticated
  using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

-- settings
create policy "settings_select_all" on settings for select to authenticated using (true);
create policy "settings_update_admin" on settings for update to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------

alter publication supabase_realtime add table seat_allocations;
alter publication supabase_realtime add table guests;
