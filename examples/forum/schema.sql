-- We begin a transaction so that if any SQL statement fails, none of the
-- changes will be applied.
begin;

-- Create the schema we are going to use.
create schema forum_example;

-- By setting the `search_path`, whenever we create something in the default
-- namespace it is actually created in the `blog_example` schema.
--
-- For example, this lets us write `create table person …` instead of
-- `create table forum_example.person …`.
set search_path = forum_example;

-------------------------------------------------------------------------------
-- Basic Tables

create table person (
  id               serial not null primary key,
  given_name       varchar(64) not null,
  family_name      varchar(64),
  about            text
);

comment on table person is 'A user of the forum.';
comment on column person.id is 'The primary key for the person.';
comment on column person.given_name is 'The person’s first name.';
comment on column person.family_name is 'The person’s last name.';
comment on column person.about is 'A short description about the user, written by the user.';

create type post_topic as enum ('discussion', 'inspiration', 'help');

create table post (
  id               serial not null primary key,
  author_id        int not null references person(id),
  headline         text not null,
  topic            post_topic,
  body             text
);

comment on table post is 'A forum post written by a user.';
comment on column post.id is 'The primary key for the post.';
comment on column post.headline is 'The title written by the user.';
comment on column post.author_id is 'The id of the author user.';
comment on column post.body is 'The main body text of our post.';

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
