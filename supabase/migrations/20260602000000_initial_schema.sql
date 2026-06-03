-- Tuneup initial schema

-- Extensions
create extension if not exists pgcrypto with schema extensions;

-- Households
create table public.households (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  household_id uuid references public.households(id) on delete set null,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now()
);

-- Invites (link + QR code flow)
create table public.invites (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  invited_by uuid not null references public.profiles(id) on delete cascade,
  code text not null unique default encode(extensions.gen_random_bytes(6), 'hex'),
  accepted_by uuid references public.profiles(id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

-- Meeting settings (one per household)
create table public.meeting_settings (
  household_id uuid primary key references public.households(id) on delete cascade,
  meeting_day text not null default 'Sunday',
  meeting_time text not null default '20:00',
  timebox_default integer not null default 20,
  repeating_categories text[] not null default '{appreciation,logistics,division-of-labor,kids}',
  notification_enabled boolean not null default true,
  notification_minutes_before integer not null default 30
);

-- Agenda items
create table public.agenda_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  text text not null,
  category text not null,
  added_by uuid not null references public.profiles(id) on delete cascade,
  repeating boolean not null default false,
  discussed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Meetings (history stored from day one)
create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  mode text not null default 'standard' check (mode in ('standard', 'five-min')),
  current_step text not null default 'headspace',
  current_topic_index integer not null default 0,
  completed boolean not null default false
);

-- Meeting agenda snapshot (captures what was discussed in each meeting)
create table public.meeting_agenda_snapshots (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  agenda_item_id uuid not null references public.agenda_items(id) on delete cascade,
  discussed boolean not null default false
);

-- Action items
create table public.action_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  meeting_id uuid references public.meetings(id) on delete set null,
  text text not null,
  assignee uuid not null references public.profiles(id) on delete cascade,
  done boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Labor tasks
create table public.labor_tasks (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  domain text not null,
  text text not null,
  owner text not null default 'unassigned',
  custom boolean not null default false,
  created_at timestamptz not null default now()
);

-- Push notification subscriptions
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  unique(user_id, endpoint)
);

-- Indexes
create index idx_agenda_items_household on public.agenda_items(household_id);
create index idx_action_items_household on public.action_items(household_id);
create index idx_meetings_household on public.meetings(household_id);
create index idx_labor_tasks_household on public.labor_tasks(household_id);
create index idx_invites_code on public.invites(code);
create index idx_profiles_household on public.profiles(household_id);

-- Enable Row Level Security on all tables
alter table public.households enable row level security;
alter table public.profiles enable row level security;
alter table public.invites enable row level security;
alter table public.meeting_settings enable row level security;
alter table public.agenda_items enable row level security;
alter table public.meetings enable row level security;
alter table public.meeting_agenda_snapshots enable row level security;
alter table public.action_items enable row level security;
alter table public.labor_tasks enable row level security;
alter table public.push_subscriptions enable row level security;

-- RLS Policies

-- Profiles: users can read their own + their partner's profile
create policy "Users can read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can read household members"
  on public.profiles for select
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (id = auth.uid());

-- Households: members can read their own household
create policy "Members can read own household"
  on public.households for select
  using (
    id in (select household_id from public.profiles where id = auth.uid())
  );

create policy "Authenticated users can create households"
  on public.households for insert
  with check (true);

-- Invites: creator can manage, anyone can read by code (for accepting)
create policy "Invite creator can read own invites"
  on public.invites for select
  using (invited_by = auth.uid());

create policy "Anyone can read invite by code"
  on public.invites for select
  using (true);

create policy "Members can create invites"
  on public.invites for insert
  with check (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Invite can be accepted"
  on public.invites for update
  using (accepted_by is null and expires_at > now());

-- Meeting settings: household members can read/write
create policy "Members can read meeting settings"
  on public.meeting_settings for select
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Members can upsert meeting settings"
  on public.meeting_settings for insert
  with check (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Members can update meeting settings"
  on public.meeting_settings for update
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

-- Agenda items: household members can CRUD
create policy "Members can read agenda items"
  on public.agenda_items for select
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Members can create agenda items"
  on public.agenda_items for insert
  with check (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Members can update agenda items"
  on public.agenda_items for update
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Members can delete agenda items"
  on public.agenda_items for delete
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

-- Meetings: household members can CRUD
create policy "Members can read meetings"
  on public.meetings for select
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Members can create meetings"
  on public.meetings for insert
  with check (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Members can update meetings"
  on public.meetings for update
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

-- Meeting agenda snapshots: same as meetings
create policy "Members can read meeting snapshots"
  on public.meeting_agenda_snapshots for select
  using (
    meeting_id in (
      select id from public.meetings where household_id in (
        select household_id from public.profiles where id = auth.uid()
      )
    )
  );

create policy "Members can create meeting snapshots"
  on public.meeting_agenda_snapshots for insert
  with check (
    meeting_id in (
      select id from public.meetings where household_id in (
        select household_id from public.profiles where id = auth.uid()
      )
    )
  );

create policy "Members can update meeting snapshots"
  on public.meeting_agenda_snapshots for update
  using (
    meeting_id in (
      select id from public.meetings where household_id in (
        select household_id from public.profiles where id = auth.uid()
      )
    )
  );

-- Action items: household members can CRUD
create policy "Members can read action items"
  on public.action_items for select
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Members can create action items"
  on public.action_items for insert
  with check (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Members can update action items"
  on public.action_items for update
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Members can delete action items"
  on public.action_items for delete
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

-- Labor tasks: household members can CRUD
create policy "Members can read labor tasks"
  on public.labor_tasks for select
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Members can create labor tasks"
  on public.labor_tasks for insert
  with check (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Members can update labor tasks"
  on public.labor_tasks for update
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

create policy "Members can delete labor tasks"
  on public.labor_tasks for delete
  using (
    household_id in (
      select household_id from public.profiles where id = auth.uid()
    )
  );

-- Push subscriptions: users manage their own
create policy "Users can read own subscriptions"
  on public.push_subscriptions for select
  using (user_id = auth.uid());

create policy "Users can create own subscriptions"
  on public.push_subscriptions for insert
  with check (user_id = auth.uid());

create policy "Users can delete own subscriptions"
  on public.push_subscriptions for delete
  using (user_id = auth.uid());

-- Function: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function: accept invite (joins user to household)
create or replace function public.accept_invite(invite_code text)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare
  v_invite record;
  v_household_id uuid;
begin
  select * into v_invite
  from public.invites
  where code = invite_code
    and accepted_by is null
    and expires_at > now();

  if not found then
    raise exception 'Invalid or expired invite code';
  end if;

  v_household_id := v_invite.household_id;

  update public.profiles
  set household_id = v_household_id, role = 'member'
  where id = auth.uid();

  update public.invites
  set accepted_by = auth.uid(), accepted_at = now()
  where id = v_invite.id;

  return v_household_id;
end;
$$;

-- Enable realtime on key tables
alter publication supabase_realtime add table public.agenda_items;
alter publication supabase_realtime add table public.action_items;
alter publication supabase_realtime add table public.meetings;
alter publication supabase_realtime add table public.labor_tasks;
