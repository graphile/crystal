-- WARNING: this database is shared with postgraphile-core, don't run the tests in parallel!
drop schema if exists graphile_utils cascade;
drop schema if exists graphile_utils_2 cascade;

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

-- For RegisterUserPlugin test
create schema graphile_utils_2;
create table graphile_utils_2.users (
    id serial primary key,
    username text not null,
    constraint unique_user_username unique (username)
);
create table graphile_utils_2.user_emails (
    user_id int primary key references graphile_utils_2.users,
    email text not null,
    constraint unique_user_email unique (email)
);

-- See https://github.com/benjie/ouch-my-finger/pull/21
create schema achintha_side_effects;

create table achintha_side_effects.shop(
  id serial primary key,
  name text,
  type text not null,
  has_clinic boolean
);
insert into achintha_side_effects.shop
  (name, type, has_clinic) values
  ('Super Axinom', 'super', true),
  ('Local Keells', 'local', false);

create table achintha_side_effects.animal(
  id serial primary key,
  name text,
  type text not null,
  shop_id integer not null
);
comment on table achintha_side_effects.animal is $$
  @interface mode:single type:type
  @type cat name:CatAnimal
  @type dog name:DogAnimal
$$;
insert into achintha_side_effects.animal
  (name, type, shop_id) values
  ('Niki', 'dog', 1),
  ('Milo', 'cat', 2);

create table achintha_side_effects.owner(
  id serial primary key,
  animal_id integer not null,
  owner_type text not null,
  owner_id integer not null
);
insert into achintha_side_effects.owner
  (animal_id, owner_type, owner_id) values
  (1, 'person', 5),
  (2, 'shop', 6);
