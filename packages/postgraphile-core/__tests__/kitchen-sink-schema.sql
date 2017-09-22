-- From https://github.com/postgraphql/postgraphql/blob/master/examples/kitchen-sink/schema.sql
drop schema if exists a, b, c cascade;

create schema a;
create schema b;
create schema c;

-- Troublesome extensions install annoying things in our schema; we want to
-- ensure this doesn't make us crash.
create extension tablefunc with schema a;

comment on schema a is 'The a schema.';
comment on schema b is 'qwerty';

create domain b.email as text
  check (value ~* '^.+@.+\..+$');

create table c.person (
  id serial primary key,
  name varchar not null,
  about text,
  email b.email not null unique,
  created_at timestamp default current_timestamp
);

comment on table c.person is 'Person test comment';
comment on column c.person.name is 'The person’s name';

create function c.person_exists(person c.person, email b.email) returns boolean as $$
select exists(select 1 from c.person where person.email = person_exists.email);
$$ language sql stable;

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
  author_id int4 references c.person(id)
);

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
  foo_bar int
);

create type b.nested_compound_type as (
  a c.compound_type,
  b c.compound_type,
  baz_buz int
);

comment on type c.compound_type is 'Awesome feature!';

create view b.updatable_view as
  select
    id as x,
    name,
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
  "nested_compound_type" b.nested_compound_type not null
);

create function a.add_1_mutation(int, int) returns int as $$ select $1 + $2 $$ language sql volatile strict;
create function a.add_2_mutation(a int, b int default 2) returns int as $$ select $1 + $2 $$ language sql strict;
create function a.add_3_mutation(a int, int) returns int as $$ select $1 + $2 $$ language sql volatile;
create function a.add_4_mutation(int, b int default 2) returns int as $$ select $1 + $2 $$ language sql;
create function a.add_1_query(int, int) returns int as $$ select $1 + $2 $$ language sql immutable strict;
create function a.add_2_query(a int, b int default 2) returns int as $$ select $1 + $2 $$ language sql stable strict;
create function a.add_3_query(a int, int) returns int as $$ select $1 + $2 $$ language sql immutable;
create function a.add_4_query(int, b int default 2) returns int as $$ select $1 + $2 $$ language sql stable;

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
create function c.types_query(a bigint, b boolean, c varchar, d integer[], e json, f numrange) returns boolean as $$ select false $$ language sql stable strict;
create function c.types_mutation(a bigint, b boolean, c varchar, d integer[], e json, f numrange) returns boolean as $$ select false $$ language sql strict;
create function b.compound_type_query(object c.compound_type) returns c.compound_type as $$ select (object.a + 1, object.b, object.c, object.d, object.e, object.f, object.foo_bar)::c.compound_type $$ language sql stable;
create function c.compound_type_set_query() returns setof c.compound_type as $$ select (1, '2', 'blue', null, '0_BAR', '', 7)::c.compound_type $$ language sql stable;
create function b.compound_type_mutation(object c.compound_type) returns c.compound_type as $$ select (object.a + 1, object.b, object.c, object.d, object.e, object.f, object.foo_bar)::c.compound_type $$ language sql;
create function c.table_query(id int) returns a.post as $$ select * from a.post where id = $1 $$ language sql stable;
create function c.table_mutation(id int) returns a.post as $$ select * from a.post where id = $1 $$ language sql;
create function c.table_set_query() returns setof c.person as $$ select * from c.person $$ language sql stable;
create function c.table_set_mutation() returns setof c.person as $$ select * from c.person $$ language sql;
create function c.int_set_query(x int, y int, z int) returns setof integer as $$ values (1), (2), (3), (4), (x), (y), (z) $$ language sql stable;
create function c.int_set_mutation(x int, y int, z int) returns setof integer as $$ values (1), (2), (3), (4), (x), (y), (z) $$ language sql;
create function c.no_args_query() returns int as $$ select 2 $$ language sql stable;
create function c.no_args_mutation() returns int as $$ select 2 $$ language sql;
create function a.return_void_mutation() returns void as $$ begin return; end; $$ language plpgsql;

create function c.person_first_name(person c.person) returns text as $$ select split_part(person.name, ' ', 1) $$ language sql stable;
create function c.person_friends(person c.person) returns setof c.person as $$ select friend.* from c.person as friend where friend.id in (person.id + 1, person.id + 2) $$ language sql stable;
create function c.person_first_post(person c.person) returns a.post as $$ select * from a.post where a.post.author_id = person.id limit 1 $$ language sql stable;
create function c.compound_type_computed_field(compound_type c.compound_type) returns integer as $$ select compound_type.a + compound_type.foo_bar $$ language sql stable;
create function a.post_headline_trimmed(post a.post, length int default 10, omission text default '…') returns text as $$ select substr(post.headline, 0, length) || omission $$ language sql stable;
create function a.post_headline_trimmed_strict(post a.post, length int default 10, omission text default '…') returns text as $$ select substr(post.headline, 0, length) || omission $$ language sql stable strict;
create function a.post_headline_trimmed_no_defaults(post a.post, length int, omission text) returns text as $$ select substr(post.headline, 0, length) || omission $$ language sql stable;

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
