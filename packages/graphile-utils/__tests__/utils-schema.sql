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

comment on column graphile_utils.users.slightly_more_complex_column is E'@name renamedComplexColumn';

insert into graphile_utils.users (name, email, bio) values
  ('Alice', 'alice@example.com', null),
  ('Bob', 'bob@example.com', 'I''m a thought leader!'),
  ('Caroline', 'caroline@example.com', 'Saving the world, one disease at a time');
