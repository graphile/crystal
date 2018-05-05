-- From https://github.com/graphile/postgraphile/blob/master/examples/kitchen-sink/schema.sql
drop schema if exists a, b, c, d cascade;

create schema a;
create schema b;
create schema c;
create schema d;

-- Troublesome extensions install annoying things in our schema; we want to
-- ensure this doesn't make us crash.
create extension tablefunc with schema a;

comment on schema a is 'The a schema.';
comment on schema b is 'qwerty';

create domain b.not_null_url as character varying(2048) not null;
create type b.wrapped_url as (
  url b.not_null_url
);
create domain b.email as text
  check (value ~* '^.+@.+\..+$');

create table c.person (
  id serial primary key,
  person_full_name varchar not null,
  aliases text[] not null default '{}',
  about text,
  email b.email not null unique,
  site b.wrapped_url default null,
  created_at timestamp default current_timestamp
);

-- This is to test that "one-to-one" relationships work on primary keys
create table c.person_secret (
  person_id int not null primary key references c.person on delete cascade,
  sekrit text
);

comment on column c.person_secret.sekrit is E'@name secret\nA secret held by the associated Person';

comment on table c.person_secret is 'Tracks the person''s secret';

-- This is to test that "one-to-one" relationships also work on unique keys
create table c.left_arm (
  id serial primary key,
  person_id int not null unique references c.person on delete cascade,
  length_in_metres float
);

comment on table c.left_arm is 'Tracks metadata about the left arms of various people';

-- This should not add a query to the schema
create unique index uniq_person__email_id_3 on c.person (email) where (id = 3);

comment on table c.person is 'Person test comment';
comment on column c.person.id is 'The primary unique identifier for the person';
comment on column c.person.person_full_name is E'@name name\nThe person’s name';
comment on column c.person.site is '@deprecated Don’t use me';

create function c.person_exists(person c.person, email b.email) returns boolean as $$
select exists(select 1 from c.person where person.email = person_exists.email);
$$ language sql stable;

create type a.an_enum as enum('awaiting',
  'rejected',
  'published',
  '*',
  '**',
  '***',
  'foo*',
  'foo*_',
  '_foo*',
  '*bar',
  '*bar_',
  '_*bar_',
  '*baz*',
  '_*baz*_',
  '%',
  '>=',
  '~~',
  '$'
);

create type a.comptype as (
  schedule timestamptz,
  is_optimised boolean
);

create domain b.guid
  as character varying(15)
  default '000000000000000'::character varying
  constraint guid_conformity check (value::text ~ '^[a-zA-Z0-9]{15}$'::text);

create or replace function b.guid_fn(g b.guid) returns b.guid as $$
  select g;
$$ language sql volatile;

create table a.post (
  id serial primary key,
  headline text not null,
  body text,
  author_id int4 references c.person(id),
  enums a.an_enum[],
  comptypes a.comptype[]
);

-- This should not add a query to the schema
create unique index uniq_post__headline_author_3 on a.post (headline) where (author_id = 3);

create type a.letter as enum ('a', 'b', 'c', 'd');
create type b.color as enum ('red', 'green', 'blue');
create type b.enum_caps as enum ('FOO_BAR', 'BAR_FOO', 'BAZ_QUX', '0_BAR');
create type b.enum_with_empty_string as enum ('', 'one', 'two');

create type c.compound_type as (
  a int,
  b text,
  c b.color,
  d uuid,
  e b.enum_caps,
  f b.enum_with_empty_string,
  g interval,
  foo_bar int
);

create type b.nested_compound_type as (
  a c.compound_type,
  b c.compound_type,
  baz_buz int
);

create type c.floatrange as range (subtype = float8, subtype_diff = float8mi);

comment on type c.compound_type is 'Awesome feature!';

create view b.updatable_view as
  select
    id as x,
    person_full_name as name,
    about as description,
    2 as constant
  from
    c.person;

comment on view b.updatable_view is 'YOYOYO!!';
comment on column b.updatable_view.constant is 'This is constantly 2';

create view a.non_updatable_view as select 2;

create table c.compound_key (
  person_id_2 int references c.person(id),
  person_id_1 int references c.person(id),
  extra boolean,
  primary key (person_id_1, person_id_2)
);

create table a.foreign_key (
  person_id int references c.person(id),
  compound_key_1 int,
  compound_key_2 int,
  foreign key (compound_key_1, compound_key_2) references c.compound_key(person_id_1, person_id_2)
);

alter table a.foreign_key add constraint second_fkey
  foreign key (compound_key_1, compound_key_2) references c.compound_key(person_id_1, person_id_2);

create table c.edge_case (
  not_null_has_default boolean not null default false,
  wont_cast_easy smallint,
  drop_me text,
  row_id integer
);

alter table c.edge_case drop column drop_me;

create function c.edge_case_computed(edge_case c.edge_case) returns text as $$ select 'hello world'::text $$ language sql stable;

create domain a.an_int as integer;
create domain b.another_int as a.an_int;

create type a.an_int_range as range (
  subtype = a.an_int
);

create table b.types (
  id serial primary key,
  "smallint" smallint not null,
  "bigint" bigint not null,
  "numeric" numeric not null,
  "decimal" decimal not null,
  "boolean" boolean not null,
  "varchar" varchar not null,
  "enum" b.color not null,
  "enum_array" b.color[] not null,
  "domain" a.an_int not null,
  "domain2" b.another_int not null,
  "text_array" text[] not null,
  "json" json not null,
  "jsonb" jsonb not null,
  "nullable_range" numrange,
  "numrange" numrange not null,
  "daterange" daterange not null,
  "an_int_range" a.an_int_range not null,
  "timestamp" timestamp not null,
  "timestamptz" timestamptz not null,
  "date" date not null,
  "time" time not null,
  "timetz" timetz not null,
  "interval" interval not null,
  "money" money not null,
  "compound_type" c.compound_type not null,
  "nested_compound_type" b.nested_compound_type not null,
  "nullable_compound_type" c.compound_type,
  "nullable_nested_compound_type" b.nested_compound_type,
  "point" point not null,
  "nullablePoint" point
);

create function b.throw_error() returns trigger as $$
begin
  raise exception 'Nope.';
  return new;
end;
$$ language plpgsql;

create trigger dont_delete before delete on b.types for each row execute procedure b.throw_error();

create function a.add_1_mutation(int, int) returns int as $$ select $1 + $2 $$ language sql volatile strict;
create function a.add_2_mutation(a int, b int default 2) returns int as $$ select $1 + $2 $$ language sql strict;
create function a.add_3_mutation(a int, int) returns int as $$ select $1 + $2 $$ language sql volatile;
create function a.add_4_mutation(int, b int default 2) returns int as $$ select $1 + $2 $$ language sql;
create function a.add_4_mutation_error(int, b int default 2) returns int as $$ begin raise exception 'Deliberate error'; end $$ language plpgsql;
create function a.add_1_query(int, int) returns int as $$ select $1 + $2 $$ language sql immutable strict;
create function a.add_2_query(a int, b int default 2) returns int as $$ select $1 + $2 $$ language sql stable strict;
create function a.add_3_query(a int, int) returns int as $$ select $1 + $2 $$ language sql immutable;
create function a.add_4_query(int, b int default 2) returns int as $$ select $1 + $2 $$ language sql stable;

create function a.optional_missing_middle_1(int, b int default 2, c int default 3) returns int as $$ select $1 + $2 + $3 $$ language sql immutable strict;
create function a.optional_missing_middle_2(a int, b int default 2, c int default 3) returns int as $$ select $1 + $2 + $3 $$ language sql immutable strict;
create function a.optional_missing_middle_3(a int, int default 2, c int default 3) returns int as $$ select $1 + $2 + $3 $$ language sql immutable strict;
create function a.optional_missing_middle_4(int, b int default 2, int default 3) returns int as $$ select $1 + $2 + $3 $$ language sql immutable strict;
create function a.optional_missing_middle_5(a int, int default 2, int default 3) returns int as $$ select $1 + $2 + $3 $$ language sql immutable strict;

comment on function a.add_1_mutation(int, int) is 'lol, add some stuff 1 mutation';
comment on function a.add_2_mutation(int, int) is 'lol, add some stuff 2 mutation';
comment on function a.add_3_mutation(int, int) is 'lol, add some stuff 3 mutation';
comment on function a.add_4_mutation(int, int) is 'lol, add some stuff 4 mutation';
comment on function a.add_1_query(int, int) is 'lol, add some stuff 1 query';
comment on function a.add_2_query(int, int) is 'lol, add some stuff 2 query';
comment on function a.add_3_query(int, int) is 'lol, add some stuff 3 query';
comment on function a.add_4_query(int, int) is 'lol, add some stuff 4 query';

create function b.mult_1(int, int) returns int as $$ select $1 * $2 $$ language sql;
create function b.mult_2(int, int) returns int as $$ select $1 * $2 $$ language sql called on null input;
create function b.mult_3(int, int) returns int as $$ select $1 * $2 $$ language sql returns null on null input;
create function b.mult_4(int, int) returns int as $$ select $1 * $2 $$ language sql strict;

create function c.json_identity(json json) returns json as $$ select json $$ language sql immutable;
create function c.json_identity_mutation(json json) returns json as $$ select json $$ language sql;
create function c.jsonb_identity(json jsonb) returns jsonb as $$ select json $$ language sql immutable;
create function c.jsonb_identity_mutation(json jsonb) returns jsonb as $$ select json $$ language sql;
create function c.jsonb_identity_mutation_plpgsql(_the_json jsonb) returns jsonb as $$ declare begin return _the_json; end; $$ language plpgsql strict security definer;
create function c.jsonb_identity_mutation_plpgsql_with_default(_the_json jsonb default '[]') returns jsonb as $$ declare begin return _the_json; end; $$ language plpgsql strict security definer;
create function c.types_query(a bigint, b boolean, c varchar, d integer[], e json, f c.floatrange) returns boolean as $$ select false $$ language sql stable strict;
create function c.types_mutation(a bigint, b boolean, c varchar, d integer[], e json, f c.floatrange) returns boolean as $$ select false $$ language sql strict;
create function b.compound_type_query(object c.compound_type) returns c.compound_type as $$ select (object.a + 1, object.b, object.c, object.d, object.e, object.f, object.g, object.foo_bar)::c.compound_type $$ language sql stable;
create function c.compound_type_set_query() returns setof c.compound_type as $$ select (1, '2', 'blue', null, '0_BAR', '', interval '18 seconds', 7)::c.compound_type $$ language sql stable;
create function b.compound_type_array_query(object c.compound_type) returns c.compound_type[] as $$ select ARRAY[object, (null, null, null, null, null, null, null, null)::c.compound_type, (object.a + 1, object.b, object.c, object.d, object.e, object.f, object.g, object.foo_bar)::c.compound_type]; $$ language sql stable;
create function b.compound_type_mutation(object c.compound_type) returns c.compound_type as $$ select (object.a + 1, object.b, object.c, object.d, object.e, object.f, object.g, object.foo_bar)::c.compound_type $$ language sql;
create function b.compound_type_set_mutation(object c.compound_type) returns setof c.compound_type as $$ begin return next object; return next (object.a + 1, object.b, object.c, object.d, object.e, object.f, object.g, object.foo_bar)::c.compound_type; end; $$ language plpgsql volatile;
create function b.compound_type_array_mutation(object c.compound_type) returns c.compound_type[] as $$ select ARRAY[object, (null, null, null, null, null, null, null, null)::c.compound_type, (object.a + 1, object.b, object.c, object.d, object.e, object.f, object.g, object.foo_bar)::c.compound_type]; $$ language sql volatile;
create function c.table_query(id int) returns a.post as $$ select * from a.post where id = $1 $$ language sql stable;
create function c.table_mutation(id int) returns a.post as $$ select * from a.post where id = $1 $$ language sql;
create function c.table_set_query() returns setof c.person as $$ select * from c.person $$ language sql stable;
create function c.table_set_mutation() returns setof c.person as $$ select * from c.person $$ language sql;
create function c.int_set_query(x int, y int, z int) returns setof integer as $$ values (1), (2), (3), (4), (x), (y), (z) $$ language sql stable;
create function c.int_set_mutation(x int, y int, z int) returns setof integer as $$ values (1), (2), (3), (4), (x), (y), (z) $$ language sql;
create function c.no_args_query() returns int as $$ select 2 $$ language sql stable;
create function c.no_args_mutation() returns int as $$ select 2 $$ language sql;
create function a.return_void_mutation() returns void as $$ begin return; end; $$ language plpgsql;

create function c.person_first_name(person c.person) returns text as $$ select split_part(person.person_full_name, ' ', 1) $$ language sql stable;
create function c.person_friends(person c.person) returns setof c.person as $$ select friend.* from c.person as friend where friend.id in (person.id + 1, person.id + 2) $$ language sql stable;
create function c.person_first_post(person c.person) returns a.post as $$ select * from a.post where a.post.author_id = person.id limit 1 $$ language sql stable;
create function c.compound_type_computed_field(compound_type c.compound_type) returns integer as $$ select compound_type.a + compound_type.foo_bar $$ language sql stable;
create function c.person_computed_compound_type_array(person c.person, object c.compound_type) returns c.compound_type[] as $$ select ARRAY[object, (null, null, null, null, null, null, null, null)::c.compound_type, (object.a + 1, object.b, object.c, object.d, object.e, object.f, object.g, object.foo_bar)::c.compound_type]; $$ language sql stable;
create function a.post_headline_trimmed(post a.post, length int default 10, omission text default '…') returns text as $$ select substr(post.headline, 0, length) || omission $$ language sql stable;
create function a.post_headline_trimmed_strict(post a.post, length int default 10, omission text default '…') returns text as $$ select substr(post.headline, 0, length) || omission $$ language sql stable strict;
create function a.post_headline_trimmed_no_defaults(post a.post, length int, omission text) returns text as $$ select substr(post.headline, 0, length) || omission $$ language sql stable;
create function a.post_many(posts a.post[]) returns setof a.post as $$ declare current_post a.post; begin foreach current_post in array posts loop return next current_post; end loop; end; $$ language plpgsql;

create type b.jwt_token as (
  role text,
  exp integer,
  a integer,
  b integer,
  c integer
);

create function b.authenticate(a integer, b integer, c integer) returns b.jwt_token as $$ select ('yay', extract(epoch from '2037-07-12'::timestamp), a, b, c)::b.jwt_token $$ language sql;
create function b.authenticate_many(a integer, b integer, c integer) returns b.jwt_token[] as $$ select array[('foo', 1, a, b, c)::b.jwt_token, ('bar', 2, a + 1, b + 1, c + 1)::b.jwt_token, ('baz', 3, a + 2, b + 2, c + 2)::b.jwt_token] $$ language sql;
create function b.authenticate_fail() returns b.jwt_token as $$ select null::b.jwt_token $$ language sql;

create type b.auth_payload as (
  jwt b.jwt_token,
  id int,
  admin bool
);

create function b.authenticate_payload(a integer, b integer, c integer) returns b.auth_payload as $$ select (('yay', extract(epoch from '2037-07-12'::timestamp), a, b, c)::b.jwt_token, 1, true)::b.auth_payload $$ language sql;

create table a.similar_table_1 (
  id serial primary key,
  col1 int,
  col2 int,
  col3 int not null
);

create table a.similar_table_2 (
  id serial primary key,
  col3 int not null,
  col4 int,
  col5 int
);

CREATE TABLE a.default_value (
    id serial primary key,
    null_value text DEFAULT 'defaultValue!'
);

create table a.view_table (
  id serial primary key,
  col1 int,
  col2 int
);

create view a.testview as
  select id as testviewid, col1, col2
  from a.view_table;

create function a.post_with_suffix(post a.post,suffix text) returns a.post as $$
  insert into a.post(id,headline,body,author_id,enums,comptypes) values
  (post.id,post.headline || suffix,post.body,post.author_id,post.enums,post.comptypes)
  returning *; 
$$ language sql volatile;

create function a.static_big_integer() returns setof int8 as $$
  -- See https://github.com/graphile/postgraphile/issues/678#issuecomment-363659705
  select generate_series(30894622507013190, 30894622507013200);
$$ language sql stable security definer;

create table a.inputs (
  id serial primary key
);
comment on table a.inputs is 'Should output as Input';

create table a.patchs (
  id serial primary key
);
comment on table a.patchs is 'Should output as Patch';

create table a.reserved (
  id serial primary key
);

create table a.reserved_input (
  id serial primary key
);
comment on table a.reserved_input is '`reserved_input` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from `reserved` table';

create table a."reservedPatchs" (
  id serial primary key
);
comment on table a."reservedPatchs" is '`reservedPatchs` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from `reserved` table';

create function c.badly_behaved_function() returns setof c.person as $$
begin
  return query select * from c.person order by id asc limit 1;
  return next null;
  return query select * from c.person order by id desc limit 1;
end;
$$ language plpgsql stable;

create table c.my_table (
  id serial primary key,
  json_data jsonb
);

-- Begin tests for smart comments

-- Rename table and columns

create table d.original_table (
  col1 int
);

comment on table d.original_table is E'@name renamed_table';
comment on column d.original_table.col1 is E'@name colA';

create function d.original_function() returns int as $$
  select 1;
$$ language sql stable;

comment on function d.original_function() is E'@name renamed_function';

-- Rename relations and computed column

create table d.person (
  id serial primary key,
  first_name varchar,
  last_name varchar,
  col_no_create text default 'col_no_create',
  col_no_update text default 'col_no_update',
  col_no_order text default 'col_no_order',
  col_no_filter text default 'col_no_filter',
  col_no_create_update text default 'col_no_create_update',
  col_no_create_update_order_filter text default 'col_no_create_update_order_filter',
  col_no_anything text default 'col_no_anything'
);

comment on column d.person.col_no_create is E'@omit create';
comment on column d.person.col_no_update is E'@omit update';
comment on column d.person.col_no_order is E'@omit order';
comment on column d.person.col_no_filter is E'@omit filter';
comment on column d.person.col_no_create_update is E'@omit create,update';
comment on column d.person.col_no_create_update_order_filter is E'@omit create,update,order,filter';
comment on column d.person.col_no_anything is E'@omit';

create function d.person_full_name(n d.person)
returns varchar as $$
  select n.first_name || ' ' || n.last_name;
$$ language sql stable;


create table d.post (
  id serial primary key,
  body text,
  author_id int4 references d.person(id)
);

comment on constraint post_author_id_fkey on d.post is E'@foreignFieldName posts\n@fieldName author';
comment on constraint person_pkey on d.person is E'@fieldName findPersonById';
comment on function d.person_full_name(d.person) is E'@fieldName name';

-- Rename custom queries

create function d.search_posts(search text)
returns setof d.post as $$
    select *
    from d.post
    where
      body ilike ('%' || search || '%')
  $$ language sql stable;

  comment on function d.search_posts(text) is E'@name returnPostsMatching';

-- rename custom mutations

create type d.jwt_token as (
  role text,
  exp integer,
  a integer
);

create function d.authenticate(a integer)
returns d.jwt_token as $$
    select ('yay', extract(epoch from '2037-07-12'::timestamp), a)::d.jwt_token
    $$ language sql;

comment on function d.authenticate(a integer) is E'@name login\n@resultFieldName token';

-- rename type

create type d.flibble as (f text);

create function d.getflamble() returns SETOF d.flibble as $$
    select body from d.post
$$ language sql;

comment on type d.flibble is E'@name flamble';

-- Begin tests for omit actions

-- Omit actions on a table

create table d.films (
    code        integer PRIMARY KEY,
    title       varchar(40)
);


create table d.studios (
  id integer PRIMARY KEY,
  name text
);


create table d.tv_shows (
    code        integer PRIMARY KEY,
    title       varchar(40),
    studio_id   integer references d.studios
);


create table d.tv_episodes (
    code        integer PRIMARY KEY,
    title       varchar(40),
    show_id     integer references d.tv_shows
);

