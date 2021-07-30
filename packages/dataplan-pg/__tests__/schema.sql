create extension if not exists citext;
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

drop schema if exists app_public, interfaces_and_unions, unions cascade;

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

create schema app_public;

create table app_public.users (
  id uuid primary key default uuid_generate_v1mc(),
  username citext not null unique,
  gravatar_url text,
  created_at timestamptz not null default now()
);

create table app_public.forums (
  id uuid primary key default uuid_generate_v1mc(),
  name text not null,
  archived_at timestamptz
);

create table app_public.messages (
  id uuid primary key default uuid_generate_v1mc(),
  forum_id uuid not null references app_public.forums,
  author_id uuid not null references app_public.users,
  body text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

insert into app_public.users (id, username) values
  ('a11ce000-0000-0000-0000-0000000a11ce','Alice'),
  ('b0b00000-0000-0000-0000-000000000b0b', 'Bob'),
  ('cec111a0-0000-0000-0000-00000cec111a', 'Cecilia');

insert into app_public.forums (id, name, archived_at) values
  ('ca700000-0000-0000-0000-000000000ca7', 'Cats', null),
  ('d0900000-0000-0000-0000-000000000d09', 'Dogs', now()),
  ('f1700000-0000-0000-0000-000000000f17', 'Postgres', null);

insert into app_public.messages (id, forum_id, author_id, body, featured, archived_at, created_at)
  select
    (substring(forums.id::text from 1 for 4) || substring(forums.id::text from 1 for 4) || '-' || substring(forums.id::text from 5 for 4) || '-0000-0000-' || substring(users.id::text from 1 for 8) || substring(forums.id::text from 1 for 4))::uuid,
    forums.id as forum_id,
    users.id as author_id,
    forums.name || ' = awesome -- ' || users.username as body,
    ((forums.name = 'Postgres' and users.username = 'Bob') or (forums.name = 'Dogs' and users.username <> 'Alice')) as featured,
    (case when forums.name = 'Dogs' then now() else null end) as archived_at,
    '2000-01-01T00:00:00Z'::timestamptz + (row_number() over (order by forums.id, users.id)) * interval '1 minute'
  from app_public.users, app_public.forums
  order by forums.id, users.id;

-- Custom queries
create function app_public.unique_author_count(featured bool = null) returns int as $$
  select count(distinct author_id)
  from app_public.messages
  where (
    unique_author_count.featured is null
  or
    (unique_author_count.featured is true and messages.featured is true)
  or
    (unique_author_count.featured is false and not exists (
      select 1
      from app_public.messages m2
      where m2.author_id = messages.author_id
      and m2.featured is true
    ))
  )
$$ language sql stable;
create function app_public.random_user() returns app_public.users as $$
  select users.*
  from app_public.users
  where users.id = 'b0b00000-0000-0000-0000-000000000b0b' /* user chosen by a fair dice role - 1-2 Alice, 3-4 Bob, 5-6 Cecilia */
  limit 1
$$ language sql stable;
create function app_public.featured_messages() returns setof app_public.messages as $$
  select messages.*
  from app_public.messages
  where featured is true
$$ language sql stable;

-- Computed columns
create function app_public.forums_unique_author_count(forum app_public.forums, featured bool = null) returns int as $$
  select count(distinct author_id)
  from app_public.messages
  where forum_id = forum.id
  and (
    forums_unique_author_count.featured is null
  or
    (forums_unique_author_count.featured is true and messages.featured is true)
  or
    (forums_unique_author_count.featured is false and not exists (
      select 1
      from app_public.messages m2
      where m2.author_id = messages.author_id
      and forum_id = forum.id
      and m2.featured is true
    ))
  )
$$ language sql stable;
create function app_public.forums_random_user(forum app_public.forums) returns app_public.users as $$
  select users.*
  from app_public.users
  inner join app_public.messages
  on messages.forum_id = forum.id
  where users.id = 'b0b00000-0000-0000-0000-000000000b0b' /* user chosen by a fair dice role - 1-2 Alice, 3-4 Bob, 5-6 Cecilia */
  limit 1;
$$ language sql stable;
create function app_public.forums_featured_messages(forum app_public.forums) returns setof app_public.messages as $$
  select messages.*
  from app_public.messages
  where featured is true
  and messages.forum_id = forum.id
$$ language sql stable;
create function app_public.users_most_recent_forum(u app_public.users) returns app_public.forums as $$
  select forums.*
  from app_public.forums
  inner join app_public.messages
  on messages.forum_id = forums.id
  where messages.author_id = u.id
  order by messages.created_at desc
  limit 1;
$$ language sql stable;

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

create schema interfaces_and_unions;

/*

Below here we're creating an interface like the below which all "items" share:

interface Item {
  parent: Item
  position: BigInt
  createdAt: Datetime!
  updatedAt: Datetime!
  isExplicitlyArchived: Boolean!
  archivedAt: Datetime
}

We're going to build this a few different ways because we're flexible.

*/



create type interfaces_and_unions.item_type as enum (
  'TOPIC',
  'POST',
  'DIVIDER',
  'CHECKLIST',
  'CHECKLIST_ITEM'
);

--------------------------------------------------------------------------------

-- Here's a table that stores the data for all the different types of Item; we
-- have to declare somewhere which additional columns each of the various item
-- types implements.
create table interfaces_and_unions.single_table_items (
  id serial primary key,

  -- Rails-style polymorphism column
  type interfaces_and_unions.item_type not null default 'POST'::interfaces_and_unions.item_type,

  -- Shared attributes:
  parent_id int references interfaces_and_unions.single_table_items,
  position bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_explicitly_archived bool not null default false,
  archived_at timestamptz,

  -- Attributes that may be used by one or more item subtypes.
  title text,
  description text,
  note text,
  color text
);
comment on table interfaces_and_unions.single_table_items is E'@interface single_table type\n@type TOPIC title\n@type POST title,description,note\n@type DIVIDER title,color\n@type CHECKLIST title\n@type CHECKLIST_ITEM description,note';

--------------------------------------------------------------------------------

-- In this solution there's a table (relational_items) that stores the common
-- data across all Items and there's tables for each individual item that share
-- the same primary key and stores the data specific to that item type.

create table interfaces_and_unions.relational_items (
  id serial primary key,

  -- This column is used to tell us which table we need to join to
  type interfaces_and_unions.item_type not null default 'POST'::interfaces_and_unions.item_type,

  -- Shared attributes (also 'id'):
  parent_id int references interfaces_and_unions.relational_items,
  position bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_explicitly_archived bool not null default false,
  archived_at timestamptz
);
create table interfaces_and_unions.relational_topics (
  id int primary key references interfaces_and_unions.relational_items,
  title text not null
);
create table interfaces_and_unions.relational_posts (
  id int primary key references interfaces_and_unions.relational_items,
  title text not null,
  description text,
  note text
);
create table interfaces_and_unions.relational_dividers (
  id int primary key references interfaces_and_unions.relational_items,
  title text,
  color text,
  note text
);
create table interfaces_and_unions.relational_checklists (
  id int primary key references interfaces_and_unions.relational_items,
  title text not null
);
create table interfaces_and_unions.relational_checklist_items (
  id int primary key references interfaces_and_unions.relational_items,
  description text not null,
  note text
);
comment on table interfaces_and_unions.relational_items is E'@interface relational type\n@type TOPIC relational_topics\n@type POST relational_posts\n@type DIVIDER relational_dividers\n@type CHECKLIST relational_checklists\n@type CHECKLIST_ITEM relational_checklist_items';

-- We can also apply multiple interfaces to the same tables:

create type interfaces_and_unions.commentable_type as enum (
  'POST',
  'CHECKLIST',
  'CHECKLIST_ITEM'
);

create table interfaces_and_unions.relational_commentable (
  id serial primary key,

  type interfaces_and_unions.commentable_type not null
);

alter table interfaces_and_unions.relational_posts add constraint relational_posts_commentable_fkey foreign key (id) references interfaces_and_unions.relational_commentable;
alter table interfaces_and_unions.relational_checklists add constraint relational_posts_commentable_fkey foreign key (id) references interfaces_and_unions.relational_commentable;
alter table interfaces_and_unions.relational_checklist_items add constraint relational_posts_commentable_fkey foreign key (id) references interfaces_and_unions.relational_commentable;
comment on table interfaces_and_unions.relational_commentable is E'@interface relational type\n@type POST relational_posts\n@type CHECKLIST relational_checklists\n@type CHECKLIST_ITEM relational_checklist_items';

--------------------------------------------------------------------------------

-- The degenerate case of an interface, that is an interface with no shared
-- fields, is effectively a union. Here we ignore that the 'id' column is
-- shared and mark the type as a union.

create table interfaces_and_unions.union_items (
  id serial primary key,

  -- This column is used to tell us which table we need to join to
  type interfaces_and_unions.item_type not null default 'POST'::interfaces_and_unions.item_type

  -- No shared columns!
);
create table interfaces_and_unions.union_topics (
  id int primary key references interfaces_and_unions.union_items,
  title text not null
);
create table interfaces_and_unions.union_posts (
  id int primary key references interfaces_and_unions.union_items,
  title text not null,
  description text,
  note text
);
create table interfaces_and_unions.union_dividers (
  id int primary key references interfaces_and_unions.union_items,
  title text,
  color text,
  note text
);
create table interfaces_and_unions.union_checklists (
  id int primary key references interfaces_and_unions.union_items,
  title text not null
);
create table interfaces_and_unions.union_checklist_items (
  id int primary key references interfaces_and_unions.union_items,
  description text not null,
  note text
);
comment on table interfaces_and_unions.union_items is E'@union relational type\n@type TOPIC union_topics\n@type POST union_posts\n@type DIVIDER union_dividers\n@type CHECKLIST union_checklists\n@type CHECKLIST_ITEM union_checklist_items';

--------------------------------------------------------------------------------

create table interfaces_and_unions.people (
  person_id serial primary key,
  username text not null unique
);

create table interfaces_and_unions.posts (
  post_id serial primary key,
  body text not null
);

create table interfaces_and_unions.comments (
  comment_id serial primary key,
  post_id int not null references interfaces_and_unions.posts on delete cascade,
  body text not null
);

-- A union type like this is great because functions can return it and multiple
-- tables can also have it be a column type. It only works well for single
-- primary key references though; composite references become more complex
-- (especially if there's overlap).
create type interfaces_and_unions.union__entity as (
  person_id int,
  post_id int,
  comment_id int
);
comment on type interfaces_and_unions.union__entity is
  E'@union Entity\n@foreignKey (person_id) references interfaces_and_unions.people\n@foreignKey (post_id) references interfaces_and_unions.posts\n@foreignKey (comment_id) references interfaces_and_unions.comments\nExactly one of these should be not-null at a time';

create function interfaces_and_unions.search(query text) returns setof interfaces_and_unions.union__entity as $$
-- NOTE: using `like` like this is really bad; we don't care because the body
-- of the function is unimportant in these tests, but you should not put this
-- into your own codebase thinking it's a good idea. Instead use PostgreSQL's
-- full text search (tsvector, tsquery) features.
select (person_id, null, null)::interfaces_and_unions.union__entity from interfaces_and_unions.people where username like '%' || query || '%'
union all
select (null, post_id, null)::interfaces_and_unions.union__entity from interfaces_and_unions.posts where body like '%' || query || '%'
union all
select (null, null, comment_id)::interfaces_and_unions.union__entity from interfaces_and_unions.comments where body like '%' || query || '%'
$$ language sql stable;

create table interfaces_and_unions.person_bookmarks (
  id serial primary key,
  person_id int not null references interfaces_and_unions.people on delete cascade,
  bookmarked_entity interfaces_and_unions.union__entity not null
);

create table interfaces_and_unions.person_likes (
  id serial primary key,
  person_id int not null references interfaces_and_unions.people on delete cascade,
  liked_entity interfaces_and_unions.union__entity not null
);


-- This alternative approach would construct an "ad-hoc" union for this table,
-- but isn't useful for function returns nor other tables.
create table interfaces_and_unions.person_favourites (
  id serial primary key,
  person_id int not null references interfaces_and_unions.people on delete cascade,
  liked_person_id int references interfaces_and_unions.people on delete cascade,
  liked_post_id int references interfaces_and_unions.posts on delete cascade,
  liked_comment_id int references interfaces_and_unions.comments on delete cascade
);
comment on table interfaces_and_unions.person_favourites is E'@union PersonFavouriteEntity favourite_person_id,favourite_post_id,favourite_comment_id';
