-- We begin a transaction so that if any SQL statement fails, none of the
-- changes will be applied.
begin;

-- Create the schema we are going to use.
create schema forum_example;

-- Create a schema to host the utilities for our schema. The reason it is in
-- another schema is so that it can be private.
create schema forum_example_utils;

-- By setting the `search_path`, whenever we create something in the default
-- namespace it is actually created in the `blog_example` schema.
--
-- For example, this lets us write `create table person …` instead of
-- `create table forum_example.person …`.
set search_path = forum_example, forum_example_utils;

-------------------------------------------------------------------------------
-- Basic Tables

create type entity_status as enum('new','updated','deleted');

create table person (
  id               serial not null primary key,
  given_name       varchar(64) not null,
  family_name      varchar(64),
  about            text,
  created_at       timestamp,
  updated_at       timestamp,
  status           entity_status
);

comment on table person is 'A user of the forum.';
comment on column person.id is 'The primary key for the person.';
comment on column person.given_name is 'The person’s first name.';
comment on column person.family_name is 'The person’s last name.';
comment on column person.about is 'A short description about the user, written by the user.';
comment on column person.created_at is 'The time this person was created.';
comment on column person.updated_at is 'The latest time this person was updated.';

create type post_topic as enum ('discussion', 'inspiration', 'help');

create table post (
  id               serial not null primary key,
  author_id        int not null references person(id),
  headline         text not null,
  topic            post_topic,
  body             text,
  created_at       timestamp,
  updated_at       timestamp,
  status           entity_status
);

comment on table post is 'A forum post written by a user.';
comment on column post.id is 'The primary key for the post.';
comment on column post.headline is 'The title written by the user.';
comment on column post.author_id is 'The id of the author user.';
comment on column post.topic is 'The topic this has been posted in.';
comment on column post.body is 'The main body text of our post.';
comment on column post.created_at is 'The time this post was created.';
comment on column post.updated_at is 'The latest time this post was updated.';

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
-- [1]: https://github.com/diesel-rs/diesel/blob/1427b9ff24960483b70b5ed491e7d8ef3ed52ffe/diesel/src/pg/connection/setup/timestamp_helpers.sql
-- [2]: https://wiki.postgresql.org/wiki/Is_distinct_from

create function forum_example_utils.set_created_at() returns trigger as $$ begin
  -- We will let the inserter manually set a `created_at` time if they desire.
  if (new.created_at is null) then
    new.created_at := current_timestamp;
  end if;
  return new;
end; $$ language plpgsql;

create function forum_example_utils.set_updated_at() returns trigger as $$ begin
  new.updated_at := current_timestamp;
  return new;
end; $$ language plpgsql;

-- Next we must actually define our triggers for all tables that need them.
--
-- This is not a good example to copy if you are looking for a good way to
-- indent and style your trigger statements. They are all on one line to
-- conserve space 😊

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

insert into post (id, author_id, headline, topic, body) values
  (1, 2, 'No… It’s a thing; it’s like a plan, but with more greatness.', null, null),
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

grant select on person, post to public;

-- Commit all the changes from this transaction. If any statement failed,
-- these statements will not have succeeded.
commit;
