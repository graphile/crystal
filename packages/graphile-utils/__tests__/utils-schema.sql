-- WARNING: this database is shared with postgraphile-core, don't run the tests in parallel!
drop schema if exists graphile_utils cascade;

create schema graphile_utils;

create type graphile_utils.complex as (
  number_int int,
  string_text text
);

create table graphile_utils.users (
  id serial primary key,
  name text not null,
  email text not null,
  bio text,
  slightly_more_complex_column graphile_utils.complex[] default array[row(1,'hi'),row(2, 'bye')]::graphile_utils.complex[],
  created_at timestamptz not null default now()
);

create table graphile_utils.pets (
  id serial primary key,
  user_id int not null, -- DELIBERATELY NO REFERENCE: references graphile_utils.users,
  name text not null,
  type text not null
);
create index on graphile_utils.pets(user_id);

comment on column graphile_utils.users.slightly_more_complex_column is E'@name renamedComplexColumn';

insert into graphile_utils.users (name, email, bio) values
  ('Alice', 'alice@example.com', null),
  ('Bob', 'bob@example.com', 'I''m a thought leader!'),
  ('Caroline', 'caroline@example.com', 'Saving the world, one disease at a time');

insert into graphile_utils.pets (user_id, type, name) values
  (2, 'cat', 'Felix'),
  (2, 'dog', 'Fido'),
  (3, 'goldfish', 'Goldie'),
  (3, 'goldfish', 'Spot'),
  (3, 'goldfish', 'Albert');

create table graphile_utils.test_smart_tags (
  email text not null unique,
  value int
);
comment on table graphile_utils.test_smart_tags is E'@omit';

insert into graphile_utils.test_smart_tags (email, value)  values
  ('bob@example.com', 42),
  ('caroline@example.com', 9999);
