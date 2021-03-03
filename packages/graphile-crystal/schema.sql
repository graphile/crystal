create extension if not exists citext;
create extension if not exists pgcrypto;

drop schema if exists app_public cascade;

create schema app_public;

create table app_public.users (
  id uuid primary key default gen_random_uuid(),
  username citext not null unique,
  gravatar_url text,
  created_at timestamptz not null default now()
);

create table app_public.forums (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

create table app_public.messages (
  id uuid primary key default gen_random_uuid(),
  body text not null,
  forum_id uuid not null references app_public.forums,
  author_id uuid not null references app_public.users,
  created_at timestamptz not null default now()
);
