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

create function app_public.tg_messages__announce() returns trigger as $$
begin
  perform pg_notify('forum:' || NEW.forum_id::text || ':message', json_build_object('id', NEW.id, 'op', TG_OP)::text);
  return NEW;
end;
$$ language plpgsql volatile;
create trigger messages_announce after insert or update on app_public.messages
  for each row execute function app_public.tg_messages__announce();

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
  select count(distinct author_id)::int
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
create function app_public.forum_names() returns setof text as $$
  select name from app_public.forums order by name asc;
$$ language sql stable;
create function app_public.forum_names_array() returns text[] as $$
  select array_agg(name order by name asc) from app_public.forums;
$$ language sql stable;
create function app_public.forum_names_cases() returns setof text[] as $$
  select array[name, lower(name), upper(name)] as cases from app_public.forums order by name asc;
$$ language sql stable;
create function app_public.random_user() returns app_public.users as $$
  select users.*
  from app_public.users
  where users.id = 'b0b00000-0000-0000-0000-000000000b0b' /* user chosen by a fair dice role - 1-2 Alice, 3-4 Bob, 5-6 Cecilia */
  limit 1
$$ language sql stable;
create function app_public.random_user_array() returns app_public.users[] as $$
  select array_agg(users order by users.id)
  from app_public.users
  where users.id = 'b0b00000-0000-0000-0000-000000000b0b' /* user chosen by a fair dice role - 1-2 Alice, 3-4 Bob, 5-6 Cecilia */
$$ language sql stable;
create function app_public.random_user_array_set() returns setof app_public.users[] as $$
  select array_agg(users order by users.id)
  from generate_series(0, 1) i
  inner join app_public.users
  on (
    case when i = 0 then
      users.id = 'b0b00000-0000-0000-0000-000000000b0b'
    else
      users.id in ('a11ce000-0000-0000-0000-0000000a11ce', 'cec111a0-0000-0000-0000-00000cec111a')
    end
  )
  group by i
$$ language sql stable;
create function app_public.featured_messages() returns setof app_public.messages as $$
  select messages.*
  from app_public.messages
  where featured is true
$$ language sql stable;

-- Computed columns
create function app_public.forums_unique_author_count(forum app_public.forums, featured bool = null) returns int as $$
  select count(distinct author_id)::int
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
  order by messages.id
$$ language sql stable;
create function app_public.forums_messages_list_set(forum app_public.forums) returns setof app_public.messages[] as $$
  select array_agg(messages.* order by messages.id)
  from app_public.messages
  where messages.forum_id = forum.id
  group by featured
  order by featured
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

create table interfaces_and_unions.people (
  person_id serial primary key,
  username text not null unique
);

create table interfaces_and_unions.posts (
  post_id serial primary key,
  author_id int not null references interfaces_and_unions.people on delete cascade,
  body text not null
);

create table interfaces_and_unions.comments (
  comment_id serial primary key,
  author_id int not null references interfaces_and_unions.people on delete cascade,
  post_id int not null references interfaces_and_unions.posts on delete cascade,
  body text not null
);

insert into interfaces_and_unions.people (person_id, username) values
  (1, 'Alice'),
  (2, 'Benjie'),
  (3, 'Caroline'),
  (4, 'Dave'),
  (5, 'Ellie'),
  (6, 'Fred'),
  (7, 'Georgina'),
  (8, 'Harry');

insert into interfaces_and_unions.posts (post_id, author_id, body) values
  (1, 5, 'Dave do you fancy pizza?'),
  (2, 4, 'Of course, I love pizza!'),
  (3, 5, 'Sweet, I''ll order some Mighty Meaty'),
  (4, 2, 'Sounds delicious; I''m in!'),
  (5, 3, 'Let''s make a party of it!'),
  (6, 3, 'Come round ours, we can hang out on the new patio'),
  (7, 6, 'Socially distanced pizzas? Count us in too!');

insert into interfaces_and_unions.comments (comment_id, author_id, post_id, body) values
  (1, 2, 7, 'Yeah, that''s critical these days, right?'),
  (2, 6, 7, 'Sucks, but it''s true.'),
  (3, 3, 3, 'Can we have some vegan pizza for Sam?'),
  (4, 5, 3, 'Of course; I''ll grab a selection. Dave: BYOB!');

/*

Below here we're creating an interface like the below which all "items" share:

interface Item {
  parent: Item
  author: User
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

create table interfaces_and_unions.enum_table_item_type (
  type text primary key,
  description text
);

insert into interfaces_and_unions.enum_table_item_type (type) values
  ('TOPIC'),
  ('POST'),
  ('DIVIDER'),
  ('CHECKLIST'),
  ('CHECKLIST_ITEM');

--------------------------------------------------------------------------------

create function interfaces_and_unions.tg__set_type2() returns trigger as $$
begin
  -- Cannot do this via `generated always as (type::text) stored` since casting
  -- an enum to text is not immutable (since you might rename the enum value
  -- later). We won't be doing that though; so work around it with a trigger.
  NEW.type2 = NEW.type::text;
  return NEW;
end;
$$ language plpgsql volatile;


-- Here's a table that stores the data for all the different types of Item; we
-- have to declare somewhere which additional columns each of the various item
-- types implements.
create table interfaces_and_unions.single_table_items (
  id serial primary key,

  -- Rails-style polymorphism column
  type interfaces_and_unions.item_type not null default 'POST'::interfaces_and_unions.item_type,
  type2 text not null references interfaces_and_unions.enum_table_item_type,

  -- Shared attributes:
  parent_id int references interfaces_and_unions.single_table_items on delete cascade,
  author_id int not null references interfaces_and_unions.people on delete cascade,
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
create trigger set_type2 before insert or update on interfaces_and_unions.single_table_items for each row execute function interfaces_and_unions.tg__set_type2();
comment on table interfaces_and_unions.single_table_items is E'@interface single_table type\n@type TOPIC title\n@type POST title,description,note\n@type DIVIDER title,color\n@type CHECKLIST title\n@type CHECKLIST_ITEM description,note';

insert into interfaces_and_unions.single_table_items 
  (id, type,             parent_id, author_id, position, created_at,             updated_at,             is_explicitly_archived, archived_at,            color,   title, description, note) values
  (1,  'TOPIC',          null,      2,         0,        '2020-01-28T11:00:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'PostGraphile version 5', null, null),
  (2,  'TOPIC',          null,      1,         0,        '2020-03-26T13:00:00Z', '2020-03-26T14:00:00Z', true,                   '2020-03-26T14:00:00Z', null,    'Temporary test topic', null, null),
  (3,  'DIVIDER',        1,         2,         0,        '2020-01-28T11:00:00Z', '2021-07-30T14:24:00Z', false,                  null,                   'green', 'Headline features', null, null),
  (4,  'POST',           1,         2,         1,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Better planning', null, null),
  (5,  'POST',           1,         2,         2,        '2020-01-28T11:02:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Easier to code', null, null),
  (6,  'POST',           1,         2,         3,        '2020-01-28T11:03:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'More features', 'E.g. interfaces and unions', 'Also things like querying from multiple databases'),
  (7,  'POST',           1,         2,         4,        '2020-01-28T11:04:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Better performance', null, null),
  (8,  'DIVIDER',        1,         2,         5,        '2020-01-28T11:05:00Z', '2021-07-30T14:24:00Z', false,                  null,                   'blue',  'Timescale', null, null),
  (9,  'POST',           1,         2,         6,        '2020-01-28T11:06:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'When have I ever committed to a timescale?', ':D', 'It''ll be done when it''s done, I prefer longer development time and longer stable time than multiple major releases in a year or two.'),
  (10, 'TOPIC',          1,         2,         7,        '2020-01-28T11:07:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Notes', null, null),
  (11, 'TOPIC',          10,        2,         0,        '2020-01-28T11:08:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Other aims', null, null),
  (12, 'POST',           11,        2,         0,        '2020-01-28T11:09:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Fix legacy issues', null, null),
  (13, 'POST',           11,        2,         1,        '2020-01-28T11:10:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Full TypeScript conversion', null, null),
  (14, 'POST',           11,        2,         2,        '2020-01-28T11:11:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Monorepo', null, null),
  (15, 'POST',           2,         1,         0,        '2020-01-28T11:11:00Z', '2021-07-30T14:24:00Z', false,                  '2020-03-26T14:00:00Z', null,    'Just a test', null, null),
  (16, 'CHECKLIST',      4,         2,         0,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    'Planning goals', null, null),
  (17, 'CHECKLIST_ITEM', 16,        2,         0,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    null, 'Follows pattern of GraphQL resolver flow', null),
  (18, 'CHECKLIST_ITEM', 16,        3,         1,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    null, 'Has an optimisation phase', null),
  (19, 'CHECKLIST_ITEM', 16,        2,         2,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    null, 'Plan deduplication at the field level', null),
  (20, 'CHECKLIST_ITEM', 16,        2,         3,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    null, 'Garbage-collection of unused plans', null),
  (21, 'CHECKLIST_ITEM', 16,        1,         4,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null,                   null,    null, 'Supports newest GraphQL features', null);

--------------------------------------------------------------------------------

-- In this solution there's a table (relational_items) that stores the common
-- data across all Items and there's tables for each individual item that share
-- the same primary key and stores the data specific to that item type.

create table interfaces_and_unions.relational_items (
  id serial primary key,

  -- This column is used to tell us which table we need to join to
  type interfaces_and_unions.item_type not null default 'POST'::interfaces_and_unions.item_type,
  type2 text not null references interfaces_and_unions.enum_table_item_type,

  -- Shared attributes (also 'id'):
  parent_id int references interfaces_and_unions.relational_items on delete cascade,
  author_id int not null references interfaces_and_unions.people on delete cascade,
  position bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_explicitly_archived bool not null default false,
  archived_at timestamptz
);
create trigger set_type2 before insert or update on interfaces_and_unions.relational_items for each row execute function interfaces_and_unions.tg__set_type2();
create table interfaces_and_unions.relational_topics (
  id int primary key references interfaces_and_unions.relational_items,
  title text not null
);
create table interfaces_and_unions.relational_posts (
  id int primary key references interfaces_and_unions.relational_items,
  title text not null,
  description text default '-- Enter description here --',
  note text
);
create table interfaces_and_unions.relational_dividers (
  id int primary key references interfaces_and_unions.relational_items,
  title text,
  color text
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

insert into interfaces_and_unions.relational_items
  (id, type,             parent_id, author_id, position, created_at,             updated_at,             is_explicitly_archived, archived_at) values
  (1,  'TOPIC',          null,      2,         0,        '2020-01-28T11:00:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (2,  'TOPIC',          null,      1,         0,        '2020-03-26T13:00:00Z', '2020-03-26T14:00:00Z', true,                   '2020-03-26T14:00:00Z'),
  (3,  'DIVIDER',        1,         2,         0,        '2020-01-28T11:00:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (4,  'POST',           1,         2,         1,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (5,  'POST',           1,         2,         2,        '2020-01-28T11:02:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (6,  'POST',           1,         2,         3,        '2020-01-28T11:03:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (7,  'POST',           1,         2,         4,        '2020-01-28T11:04:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (8,  'DIVIDER',        1,         2,         5,        '2020-01-28T11:05:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (9,  'POST',           1,         2,         6,        '2020-01-28T11:06:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (10, 'TOPIC',          1,         2,         7,        '2020-01-28T11:07:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (11, 'TOPIC',          10,        2,         0,        '2020-01-28T11:08:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (12, 'POST',           11,        2,         0,        '2020-01-28T11:09:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (13, 'POST',           11,        2,         1,        '2020-01-28T11:10:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (14, 'POST',           11,        2,         2,        '2020-01-28T11:11:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (15, 'POST',           2,         1,         0,        '2020-01-28T11:11:00Z', '2021-07-30T14:24:00Z', false,                  '2020-03-26T14:00:00Z'),
  (16, 'CHECKLIST',      4,         2,         0,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (17, 'CHECKLIST_ITEM', 16,        2,         0,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (18, 'CHECKLIST_ITEM', 16,        3,         1,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (19, 'CHECKLIST_ITEM', 16,        2,         2,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (20, 'CHECKLIST_ITEM', 16,        2,         3,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null),
  (21, 'CHECKLIST_ITEM', 16,        1,         4,        '2020-01-28T11:01:00Z', '2021-07-30T14:24:00Z', false,                  null);


insert into interfaces_and_unions.relational_topics (id, title)  values
  (1, 'PostGraphile version 5'),
  (2, 'Temporary test topic'),
  (10, 'Notes'),
  (11, 'Other aims');

insert into interfaces_and_unions.relational_posts (id, title, description, note)  values
  (4, 'Better planning', null, null),
  (5, 'Easier to code', null, null),
  (6, 'More features', 'E.g. interfaces and unions', 'Also things like querying from multiple databases'),
  (7, 'Better performance', null, null),
  (9, 'When have I ever committed to a timescale?', ':D', 'It''ll be done when it''s done, I prefer longer development time and longer stable time than multiple major releases in a year or two.'),
  (12, 'Fix legacy issues', null, null),
  (13, 'Full TypeScript conversion', null, null),
  (14, 'Monorepo', null, null),
  (15, 'Just a test', null, null);

insert into interfaces_and_unions.relational_dividers (id, title, color)  values
  (3, 'Headline features', 'green'),
  (8, 'Timescale', 'blue');

insert into interfaces_and_unions.relational_checklists (id, title)  values
  (16, 'Planning goals');

insert into interfaces_and_unions.relational_checklist_items (id, description, note)  values
  (17, 'Follows pattern of GraphQL resolver flow', null),
  (18, 'Has an optimisation phase', null),
  (19, 'Plan deduplication at the field level', null),
  (20, 'Garbage-collection of unused plans', null),
  (21, 'Supports newest GraphQL features', null);

-- We can also apply multiple interfaces to the same tables:

create table interfaces_and_unions.relational_commentables (
  id serial primary key,

  type interfaces_and_unions.item_type not null check (type in ('POST', 'CHECKLIST', 'CHECKLIST_ITEM')),
  type2 text not null references interfaces_and_unions.enum_table_item_type 
);
create trigger set_type2 before insert or update on interfaces_and_unions.relational_commentables for each row execute function interfaces_and_unions.tg__set_type2();

insert into interfaces_and_unions.relational_commentables (id, type)
  select id, 'POST'::interfaces_and_unions.item_type from interfaces_and_unions.relational_posts
  union
  select id, 'CHECKLIST'::interfaces_and_unions.item_type from interfaces_and_unions.relational_checklists
  union
  select id, 'CHECKLIST_ITEM'::interfaces_and_unions.item_type from interfaces_and_unions.relational_checklist_items;

alter table interfaces_and_unions.relational_posts add constraint relational_posts_commentable_fkey foreign key (id) references interfaces_and_unions.relational_commentables deferrable initially deferred;
alter table interfaces_and_unions.relational_checklists add constraint relational_posts_commentable_fkey foreign key (id) references interfaces_and_unions.relational_commentables deferrable initially deferred;
alter table interfaces_and_unions.relational_checklist_items add constraint relational_posts_commentable_fkey foreign key (id) references interfaces_and_unions.relational_commentables deferrable initially deferred;

create function interfaces_and_unions.relational_posts_title_lower(p interfaces_and_unions.relational_posts) returns text as $$
  select lower(p.title);
$$ language sql stable;

create function interfaces_and_unions.tg__relational_commentable() returns trigger as $$
begin
  insert into interfaces_and_unions.relational_commentables (id, type)
    select id, TG_ARGV[0]::interfaces_and_unions.item_type
    from new_table;
  return NULL;
end;
$$ language plpgsql volatile;

create function interfaces_and_unions.insert_post(author_id int, title text) returns interfaces_and_unions.relational_posts as $$
with item as (
  insert into interfaces_and_unions.relational_items (type, author_id)
  values ('POST', author_id)
  returning id
)
insert into interfaces_and_unions.relational_posts (id, title)
select item.id, insert_post.title from item
returning *
$$ language sql volatile;

create trigger _500_commentable
  after insert on interfaces_and_unions.relational_posts
  referencing new table as new_table
  for each statement
  execute function interfaces_and_unions.tg__relational_commentable('POST');
create trigger _500_commentable
  after insert on interfaces_and_unions.relational_checklists
  referencing new table as new_table
  for each statement
  execute function interfaces_and_unions.tg__relational_commentable('CHECKLIST');
create trigger _500_commentable
  after insert on interfaces_and_unions.relational_checklist_items
  referencing new table as new_table
  for each statement
  execute function interfaces_and_unions.tg__relational_commentable('CHECKLIST_ITEM');

comment on table interfaces_and_unions.relational_commentables is E'@interface relational type\n@type POST relational_posts\n@type CHECKLIST relational_checklists\n@type CHECKLIST_ITEM relational_checklist_items';

create table interfaces_and_unions.aws_applications (
  id int primary key,
  name text not null,
  last_deployed timestamptz,
  aws_id text
);
create table interfaces_and_unions.gcp_applications (
  id int primary key,
  name text not null,
  last_deployed timestamptz,
  gcp_id text
);
create table interfaces_and_unions.first_party_vulnerabilities (
  id int primary key,
  name text not null,
  cvss_score float not null,
  team_name text
);
create table interfaces_and_unions.third_party_vulnerabilities (
  id int primary key,
  name text not null,
  cvss_score float not null,
  vendor_name text
);

create table interfaces_and_unions.aws_application_first_party_vulnerabilities (
  aws_application_id int not null references interfaces_and_unions.aws_applications,
  first_party_vulnerability_id int not null references interfaces_and_unions.first_party_vulnerabilities,
  primary key (aws_application_id, first_party_vulnerability_id)
);
create table interfaces_and_unions.aws_application_third_party_vulnerabilities (
  aws_application_id int not null references interfaces_and_unions.aws_applications,
  third_party_vulnerability_id int not null references interfaces_and_unions.third_party_vulnerabilities,
  primary key (aws_application_id, third_party_vulnerability_id)
);
create table interfaces_and_unions.gcp_application_first_party_vulnerabilities (
  gcp_application_id int not null references interfaces_and_unions.gcp_applications,
  first_party_vulnerability_id int not null references interfaces_and_unions.first_party_vulnerabilities,
  primary key (gcp_application_id, first_party_vulnerability_id)
);
create table interfaces_and_unions.gcp_application_third_party_vulnerabilities (
  gcp_application_id int not null references interfaces_and_unions.gcp_applications,
  third_party_vulnerability_id int not null references interfaces_and_unions.third_party_vulnerabilities,
  primary key (gcp_application_id, third_party_vulnerability_id)
);

create index on interfaces_and_unions.aws_application_first_party_vulnerabilities (first_party_vulnerability_id);
create index on interfaces_and_unions.aws_application_third_party_vulnerabilities (third_party_vulnerability_id);
create index on interfaces_and_unions.gcp_application_first_party_vulnerabilities (first_party_vulnerability_id);
create index on interfaces_and_unions.gcp_application_third_party_vulnerabilities (third_party_vulnerability_id);

insert into interfaces_and_unions.aws_applications (id, name, last_deployed, aws_id) values
  (1, 'AWS App 1', null, 'AWS-0001'),
  (2, 'AWeSome', '2021-06-05T04:03:02.010Z', 'AWS-0002'); -- NO VULNERABILITIES!
insert into interfaces_and_unions.gcp_applications (id, name, last_deployed, gcp_id) values
  (1, 'GCP App 1', null, 'GCP_0_1'),
  (2, 'Grand Crayon Pasta', '2022-10-10T10:10:10.101Z', 'GCP_0_2');

insert into interfaces_and_unions.first_party_vulnerabilities (id, name, cvss_score, team_name) values
  (1, 'Off-by-one', 3.0, 'Accounting'),
  (2, 'Index-out-of-bounds', 7.2, 'Retention'),
  (3, 'Exponential backtracking', 7.7, 'Continuity'),
  (4, 'Information disclosure', 7.2, 'Retention'),
  (5, 'Timing attack', 7.2, 'Retention');

insert into interfaces_and_unions.third_party_vulnerabilities (id, name, cvss_score, vendor_name) values
  (1, 'CSRF', 7.5, '98-Factor-Login'),
  (2, 'XSS', 9.1, 'Frog-Render-Lib'),
  (3, 'SQL injection', 10.0, 'Eval-Sequel-Corp'),
  (4, 'Malware', 7.2, 'Frog-Render-Lib'),
  (5, 'License', 7.2, 'Frog-Render-Lib');

insert into interfaces_and_unions.aws_application_first_party_vulnerabilities values
  (1, 1),
  (1, 3),
  (1, 4),
  (1, 5);
insert into interfaces_and_unions.aws_application_third_party_vulnerabilities values
  (1, 1),
  (1, 2),
  (1, 4),
  (1, 5);
insert into interfaces_and_unions.gcp_application_first_party_vulnerabilities values
  (1, 2),
  (2, 2),
  (2, 3),
  (1, 4),
  (1, 5),
  (2, 4),
  (2, 5);
insert into interfaces_and_unions.gcp_application_third_party_vulnerabilities values
  (1, 3),
  (2, 1),
  (2, 3),
  (1, 4),
  (1, 5),
  (2, 4),
  (2, 5);

--------------------------------------------------------------------------------

-- The degenerate case of an interface, that is an interface with no shared
-- fields, is effectively a union. Here we ignore that the 'id' column is
-- shared and mark the type as a union.

create table interfaces_and_unions.union_items (
  id serial primary key,

  -- This column is used to tell us which table we need to join to
  type interfaces_and_unions.item_type not null default 'POST'::interfaces_and_unions.item_type,
  type2 text not null references interfaces_and_unions.enum_table_item_type

  -- No shared columns!
);
create trigger set_type2 before insert or update on interfaces_and_unions.union_items for each row execute function interfaces_and_unions.tg__set_type2();
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
  color text
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

insert into interfaces_and_unions.union_items (id, type) values
  (1, 'TOPIC'),
  (2, 'TOPIC'),
  (3, 'DIVIDER'),
  (4, 'POST'),
  (5, 'POST'),
  (6, 'POST'),
  (7, 'POST'),
  (8, 'DIVIDER'),
  (9, 'POST'),
  (10, 'TOPIC'),
  (11, 'TOPIC'),
  (12, 'POST'),
  (13, 'POST'),
  (14, 'POST'),
  (15, 'POST'),
  (16, 'CHECKLIST'),
  (17, 'CHECKLIST_ITEM'),
  (18, 'CHECKLIST_ITEM'),
  (19, 'CHECKLIST_ITEM'),
  (20, 'CHECKLIST_ITEM'),
  (21, 'CHECKLIST_ITEM');


insert into interfaces_and_unions.union_topics (id, title)  values
  (1, 'PostGraphile version 5'),
  (2, 'Temporary test topic'),
  (10, 'Notes'),
  (11, 'Other aims');

insert into interfaces_and_unions.union_posts (id, title, description, note)  values
  (4, 'Better planning', null, null),
  (5, 'Easier to code', null, null),
  (6, 'More features', 'E.g. interfaces and unions', 'Also things like querying from multiple databases'),
  (7, 'Better performance', null, null),
  (9, 'When have I ever committed to a timescale?', ':D', 'It''ll be done when it''s done, I prefer longer development time and longer stable time than multiple major releases in a year or two.'),
  (12, 'Fix legacy issues', null, null),
  (13, 'Full TypeScript conversion', null, null),
  (14, 'Monorepo', null, null),
  (15, 'Just a test', null, null);

insert into interfaces_and_unions.union_dividers (id, title, color)  values
  (3, 'Headline features', 'green'),
  (8, 'Timescale', 'blue');

insert into interfaces_and_unions.union_checklists (id, title)  values
  (16, 'Planning goals');

insert into interfaces_and_unions.union_checklist_items (id, description, note)  values
  (17, 'Follows pattern of GraphQL resolver flow', null),
  (18, 'Has an optimisation phase', null),
  (19, 'Plan deduplication at the field level', null),
  (20, 'Garbage-collection of unused plans', null),
  (21, 'Supports newest GraphQL features', null);

--------------------------------------------------------------------------------

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
  select (person_id, null, null)::interfaces_and_unions.union__entity
  from interfaces_and_unions.people
  where username like '%' || query || '%'
union all
  select (null, post_id, null)::interfaces_and_unions.union__entity
  from interfaces_and_unions.posts
  where body like '%' || query || '%'
union all
  select (null, null, comment_id)::interfaces_and_unions.union__entity
  from interfaces_and_unions.comments
  where body like '%' || query || '%'
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

insert into interfaces_and_unions.person_bookmarks (id, person_id, bookmarked_entity) values
  (1, 2, (null, 3, null)),
  (2, 2, (null, null, 1)),
  (3, 5, (3, null, null));

insert into interfaces_and_unions.person_likes (id, person_id, liked_entity) values
  (1, 2, (3, null, null)),
  (2, 2, (4, null, null)),
  (3, 2, (5, null, null)),
  (4, 2, (null, 5, null)),
  (5, 2, (null, 6, null)),
  (6, 2, (null, 7, null)),
  (7, 2, (null, null, 2)),
  (8, 2, (null, null, 3));


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

insert into interfaces_and_unions.person_favourites (id, person_id, liked_person_id, liked_post_id, liked_comment_id) values
  (1, 2, 3, null, null),
  (2, 2, 4, null, null),
  (3, 2, 5, null, null),
  (4, 2, null, 5, null),
  (5, 2, null, 6, null),
  (6, 2, null, 7, null),
  (7, 2, null, null, 2),
  (8, 2, null, null, 3);

--------------------------------------------------------------------------------

-- see also sequence_reset.sql
