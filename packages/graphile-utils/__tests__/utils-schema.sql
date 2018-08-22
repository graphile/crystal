-- WARNING: this database is shared with postgraphile-core, don't run the tests in parallel!
drop schema if exists a, b, c, d cascade;

create schema a;
create schema b;
create schema c;
create schema d;

create type a.complex as (
  number_int int,
  string_text text
);

create table a.users (
  id serial primary key,
  name text not null,
  email text not null,
  bio text,
  slightly_more_complex_column a.complex[] default array[row(1,'hi'),row(2, 'bye')]::a.complex[],
  created_at timestamptz not null default now()
);

comment on column a.users.slightly_more_complex_column is E'@name renamedComplexColumn';

insert into a.users (name, email, bio) values
  ('Alice', 'alice@example.com', null),
  ('Bob', 'bob@example.com', 'I''m a thought leader!'),
  ('Caroline', 'caroline@example.com', 'Saving the world, one disease at a time');
