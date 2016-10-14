-- We begin a transaction so that if any SQL statement fails, none of the
-- changes will be applied.
begin;

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Create the schema we are going to use.
create schema forum_example;

-- Create a schema to host the utilities for our schema. The reason it is in
-- another schema is so that it can be private.
create schema forum_example_private;

-------------------------------------------------------------------------------
-- Public Tables

create table forum_example.person (
  id               uuid not null primary key default uuid_generate_v1mc(),
  first_name       text not null,
  last_name        text,
  about            text,
  created_at       timestamp,
  updated_at       timestamp
);

comment on table forum_example.person is 'A user of the forum.';
comment on column forum_example.person.id is 'The primary key for the person.';
comment on column forum_example.person.first_name is 'The person’s first name.';
comment on column forum_example.person.last_name is 'The person’s last name.';
comment on column forum_example.person.about is 'A short description about the user, written by the user.';
comment on column forum_example.person.created_at is 'The time this person was created.';
comment on column forum_example.person.updated_at is 'The latest time this person was updated.';

create domain forum_example.email as text
  check (value ~* '^.+@.+\..+$');

create table forum_example.person_account (
  person_id        uuid not null primary key references forum_example.person(id),
  email            forum_example.email not null unique,
  pass_hash        char(60) not null
);

comment on table forum_example.person_account is 'Private information about a person’s account.';
comment on column forum_example.person_account.person_id is 'The id of the person associated with this account.';
comment on column forum_example.person_account.email is 'The email address of the person.';
comment on column forum_example.person_account.pass_hash is 'An opaque hash of the person’s password.';

create type forum_example.post_topic as enum (
  'discussion',
  'inspiration',
  'help'
);

create table forum_example.post (
  id               uuid not null primary key default uuid_generate_v1mc(),
  author_id        uuid not null references forum_example.person(id),
  headline         text not null check (char_length(headline) < 500),
  topic            forum_example.post_topic,
  body             text,
  created_at       timestamp,
  updated_at       timestamp
);

comment on table forum_example.post is 'A forum post written by a user.';
comment on column forum_example.post.id is 'The primary key for the post.';
comment on column forum_example.post.headline is 'The title written by the user.';
comment on column forum_example.post.author_id is 'The id of the author user.';
comment on column forum_example.post.topic is 'The topic this has been posted in.';
comment on column forum_example.post.body is 'The main body text of our post.';
comment on column forum_example.post.created_at is 'The time this post was created.';
comment on column forum_example.post.updated_at is 'The latest time this post was updated.';

-------------------------------------------------------------------------------
-- Query Procedures

-- Computes the full name for a person using the person’s `given_name` and a
-- `family_name`.
create function forum_example.person_full_name(person) returns text as $$
  select $1.first_name || ' ' || $1.last_name
$$ language sql
stable;

comment on function forum_example.person_full_name(person) is 'A person’s full name including their first and last name.';

-- Fetches and returns the latest post authored by our person.
create function forum_example.person_latest_post(person) returns post as $$
  select *
  from forum_example.post
  where author_id = $1.id
  order by created_at desc
  limit 1
$$ language sql
stable;

comment on function forum_example.person_latest_post(person) is 'Get’s the latest post written by the person.';

-- Truncates the body with a given length and a given omission character. The
-- reason we don’t use defaults is because PostGraphQL will always send three
-- parameters and if one parameter is null, the default won’t be used.
create function forum_example.post_summary(
  post,
  length int,
  omission text
) returns text as $$
  select case
    when $1.body is null then null
    else substring($1.body from 0 for coalesce(length, 50)) || coalesce(omission, '…')
  end
$$ language sql
stable;

comment on function forum_example.post_summary(post, int, text) is 'A truncated version of the body for summaries.';

-- A procedure to search the headline and body of all posts using a given
-- search term.
create function forum_example.search_posts(search text) returns setof post as $$
  select *
  from forum_example.post
  where headline ilike ('%' || search || '%') or body ilike ('%' || search || '%')
$$ language sql
stable;

comment on function forum_example.search_posts(text) is 'Returns posts containing a given search term.';

-------------------------------------------------------------------------------
-- Mutation Procedures

-- Registers a person in our forum with a few key parameters creating a
-- `person` row and an associated `person_account` row.
create function forum_example.register_person(
  given_name text,
  family_name text,
  email text,
  password text
) returns person as $$
declare
  row person;
begin
  -- Insert the person’s public profile data.
  insert into forum_example.person (given_name, family_name) values
    (given_name, family_name)
    returning * into row;

  -- Insert the person’s private account data.
  insert into forum_example.person_account (person_id, email, pass_hash) values
    (row.id, email, crypt(password, gen_salt('bf')));

  return row;
end;
$$ language plpgsql
strict;

comment on function forum_example.register_person(text, text, text, text) is 'Register a person in our forum.';

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

create function forum_example_private.set_created_at() returns trigger as $$
begin
  -- We will let the inserter manually set a `created_at` time if they desire.
  if (new.created_at is null) then
    new.created_at := current_timestamp;
  end if;
  return new;
end;
$$ language plpgsql;

create function forum_example_private.set_updated_at() returns trigger as $$
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

create trigger created_at before insert on forum_example.person for each row execute procedure forum_example_private.set_created_at();
create trigger updated_at before update on forum_example.person for each row execute procedure forum_example_private.set_updated_at();
create trigger created_at before insert on forum_example.post for each row execute procedure forum_example_private.set_created_at();
create trigger updated_at before update on forum_example.post for each row execute procedure forum_example_private.set_updated_at();

-------------------------------------------------------------------------------
-- Permissions

grant select on forum_example.person, forum_example.post to public;

-- Commit all the changes from this transaction. If any statement failed,
-- these statements will not have succeeded.
commit;
