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

insert into app_public.messages (forum_id, author_id, body, featured, archived_at)
select forums.id, users.id, forums.name || ' = awesome -- ' || users.username, (forums.name = 'Postgres' and users.username = 'Bob'), (case when forums.name = 'Dogs' then now() else null end)
  from app_public.users, app_public.forums
  order by forums.id, users.id;
