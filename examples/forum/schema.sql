-- We begin a transaction so that if any SQL statement fails, none of the
-- changes will be applied.
begin;

-- We want to cryptographically hash passwords, therefore create this
-- extension.
create extension if not exists pgcrypto;

-- Create the schema we are going to use.
create schema forum_example;

-- Create a schema to host the utilities for our schema. The reason it is in
-- another schema is so that it can be private.
create schema forum_example_utils;

-- By setting the `search_path`, whenever we create something in the default
-- namespace it is actually created in the `forum_example` schema.
--
-- For example, this lets us write `create table person …` instead of
-- `create table forum_example.person …`.
set search_path = forum_example, forum_example_utils, public;

-------------------------------------------------------------------------------
-- Roles

create role anon_role;
create role user_role;

-------------------------------------------------------------------------------
-- Public Tables

create table person (
  id               serial not null primary key,
  given_name       varchar(64) not null,
  family_name      varchar(64),
  about            text,
  created_at       timestamp,
  updated_at       timestamp
);

comment on table person is 'A user of the forum.';
comment on column person.id is 'The primary key for the person.';
comment on column person.given_name is 'The person’s first name.';
comment on column person.family_name is 'The person’s last name.';
comment on column person.about is 'A short description about the user, written by the user.';
comment on column person.created_at is 'The time this person was created.';
comment on column person.updated_at is 'The latest time this person was updated.';

alter table person enable row level security;

create policy view_policy on person
  for select
  using(true);

create type post_topic as enum ('discussion', 'inspiration', 'help');

create table post (
  id               serial not null primary key,
  author_id        int not null references person(id),
  headline         text not null,
  topic            post_topic,
  body             text,
  created_at       timestamp,
  updated_at       timestamp
);

-- about row level security
-- all normal access to the table for selecting rows or modifying rows must be allowed by a row security policy
-- If no policy exists for the table, a default-deny policy is used, meaning that no rows are visible or can be modified
alter table post enable row level security;

create policy view_policy on post
  for select
  using(true);

create policy insert_policy on post
  for insert
  to user_role
  with check(true);

create policy update_policy on post
  for update
  to user_role
  with check (author_id = (select current_setting('jwt.claims.person_id')::integer));

create policy delete_policy on post
  for delete
  to user_role
  using (author_id = (select current_setting('jwt.claims.person_id')::integer));


comment on table post is 'A forum post written by a user.';
comment on column post.id is 'The primary key for the post.';
comment on column post.headline is 'The title written by the user.';
comment on column post.author_id is 'The id of the author user.';
comment on column post.topic is 'The topic this has been posted in.';
comment on column post.body is 'The main body text of our post.';
comment on column post.created_at is 'The time this post was created.';
comment on column post.updated_at is 'The latest time this post was updated.';

-------------------------------------------------------------------------------
-- Private Tables

create table forum_example_utils.person_account (
  person_id        int not null primary key,
  email            varchar not null unique check (email ~* '^.+@.+\..+$'),
  pass_hash        char(60) not null
);

comment on table person_account is 'Private information about a person’s account.';
comment on column person_account.person_id is 'The id of the person associated with this account.';
comment on column person_account.email is 'The email address of the person.';
comment on column person_account.pass_hash is 'An opaque hash of the person’s password.';

-------------------------------------------------------------------------------
-- Query Procedures

-- Computes the full name for a person using the person’s `given_name` and a
-- `family_name`.
create function person_full_name(person) returns varchar as $$
  select $1.given_name || ' ' || $1.family_name
$$ language sql
stable;

comment on function person_full_name(person) is 'A person’s full name including their first and last name.';

-- Fetches and returns the latest post authored by our person.
create function person_latest_post(person) returns post as $$
  select *
  from post
  where author_id = $1.id
  order by created_at desc
  limit 1
$$ language sql
stable
set search_path from current;

comment on function person_latest_post(person) is 'Get’s the latest post written by the person.';

-- Truncates the body with a given length and a given omission character. The
-- reason we don’t use defaults is because PostGraphQL will always send three
-- parameters and if one parameter is null, the default won’t be used.
create function post_summary(
  post,
  length int,
  omission varchar
) returns text as $$
  select case
    when $1.body is null then null
    else substring($1.body from 0 for coalesce(length, 50)) || coalesce(omission, '…')
  end
$$ language sql
stable;

comment on function post_summary(post, int, varchar) is 'A truncated version of the body for summaries.';

-- A procedure to search the headline and body of all posts using a given
-- search term.
create function search_posts(search varchar) returns setof post as $$
  select * from post where headline ilike ('%' || search || '%') or body ilike ('%' || search || '%')
$$ language sql
stable
set search_path from current;

comment on function search_posts(varchar) is 'Returns posts containing a given search term.';

-------------------------------------------------------------------------------
-- Mutation Procedures

-- Registers a person in our forum with a few key parameters creating a
-- `person` row and an associated `person_account` row.
create function register_person(
  given_name varchar,
  family_name varchar,
  email varchar,
  password varchar
) returns person as $$
declare
  row person;
begin
  -- Insert the person’s public profile data.
  insert into person (given_name, family_name) values
    (given_name, family_name)
    returning * into row;

  -- Insert the person’s private account data.
  insert into person_account (person_id, email, pass_hash) values
    (row.id, email, crypt(password, gen_salt('bf')));

  return row;
end;
$$ language plpgsql
strict
set search_path from current;

comment on function register_person(varchar, varchar, varchar, varchar) is 'Register a person in our forum.';

-------------------------------------------------------------------------------
-- Triggers

-- First we must define two utility functions, `set_created_at` and
-- set_updated_at` which we will use for our triggers.
--
-- Note that we also create them in `forum_example_utils` as we want them to be
-- private and not exposed by PostGraphQL.
--
-- Triggers taken initially from the Rust [Diesel][1] library, documentation
-- for `is distinct from` can be found [here][2].
--
-- [1]: https://github.com/diesel-rs/diesel/blob/1427b9f/diesel/src/pg/connection/setup/timestamp_helpers.sql
-- [2]: https://wiki.postgresql.org/wiki/Is_distinct_from

create function forum_example_utils.set_created_at() returns trigger as $$
begin
  -- We will let the inserter manually set a `created_at` time if they desire.
  if (new.created_at is null) then
    new.created_at := current_timestamp;
  end if;
  return new;
end;
$$ language plpgsql;

create function forum_example_utils.set_updated_at() returns trigger as $$
begin
  new.updated_at := current_timestamp;
  return new;
end;
$$ language plpgsql;

-- Next we must actually define our triggers for all tables that need them.
--
-- This is not a good example to copy if you are looking for a good way to
-- indent and style your trigger statements. They are all on one line to
-- conserve space :)

create trigger created_at before insert on person for each row execute procedure set_created_at();
create trigger updated_at before update on person for each row execute procedure set_updated_at();
create trigger created_at before insert on post for each row execute procedure set_created_at();
create trigger updated_at before update on post for each row execute procedure set_updated_at();

-------------------------------------------------------------------------------
-- Sample Data

insert into person (id, given_name, family_name, about) values
  (1, 'Kathryn', 'Ramirez', null),
  (2, 'Johnny', 'Tucker', null),
  (3, 'Nancy', 'Diaz', null),
  (4, 'Russell', 'Gardner', null),
  (5, 'Ann', 'West', null),
  (6, 'Joe', 'Cruz', null),
  (7, 'Scott', 'Torres', null),
  (8, 'David', 'Bell', null),
  (9, 'Carl', 'Ward', null),
  (10, 'Jonathan', 'Campbell', null),
  (11, 'Beverly', 'Kelly', null),
  (12, 'Kelly', 'Reed', null),
  (13, 'Nicholas', 'Perry', null),
  (14, 'Carol', 'Taylor', null);

alter sequence person_id_seq restart with 15;

select register_person('John', 'Doe', 'john@doe.com', 'password');

insert into post (id, author_id, headline, topic, body) values
  (1, 2, 'No… It’s a thing; it’s like a plan, but with more greatness.', null, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ullamcorper, sem sed pulvinar rutrum, nisl dui faucibus velit, eget sodales urna mauris nec lorem. Vivamus faucibus augue sit amet semper fringilla. Cras nec vulputate eros. Proin fermentum purus posuere ipsum accumsan interdum. Nunc vitae urna non mauris pellentesque sodales vel nec elit. Suspendisse pulvinar ornare turpis ac vestibulum. Cras eu congue magna. Nulla vel sodales enim, vel semper dolor. Curabitur pellentesque dolor elit. Aenean cursus posuere dui, vitae mollis felis rhoncus ac. In at orci a erat congue consequat ut sed risus. Etiam euismod elit eu lobortis varius. Praesent lacinia lobortis nisi, vel faucibus turpis sodales in. In interdum lectus tellus, facilisis mollis diam feugiat vitae.'),
  (2, 1, 'I hate yogurt. It’s just stuff with bits in.', 'inspiration', null),
  (3, 1, 'Is that a cooking show?', 'inspiration', null),
  (4, 1, 'You hit me with a cricket bat.', null, null),
  (5, 5, 'Please, Don-Bot… look into your hard drive, and open your mercy file!', null, null),
  (6, 3, 'Stop talking, brain thinking. Hush.', null, null),
  (7, 1, 'Large bet on myself in round one.', 'discussion', null),
  (8, 2, 'It’s a fez. I wear a fez now. Fezes are cool.', 'inspiration', null),
  (9, 3, 'You know how I sometimes have really brilliant ideas?', null, null),
  (10, 2, 'What’s with you kids? Every other day it’s food, food, food.', 'discussion', null),
  (11, 3, 'They’re not aliens, they’re Earth…liens!', 'help', null),
  (12, 5, 'You’ve swallowed a planet!', null, null);

alter sequence post_id_seq restart with 13;

-------------------------------------------------------------------------------
-- Permissions

grant usage on schema forum_example to anon_role;
grant select on person, post to anon_role;

grant anon_role to user_role;
grant usage on all sequences in schema forum_example to user_role;
alter default privileges in schema forum_example grant usage on sequences to user_role;
grant insert, update, delete on all tables in schema forum_example to user_role;

-- Commit all the changes from this transaction. If any statement failed,
-- these statements will not have succeeded.
commit;
