create extension if not exists citext;
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

drop schema if exists app_public cascade;

create schema app_public;

create table app_public.users (
  id uuid primary key default uuid_generate_v1mc(),
  username citext not null unique,
  gravatar_url text,
  created_at timestamptz not null default now()
);

create table app_public.forums (
  id uuid primary key default uuid_generate_v1mc(),
  name text not null,
  archived_at timestamptz
);

create table app_public.messages (
  id uuid primary key default uuid_generate_v1mc(),
  forum_id uuid not null references app_public.forums,
  author_id uuid not null references app_public.users,
  body text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

insert into app_public.users (id, username) values
  ('a11ce000-0000-0000-0000-0000000a11ce','Alice'),
  ('b0b00000-0000-0000-0000-000000000b0b', 'Bob'),
  ('cec111a0-0000-0000-0000-00000cec111a', 'Cecilia');

insert into app_public.forums (id, name, archived_at) values
  ('ca700000-0000-0000-0000-000000000ca7', 'Cats', null),
  ('d0900000-0000-0000-0000-000000000d09', 'Dogs', now()),
  ('f1700000-0000-0000-0000-000000000f17', 'Postgres', null);

insert into app_public.messages (id, forum_id, author_id, body, featured, archived_at)
  select
    (substring(forums.id::text from 1 for 4) || substring(forums.id::text from 1 for 4) || '-' || substring(forums.id::text from 5 for 4) || '-0000-0000-' || substring(users.id::text from 1 for 8) || substring(forums.id::text from 1 for 4))::uuid,
    forums.id as forum_id,
    users.id as author_id,
    forums.name || ' = awesome -- ' || users.username as body,
    ((forums.name = 'Postgres' and users.username = 'Bob') or (forums.name = 'Dogs' and users.username <> 'Alice')) as featured,
    (case when forums.name = 'Dogs' then now() else null end) as archived_at
  from app_public.users, app_public.forums
  order by forums.id, users.id;

-- Custom queries
create function app_public.unique_author_count(featured bool = null) returns int as $$
  select count(distinct author_id)
  from app_public.messages
  where (
    unique_author_count.featured is null
  or
    (unique_author_count.featured is true and messages.featured is true)
  or
    (unique_author_count.featured is false and not exists (
      select 1
      from app_public.messages m2
      where m2.author_id = messages.author_id
      and m2.featured is true
    ))
  )
$$ language sql stable;
create function app_public.random_user() returns app_public.users as $$
  select users.*
  from app_public.users
  where users.id = 'b0b00000-0000-0000-0000-000000000b0b' /* user chosen by a fair dice role - 1-2 Alice, 3-4 Bob, 5-6 Cecilia */
  limit 1
$$ language sql stable;
create function app_public.featured_messages() returns setof app_public.messages as $$
  select messages.*
  from app_public.messages
  where featured is true
$$ language sql stable;

-- Computed columns
create function app_public.forums_unique_author_count(forum app_public.forums, featured bool = null) returns int as $$
  select count(distinct author_id)
  from app_public.messages
  where forum_id = forum.id
  and (
    forums_unique_author_count.featured is null
  or
    (forums_unique_author_count.featured is true and messages.featured is true)
  or
    (forums_unique_author_count.featured is false and not exists (
      select 1
      from app_public.messages m2
      where m2.author_id = messages.author_id
      and forum_id = forum.id
      and m2.featured is true
    ))
  )
$$ language sql stable;
create function app_public.forums_random_user(forum app_public.forums) returns app_public.users as $$
  select users.*
  from app_public.users
  inner join app_public.messages
  on messages.forum_id = forum.id
  where users.id = 'b0b00000-0000-0000-0000-000000000b0b' /* user chosen by a fair dice role - 1-2 Alice, 3-4 Bob, 5-6 Cecilia */
  limit 1;
$$ language sql stable;
create function app_public.forums_featured_messages(forum app_public.forums) returns setof app_public.messages as $$
  select messages.*
  from app_public.messages
  where featured is true
  and messages.forum_id = forum.id
$$ language sql stable;
