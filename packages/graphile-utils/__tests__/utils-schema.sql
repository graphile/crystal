-- WARNING: this database is shared with postgraphile-core, don't run the tests in parallel!
drop schema if exists a, b, c, d cascade;

create schema a;
create schema b;
create schema c;
create schema d;

create table a.users (
  id serial primary key,
  name text not null,
  email text not null,
  bio text,
  created_at timestamptz not null default now()
);

insert into a.users (name, email, bio) values
  ('Alice', 'alice@example.com', null),
  ('Bob', 'bob@example.com', 'I''m a thought leader!'),
  ('Caroline', 'caroline@example.com', 'Saving the world, one disease at a time');
