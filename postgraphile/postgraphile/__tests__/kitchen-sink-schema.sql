-- WARNING: this database is shared with graphile-utils, don't run the tests in parallel!
drop schema if exists
  a,
  b,
  c,
  d,
  inheritence,
  smart_comment_relations,
  ranges,
  index_expressions,
  simple_collections,
  live_test,
  large_bigint,
  network_types,
  named_query_builder,
  enum_tables,
  geometry,
  polymorphic,
  partitions,
  js_reserved,
  nested_arrays,
  composite_domains,
  refs,
  space,
  issue_2210,
  relay
cascade;
drop extension if exists tablefunc;
drop extension if exists intarray;
drop extension if exists hstore;
drop extension if exists ltree;

create schema a;
create schema b;
create schema c;
create schema d;
create schema large_bigint;

alter default privileges revoke execute on functions from public;

-- Troublesome extensions install annoying things in our schema; we want to
-- ensure this doesn't make us crash.
create extension tablefunc with schema a;
create extension hstore;
create extension intarray;
create extension ltree;

comment on schema a is 'The a schema.';
comment on schema b is 'qwerty';

create domain b.not_null_url as character varying(2048) not null;
create type b.wrapped_url as (
  url b.not_null_url
);
create domain b.email as text
  check (value ~* '^.+@.+\..+$');

create table a.no_primary_key (
  id int not null unique,
  str text not null
);

create table c.person (
  id serial primary key,
  person_full_name varchar not null,
  aliases text[] not null default '{}',
  about text,
  email b.email not null unique,
  site b.wrapped_url default null,
  config hstore,
  last_login_from_ip inet,
  last_login_from_subnet cidr,
  user_mac macaddr,
  created_at timestamp default current_timestamp
);

create unlogged table c.unlogged (
  id serial primary key,
  nonsense text
);

do $_$
begin
if current_setting('server_version_num')::int >= 90500 then
  -- JSONB supported
  -- current_setting(x, true) supported
  create function c.current_user_id() returns int as $$
    select nullif(current_setting('jwt.claims.user_id', true), '')::int;
  $$ language sql stable;
else
  execute 'alter database ' || quote_ident(current_database()) || ' set jwt.claims.user_id to ''''';
  create function c.current_user_id() returns int as $$
    select nullif(current_setting('jwt.claims.user_id'), '')::int;
  $$ language sql stable;
end if;
end;
$_$ language plpgsql;

-- This is to test that "one-to-one" relationships work on primary keys
create table c.person_secret (
  person_id int not null primary key references c.person on delete cascade,
  sekrit text
);

comment on column c.person_secret.sekrit is E'@name secret\r\nA secret held by the associated Person';
comment on constraint person_secret_person_id_fkey on c.person_secret is E'@forwardDescription The `Person` this `PersonSecret` belongs to.\n@backwardDescription This `Person`''s `PersonSecret`.';

comment on table c.person_secret is E'@deprecated This is deprecated (comment on table c.person_secret).\nTracks the person''s secret';

-- This is to test that "one-to-one" relationships also work on unique keys
create table c.left_arm (
  id serial primary key,
  person_id int default c.current_user_id() unique references c.person on delete cascade,
  length_in_metres float,
  mood text not null default 'neutral'
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

comment on function c.person_exists(person c.person, email b.email) is '@deprecated This is deprecated (comment on function c.person_exists).';

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
  author_id int4 default c.current_user_id() references c.person(id) on delete cascade,
  enums a.an_enum[],
  comptypes a.comptype[]
);
CREATE INDEX ON "a"."post"("author_id");

-- This should not add a query to the schema
create unique index uniq_post__headline_author_3 on a.post (headline) where (author_id = 3);

create type a.letter as enum ('a', 'b', 'c', 'd');
create type b.color as enum ('red', 'green', 'blue');
create type b.enum_caps as enum ('FOO_BAR', 'BAR_FOO', 'BAZ_QUX', '0_BAR');
create type b.enum_with_empty_string as enum ('', 'one', 'two');

comment on type b.color is E'Represents the colours red, green and blue.';

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

comment on view b.updatable_view is E'@uniqueKey x\nYOYOYO!!';
comment on column b.updatable_view.constant is 'This is constantly 2';

create view a.non_updatable_view as select 2;

create table c.compound_key (
  person_id_2 int references c.person(id) on delete cascade,
  person_id_1 int references c.person(id) on delete cascade,
  extra boolean,
  primary key (person_id_1, person_id_2)
);

create table a.foreign_key (
  person_id int references c.person(id) on delete cascade,
  compound_key_1 int,
  compound_key_2 int,
  foreign key (compound_key_1, compound_key_2) references c.compound_key(person_id_1, person_id_2) on delete cascade
);

alter table a.foreign_key add constraint second_fkey
  foreign key (compound_key_1, compound_key_2) references c.compound_key(person_id_1, person_id_2) on delete cascade;

create table a.unique_foreign_key (
  compound_key_1 int,
  compound_key_2 int,
  foreign key (compound_key_1, compound_key_2) references c.compound_key(person_id_1, person_id_2) on delete cascade,
  unique(compound_key_1, compound_key_2)
);

alter table a.unique_foreign_key add constraint second_fkey
  foreign key (compound_key_1, compound_key_2) references c.compound_key(person_id_1, person_id_2) on delete cascade;

-- We're just testing the relations work as expected, we don't need everything else.
comment on table a.unique_foreign_key is E'@omit create,update,delete,all,order,filter';

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

create domain c.text_array_domain as text[];
create domain c.int8_array_domain as int8[];

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
  "interval_array" interval[] not null,
  "money" money not null,
  "compound_type" c.compound_type not null,
  "nested_compound_type" b.nested_compound_type not null,
  "nullable_compound_type" c.compound_type,
  "nullable_nested_compound_type" b.nested_compound_type,
  "point" point not null,
  "nullablePoint" point,
  "inet" inet,
  "cidr" cidr,
  "macaddr" macaddr,
  "regproc" regproc, 
  "regprocedure" regprocedure, 
  "regoper" regoper, 
  "regoperator" regoperator, 
  "regclass" regclass, 
  "regtype" regtype, 
  "regconfig" regconfig, 
  "regdictionary" regdictionary,
  "text_array_domain" c.text_array_domain,
  "int8_array_domain" c.int8_array_domain,
  "bytea" bytea,
  "bytea_array" bytea[],
  "ltree" ltree,
  "ltree_array" ltree[]
);

comment on table b.types is E'@foreignKey (smallint) references a.post\n@foreignKey (id) references a.post';

create table b.lists (
  id serial primary key,
  "int_array" int[],
  "int_array_nn" int[] not null,
  "enum_array" b.color[],
  "enum_array_nn" b.color[] not null,
  "date_array" date[],
  "date_array_nn" date[] not null,
  "timestamptz_array" timestamptz[],
  "timestamptz_array_nn" timestamptz[] not null,
  "compound_type_array" c.compound_type[],
  "compound_type_array_nn" c.compound_type[] not null,
  "bytea_array" bytea[],
  "bytea_array_nn" bytea[] not null
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

comment on function a.add_1_mutation(int, int) is E'@notNull\nlol, add some stuff 1 mutation';
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

create function c.json_identity("json" json) returns json as $$ select "json" $$ language sql immutable;
create function c.json_identity_mutation("json" json) returns json as $$ select "json" $$ language sql;
create function c.jsonb_identity("json" jsonb) returns jsonb as $$ select "json" $$ language sql immutable;
create function c.jsonb_identity_mutation("json" jsonb) returns jsonb as $$ select "json" $$ language sql;
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
create function c.table_set_query() returns setof c.person as $$ select * from c.person order by id asc $$ language sql stable;
create function c.table_set_query_plpgsql() returns setof c.person as $$ begin return query select * from c.person order by id asc; end $$ language plpgsql stable;
comment on function c.table_set_query() is E'@sortable\n@filterable';
create function c.table_set_mutation() returns setof c.person as $$ select * from c.person order by id asc $$ language sql;
create function c.int_set_query(x int, y int, z int) returns setof integer as $$ values (1), (2), (3), (4), (x), (y), (z) $$ language sql stable;
create function c.int_set_mutation(x int, y int, z int) returns setof integer as $$ values (1), (2), (3), (4), (x), (y), (z) $$ language sql;
create function c.no_args_query() returns int as $$ select 2 $$ language sql stable;
create function c.no_args_mutation() returns int as $$ select 2 $$ language sql;
create function a.return_void_mutation() returns void as $$ begin return; end; $$ language plpgsql;
create function b.list_bde_mutation(b text[], d text, e text) returns uuid[] as $$
begin
  if d <> '' and b <> '{}' then
    raise exception 'Must provide only one of d or b' using errcode='INVLD';
  end if;
  return ARRAY[]::uuid[];
end;
$$ language plpgsql volatile;
create function c.list_of_compound_types_mutation(records c.compound_type[]) returns setof c.compound_type as $$
  select r.*
  from unnest(list_of_compound_types_mutation.records) as r;
$$ language sql volatile;

create function c.person_first_name(person c.person) returns text as $$ select split_part(person.person_full_name, ' ', 1) $$ language sql stable;
comment on function c.person_first_name(c.person) is E'@sortable\nThe first name of the person.';
create function c.person_friends(person c.person) returns setof c.person as $$ select friend.* from c.person as friend where friend.id in (person.id + 1, person.id + 2) order by friend.id asc $$ language sql stable;
comment on function c.person_friends(c.person) is E'@sortable';
create function c.person_first_post(person c.person) returns a.post as $$ select * from a.post where a.post.author_id = person.id order by id asc limit 1 $$ language sql stable;
comment on function c.person_first_post(c.person) is 'The first post by the person.';

-- Same as optional_missing_middle_* functions above, but computed column
create function c.person_optional_missing_middle_1(p c.person, int, b int default 2, c int default 3) returns int as $$ select $2 + $3 + $4 $$ language sql immutable strict;
create function c.person_optional_missing_middle_2(p c.person, a int, b int default 2, c int default 3) returns int as $$ select $2 + $3 + $4 $$ language sql immutable strict;
create function c.person_optional_missing_middle_3(p c.person, a int, int default 2, c int default 3) returns int as $$ select $2 + $3 + $4 $$ language sql immutable strict;
create function c.person_optional_missing_middle_4(p c.person, int, b int default 2, int default 3) returns int as $$ select $2 + $3 + $4 $$ language sql immutable strict;
create function c.person_optional_missing_middle_5(p c.person, a int, int default 2, int default 3) returns int as $$ select $2 + $3 + $4 $$ language sql immutable strict;

create function c.compound_type_computed_field(compound_type c.compound_type) returns integer as $$ select compound_type.a + compound_type.foo_bar $$ language sql stable;
create function a.post_headline_trimmed(post a.post, length int default 10, omission text default '…') returns text as $$ select substr(post.headline, 0, length) || omission $$ language sql stable;
create function a.post_headline_trimmed_strict(post a.post, length int default 10, omission text default '…') returns text as $$ select substr(post.headline, 0, length) || omission $$ language sql stable strict;
create function a.post_headline_trimmed_no_defaults(post a.post, length int, omission text) returns text as $$ select substr(post.headline, 0, length) || omission $$ language sql stable;
create function a.post_many(posts a.post[]) returns setof a.post as $$ declare current_post a.post; begin foreach current_post in array posts loop return next current_post; end loop; end; $$ language plpgsql;

create function c.left_arm_identity(left_arm c.left_arm) returns c.left_arm as $$ select left_arm.*; $$ language sql volatile;
comment on function c.left_arm_identity(left_arm c.left_arm) is E'@arg0variant base\n@resultFieldName leftArm';

-- Procs -> custom queries
create function a.query_compound_type_array(object c.compound_type) returns c.compound_type[] as $$ select ARRAY[object, (null, null, null, null, null, null, null, null)::c.compound_type, (object.a + 1, object.b, object.c, object.d, object.e, object.f, object.g, object.foo_bar)::c.compound_type]; $$ language sql stable;
create function a.query_text_array() returns text[] as $$ select ARRAY['str1','str2','str3']; $$ language sql stable;
create function a.query_interval_array() returns interval[] as $$ select ARRAY[interval '12 seconds', interval '3 hours', interval '34567 seconds']; $$ language sql stable;
create function a.query_interval_set() returns setof interval as $$ begin return next interval '12 seconds'; return next interval '3 hours'; return next interval '34567 seconds'; end; $$ language plpgsql stable;

-- Procs -> computed columns
-- (NOTE: these are on 'post' not 'person' due to PL/pgSQL issue with person's 'site' column.)
create function a.post_computed_compound_type_array(post a.post, object c.compound_type) returns c.compound_type[] as $$ select ARRAY[object, (null, null, null, null, null, null, null, null)::c.compound_type, (object.a + 1, object.b, object.c, object.d, object.e, object.f, object.g, object.foo_bar)::c.compound_type]; $$ language sql stable;
create function a.post_computed_text_array(post a.post) returns text[] as $$ select ARRAY['str1','str2','str3']; $$ language sql stable;
create function a.post_computed_interval_array(post a.post) returns interval[] as $$ select ARRAY[interval '12 seconds', interval '3 hours', interval '34567 seconds']; $$ language sql stable;
create function a.post_computed_interval_set(post a.post) returns setof interval as $$ begin return next interval '12 seconds'; return next interval '3 hours'; return next interval '34567 seconds'; end; $$ language plpgsql stable;
create function a.post_computed_with_required_arg(post a.post, i int) returns int as $$ select coalesce(i, 1); $$ language sql stable strict;
comment on function a.post_computed_with_required_arg(post a.post, i int) is E'@sortable\n@filterable';
create function a.post_computed_with_optional_arg(post a.post, i int = 1) returns int as $$ select i; $$ language sql stable strict;
comment on function a.post_computed_with_optional_arg(post a.post, i int) is E'@sortable\n@filterable';

-- Procs -> custom mutations
create function a.mutation_compound_type_array(object c.compound_type) returns c.compound_type[] as $$ select ARRAY[object, (null, null, null, null, null, null, null, null)::c.compound_type, (object.a + 1, object.b, object.c, object.d, object.e, object.f, object.g, object.foo_bar)::c.compound_type]; $$ language sql volatile;
create function a.mutation_text_array() returns text[] as $$ select ARRAY['str1','str2','str3']; $$ language sql volatile;
create function a.mutation_interval_array() returns interval[] as $$ select ARRAY[interval '12 seconds', interval '3 hours', interval '34567 seconds']; $$ language sql volatile;
create function a.mutation_interval_set() returns setof interval as $$ begin return next interval '12 seconds'; return next interval '3 hours'; return next interval '34567 seconds'; end; $$ language plpgsql volatile;

-- Procs returning `type` record (to test JSON encoding)
create function b.type_function(id int) returns b.types as $$ select * from b.types where types.id = $1; $$ language sql stable;
create function b.type_function_list() returns b.types[] as $$ select array_agg(types order by id) from b.types $$ language sql stable;
create function b.type_function_connection() returns setof b.types as $$ select * from b.types order by id asc $$ language sql stable;
create function c.person_type_function(p c.person, id int) returns b.types as $$ select * from b.types where types.id = $2; $$ language sql stable;
create function c.person_type_function_list(p c.person) returns b.types[] as $$ select array_agg(types order by id) from b.types $$ language sql stable;
create function c.person_type_function_connection(p c.person) returns setof b.types as $$ select * from b.types order by id asc $$ language sql stable;
create function b.type_function_mutation(id int) returns b.types as $$ select * from b.types where types.id = $1; $$ language sql;
create function b.type_function_list_mutation() returns b.types[] as $$ select array_agg(types order by id) from b.types $$ language sql;
create function b.type_function_connection_mutation() returns setof b.types as $$ select * from b.types order by id asc $$ language sql;

create function a.assert_something(in_arg text) returns void as $$
  begin raise exception 'Nope'; end;
$$ stable language plpgsql;
create function a.assert_something_nx(in_arg text) returns void as $$
  begin raise exception 'Nope'; end;
$$ stable language plpgsql;
comment on function a.assert_something_nx(text) is '@omit execute';

create type b.jwt_token as (
  role text,
  exp bigint,
  a integer,
  b numeric,
  c bigint
);

create function b.authenticate(a integer, b numeric, c bigint) returns b.jwt_token as $$ select ('yay', extract(epoch from '2037-07-12'::timestamp), a, b, c)::b.jwt_token $$ language sql;
create function b.authenticate_many(a integer, b numeric, c bigint) returns b.jwt_token[] as $$ select array[('foo', 1, a, b, c)::b.jwt_token, ('bar', 2, a + 1, b + 1, c + 1)::b.jwt_token, ('baz', 3, a + 2, b + 2, c + 2)::b.jwt_token] $$ language sql;
create function b.authenticate_fail() returns b.jwt_token as $$ select null::b.jwt_token $$ language sql;

create type b.auth_payload as (
  jwt b.jwt_token,
  id int,
  admin bool
);

comment on type b.auth_payload is E'@foreignKey (id) references c.person';

create function b.authenticate_payload(a integer, b numeric, c bigint) returns b.auth_payload as $$ select (('yay', extract(epoch from '2037-07-12'::timestamp), a, b, c)::b.jwt_token, 1, true)::b.auth_payload $$ language sql;

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

comment on function a.post_with_suffix(post a.post,suffix text) is '@deprecated This is deprecated (comment on function a.post_with_suffix).';

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

comment on function c.badly_behaved_function() is '@deprecated This is deprecated (comment on function c.badly_behaved_function).';

create table c.my_table (
  id serial primary key,
  json_data jsonb
);


-- https://github.com/graphile/postgraphile/issues/756
create domain c.not_null_timestamp timestamptz not null default '1999-06-11T00:00:00Z';
create table c.issue756 (
  id serial primary key,
  ts c.not_null_timestamp
);

create table c.null_test_record (
  id serial primary key,
  nullable_text text,
  nullable_int int,
  non_null_text text not null
);

create function c.issue756_mutation() returns c.issue756 as $$
begin
  return null;
end;
$$ language plpgsql volatile;
create function c.issue756_set_mutation() returns setof c.issue756 as $$
begin
  return query insert into c.issue756 default values returning *;
  return next null;
  return query insert into c.issue756 default values returning *;
end;
$$ language plpgsql volatile;

create function c.return_table_without_grants() returns c.compound_key as $$
  select * from c.compound_key order by person_id_1, person_id_2 limit 1
$$ language sql stable security definer;

-- This should not add a query to the schema; return type is undefined
create function c.func_returns_untyped_record() returns record as $$
  select 42;
$$ language sql stable;

-- This should not add a query to the schema; return type is undefined
create function c.func_with_input_returns_untyped_record(i int) returns record as $$
  select 42;
$$ language sql stable;

-- This should not add a query to the schema; uses a record argument
create function c.func_with_record_arg(out r record) as $$
  select 42;
$$ language sql stable;

create function c.func_out(out o int) as $$
  select 42 as o;
$$ language sql stable;

create function c.func_out_unnamed(out int) as $$
  select 42;
$$ language sql stable;

create function c.func_out_setof(out o int) returns setof int as $$
  select 42 as o
  union
  select 43 as o;
$$ language sql stable;

create function c.func_out_out(out first_out int, out second_out text) as $$
  select 42 as first_out, 'out'::text as second_out;
$$ language sql stable;

create function c.func_out_out_unnamed(out int, out text) as $$
  select 42, 'out'::text;
$$ language sql stable;

create function c.func_out_out_setof(out o1 int, out o2 text) returns setof record as $$
  select 42 as o1, 'out'::text as o2
  union
  select 43 as o1, 'out2'::text as o2
$$ language sql stable;

create function c.func_out_table(out c.person) as $$
  select * from c.person where id = 1;
$$ language sql stable;

create function c.func_out_table_setof(out c.person) returns setof c.person as $$
  select * from c.person order by person.id asc;
$$ language sql stable;

create function c.func_out_out_compound_type(i1 int, out o1 int, out o2 c.compound_type) as $$
  select i1 + 10 as o1, compound_type as o2 from b.types order by id asc limit 1;
$$ language sql stable;

create function c.person_computed_out (person c.person, out o1 text) as $$
  select 'o1 ' || person.person_full_name;
$$ language sql stable;
comment on function c.person_computed_out (person c.person, out o1 text) is E'@notNull\n@sortable\n@filterable';

create function c.person_computed_out_out (person c.person, out o1 text, out o2 text) as $$
  select 'o1 ' || person.person_full_name, 'o2 ' || person.person_full_name;
$$ language sql stable;

create function c.person_computed_inout (person c.person, inout ino text) as $$
  select ino || ' ' || person.person_full_name as ino;
$$ language sql stable;

create function c.person_computed_inout_out (person c.person, inout ino text, out o text) as $$
  select ino || ' ' || person.person_full_name as ino, 'o ' || person.person_full_name as o;
$$ language sql stable;

create function c.person_computed_complex (person c.person, in a int, in b text, out x int, out y c.compound_type, out z c.person) as $$
  select
    a + 1 as x,
    b.types.compound_type as y,
    person as z
  from c.person
    inner join b.types on c.person.id = (b.types.id - 10)
  order by person.id asc, types.id asc
  limit 1;
$$ language sql stable;

create function c.person_computed_first_arg_inout (inout person c.person) as $$
  select person;
$$ language sql stable;

create function c.person_computed_first_arg_inout_out (inout person c.person, out o int) as $$
  select person, 42 as o;
$$ language sql stable;

create function c.func_out_unnamed_out_out_unnamed(out int, out o2 text, out int) as $$
  select 42, 'out2'::text, 3;
$$ language sql stable;

create function c.func_in_out(i int, out o int) as $$
  select i + 42 as o;
$$ language sql stable;

create function c.func_in_inout(i int, inout ino int) as $$
  select i + ino as ino;
$$ language sql stable;

create function c.func_out_complex(in a int, in b text, out x int, out y c.compound_type, out z c.person) as $$
  select
    a + 1 as x,
    b.types.compound_type as y,
    person as z
  from c.person
    inner join b.types on c.person.id = (b.types.id - 10)
  order by person.id asc, types.id asc
  limit 1;
$$ language sql stable;

create function c.func_out_complex_setof(in a int, in b text, out x int, out y c.compound_type, out z c.person) returns setof record as $$
  select
    a + 1 as x,
    b.types.compound_type as y,
    person as z
  from c.person
    inner join b.types on c.person.id = (b.types.id - 10)
  order by person.id asc, types.id asc
  limit 1;
$$ language sql stable;

create function c.func_returns_table_one_col(i int) returns table (col1 int) as $$
  select i + 42 as col1
  union
  select i + 43 as col1;
$$ language sql stable;

create function c.func_returns_table_multi_col(i int, a int default null, b int default null) returns table (col1 int, col2 text) as $$
  select i + 42 + coalesce(a, 0) + coalesce(b, 0) as col1, 'out'::text as col2
  union
  select i + 43 + coalesce(a, 0) + coalesce(b, 0) as col1, 'out2'::text as col2;
$$ language sql stable;

create function c.mutation_in_inout(i int, inout ino int) as $$
  select i + ino as ino;
$$ language sql volatile;

create function c.mutation_in_out(i int, out o int) as $$
  select i + 42 as o;
$$ language sql volatile;

create function c.mutation_out(out o int) as $$
  select 42 as o;
$$ language sql volatile;

create function c.mutation_out_complex(in a int, in b text, out x int, out y c.compound_type, out z c.person) as $$
  select
    a + 1 as x,
    b.types.compound_type as y,
    person as z
  from c.person
    inner join b.types on c.person.id = (b.types.id - 10)
  order by person.id asc, types.id asc
  limit 1;
$$ language sql volatile;

create function c.mutation_out_complex_setof(in a int, in b text, out x int, out y c.compound_type, out z c.person) returns setof record as $$
  select
    a + 1 as x,
    b.types.compound_type as y,
    person as z
  from c.person
    inner join b.types on c.person.id = (b.types.id - 10)
  order by person.id asc, types.id asc
  limit 1;
$$ language sql volatile;

create function c.mutation_out_out(out first_out int, out second_out text) as $$
  select 42 as first_out, 'out'::text as second_out;
$$ language sql volatile;

create function c.mutation_out_out_compound_type(i1 int, out o1 int, out o2 c.compound_type) as $$
  select i1 + 10 as o1, compound_type as o2 from b.types order by id asc limit 1;
$$ language sql volatile;

create function c.mutation_out_out_setof(out o1 int, out o2 text) returns setof record as $$
  select 42 as o1, 'out'::text as o2
  union
  select 43 as o1, 'out2'::text as o2
$$ language sql volatile;

create function c.mutation_out_out_unnamed(out int, out text) as $$
  select 42, 'out'::text;
$$ language sql volatile;

create function c.mutation_out_setof(out o int) returns setof int as $$
  select 42 as o
  union
  select 43 as o;
$$ language sql volatile;

create function c.mutation_out_table(out c.person) as $$
  select * from c.person where id = 1;
$$ language sql volatile;

create function c.mutation_out_table_setof(out c.person) returns setof c.person as $$
  select * from c.person order by id;
$$ language sql volatile;

create function c.mutation_out_unnamed(out int) as $$
  select 42;
$$ language sql volatile;

create function c.mutation_out_unnamed_out_out_unnamed(out int, out o2 text, out int) as $$
  select 42, 'out2'::text, 3;
$$ language sql volatile;

create function c.mutation_returns_table_multi_col(i int) returns table (col1 int, col2 text) as $$
  select i + 42 as col1, 'out'::text as col2
  union
  select i + 43 as col1, 'out2'::text as col2;
$$ language sql volatile;

create function c.mutation_returns_table_one_col(i int) returns table (col1 int) as $$
  select i + 42 as col1
  union
  select i + 43 as col1;
$$ language sql volatile;

create function c.query_output_two_rows(in left_arm_id int, in post_id int, inout txt text, out left_arm c.left_arm, out post a.post) as $$
begin
  txt = txt || left_arm_id::text || post_id::text;
  select * into $4 from c.left_arm where id = left_arm_id;
  select * into $5 from a.post where id = post_id;
end;
$$ language plpgsql stable;

-- Issue #666 from graphile-engine
CREATE FUNCTION c.search_test_summaries() RETURNS TABLE (
	id integer,
	total_duration interval
) AS $$
	WITH foo(id, total_duration) AS (
	VALUES
		(1, '02:01:00'::interval),
		(2, '03:01:00'::interval)
	) SELECT * FROM foo;
    $$
LANGUAGE SQL STABLE;
COMMENT ON FUNCTION c.search_test_summaries() IS E'@simpleCollections only';

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

create index full_name_idx on d.person ((first_name || ' ' || last_name));

create table d.post (
  id serial primary key,
  body text,
  author_id int4 references d.person(id) on delete cascade
);

comment on constraint post_author_id_fkey on d.post is E'@foreignFieldName posts\n@fieldName author';
comment on constraint person_pkey on d.person is E'@fieldName findPersonById';
comment on function d.person_full_name(d.person) is E'@fieldName name\n@behavior +queryField\n@arg0variant nodeId';

-- Rename custom queries

create function d.search_posts(search text)
returns setof d.post as $$
    select *
    from d.post
    where
      body ilike ('%' || search || '%')
    order by post.id asc
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
    studio_id   integer references d.studios on delete cascade
);


create table d.tv_episodes (
    code        integer PRIMARY KEY,
    title       varchar(40),
    show_id     integer references d.tv_shows on delete cascade
);

/*

Here's the missing indexes:

CREATE INDEX ON "a"."foreign_key"("compound_key_1", "compound_key_2");
CREATE INDEX ON "a"."foreign_key"("person_id");
CREATE INDEX ON "a"."unique_foreign_key"("compound_key_1", "compound_key_2");
CREATE INDEX ON "c"."compound_key"("person_id_1");
CREATE INDEX ON "c"."compound_key"("person_id_2");
CREATE INDEX ON "c"."left_arm"("person_id");
CREATE INDEX ON "c"."person_secret"("person_id");

*/

create schema inheritence;

create table inheritence.user (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

create table inheritence.file (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL
);

create table inheritence.user_file (
  user_id INTEGER NOT NULL REFERENCES inheritence.user(id)
) inherits (inheritence.file);




create schema smart_comment_relations;

create table smart_comment_relations.streets (
  id serial primary key,
  name text not null
);

create table smart_comment_relations.properties (
  id serial primary key,
  street_id int not null references smart_comment_relations.streets on delete cascade,
  name_or_number text not null
);

create table smart_comment_relations.street_property (
  str_id int not null references smart_comment_relations.streets on delete cascade,
  prop_id int not null references smart_comment_relations.properties on delete cascade,
  current_owner text,
  primary key (str_id, prop_id)
);

create table smart_comment_relations.buildings (
  id serial primary key,
  property_id int not null references smart_comment_relations.properties on delete cascade,
  name text not null,
  floors int not null default 1,
  is_primary boolean not null default true
);

comment on table smart_comment_relations.streets is E'@unique name';
comment on table smart_comment_relations.buildings is E'@foreignKey (name) references streets (name)|@fieldName namedAfterStreet|@foreignFieldName buildingsNamedAfterStreet|@foreignSimpleFieldName buildingsNamedAfterStreetList';

-- Only one primary building
create unique index on smart_comment_relations.buildings (property_id) where is_primary is true;

create view smart_comment_relations.houses as (
  select
    buildings.name as building_name,
    properties.name_or_number as property_name_or_number,
    streets.name as street_name,
    streets.id as street_id,
    buildings.id as building_id,
    properties.id as property_id,
    buildings.floors
  from smart_comment_relations.properties
  inner join smart_comment_relations.streets
  on (properties.street_id = streets.id)
  left join smart_comment_relations.buildings
  on (buildings.property_id = properties.id and buildings.is_primary is true)
);
comment on view smart_comment_relations.houses is E'@primaryKey street_id,property_id
@foreignKey (street_id) references smart_comment_relations.streets
@foreignKey (building_id) references smart_comment_relations.buildings (id)
@foreignKey (property_id) references properties
@foreignKey (street_id, property_id) references street_property (str_id, prop_id)
';

comment on column smart_comment_relations.houses.property_name_or_number is E'@notNull';
comment on column smart_comment_relations.houses.street_name is E'@notNull';

create table smart_comment_relations.post (
  id text primary key
);
comment on table smart_comment_relations.post is E'@name post_table
@omit';

create table smart_comment_relations.offer (
  id serial primary key,
  post_id text references smart_comment_relations.post(id) not null
);
comment on table smart_comment_relations.offer is E'@name offer_table
@omit';

create view smart_comment_relations.post_view as
  SELECT
    post.id
    FROM smart_comment_relations.post post;
comment on view smart_comment_relations.post_view is E'@name posts
@primaryKey id';

create view smart_comment_relations.offer_view as
  SELECT
    offer.id,
    offer.post_id

    FROM smart_comment_relations.offer offer;
comment on view smart_comment_relations.offer_view is E'@name offers
@primaryKey id
@foreignKey (post_id) references post_view (id)';

create schema ranges;
create table ranges.range_test (
  id serial primary key,
  num numrange default null,
  int8 int8range default null,
  ts tsrange default null,
  tstz tstzrange default null
);

create schema index_expressions;

create table index_expressions.employee (
  id serial primary key,
  first_name text not null,
  last_name text not null
);

create unique index employee_name on index_expressions.employee ((first_name || ' ' || last_name));
create index employee_lower_name on index_expressions.employee (lower(first_name));
create index employee_first_name_idx on index_expressions.employee (first_name);


create schema simple_collections;

create table simple_collections.people (
  id serial primary key,
  name text
);

create table simple_collections.pets (
  id serial primary key,
  owner_id int not null references simple_collections.people,
  name text
);

create function simple_collections.people_odd_pets(p simple_collections.people) returns setof simple_collections.pets as $$
  select * from simple_collections.pets where owner_id = p.id and id % 2 = 1 order by pets.id asc;
$$ language sql stable;

create schema live_test;

create table live_test.users (
  id serial primary key,
  name text not null,
  favorite_color text
);

create table live_test.todos (
  id serial primary key,
  user_id int not null references live_test.users on delete cascade,
  task text not null,
  completed boolean not null default false
);

create table live_test.todos_log (
  todo_id int not null references live_test.todos on delete cascade,
  user_id int not null references live_test.users on delete cascade,
  action text not null,
  PRIMARY KEY ("todo_id","user_id")
);

create table live_test.todos_log_viewed (
  id serial primary key,
  user_id int not null,
  todo_id int not null,
  viewed_at timestamp not null default now(),
  foreign key (user_id, todo_id) references live_test.todos_log(user_id, todo_id) on delete cascade
);

create table large_bigint.large_node_id (
  id bigint primary key,
  text text
);

create schema network_types;
create table network_types.network (
  id serial primary key,
  inet inet,
  cidr cidr,
  macaddr macaddr
);

/******************************************************************************/

create schema named_query_builder;

create table named_query_builder.toys (
  id serial primary key,
  name text not null
);

create table named_query_builder.categories (
  id serial primary key,
  name text not null
);

create table named_query_builder.toy_categories (
  toy_id int not null references named_query_builder.toys,
  category_id int not null references named_query_builder.categories,
  approved boolean not null
);

--------------------------------------------------------------------------------

create schema enum_tables;
create table enum_tables.simple_enum (value text primary key, description text);
comment on table enum_tables.simple_enum is E'@enum';

create table enum_tables.abcd (letter text primary key, description text);
comment on column enum_tables.abcd.description is E'@enumDescription';
comment on table enum_tables.abcd is E'@enum\n@enumName LetterAToD';

create view enum_tables.abcd_view as (select * from enum_tables.abcd);
comment on view enum_tables.abcd_view is E'@primaryKey letter\n@enum\n@enumName LetterAToDViaView';

create table enum_tables.letter_descriptions(
  id serial primary key,
  letter text not null references enum_tables.abcd unique,
  letter_via_view text not null unique,
  description text
);

comment on table enum_tables.letter_descriptions is '@foreignKey (letter_via_view) references enum_tables.abcd_view';

create table enum_tables.lots_of_enums (
  id serial primary key,
  enum_1 text,
  enum_2 varchar(3),
  enum_3 char(2),
  enum_4 text,
  description text,
  constraint enum_1 unique(enum_1),
  constraint enum_2 unique(enum_2),
  constraint enum_3 unique(enum_3),
  constraint enum_4 unique(enum_4)
);

comment on table enum_tables.lots_of_enums is E'@omit';
comment on constraint enum_1 on enum_tables.lots_of_enums is E'@enum\n@enumName EnumTheFirst';
comment on constraint enum_2 on enum_tables.lots_of_enums is E'@enum\n@enumName EnumTheSecond';
comment on constraint enum_3 on enum_tables.lots_of_enums is E'@enum';
comment on constraint enum_4 on enum_tables.lots_of_enums is E'@enum';

-- Enum table needs values added as part of the migration, not as part of the
-- data.
insert into enum_tables.simple_enum (value, description) values
  ('Foo', 'The first metasyntactic variable'),
  ('Bar', null),
  ('Baz', 'The third metasyntactic variable, very similar to its predecessor'),
  ('Qux', null);
insert into enum_tables.abcd (letter, description) values
  ('A', 'The letter A'),
  ('B', 'The letter B'),
  ('C', 'The letter C'),
  ('D', 'The letter D');
insert into enum_tables.lots_of_enums (enum_1, description) values
  ('a1', 'Desc A1'),
  ('a2', 'Desc A2'),
  ('a3', 'Desc A3'),
  ('a4', 'Desc A4');
insert into enum_tables.lots_of_enums (enum_2, description) values
  ('b1', 'Desc B1'),
  ('b2', 'Desc B2'),
  ('b3', 'Desc B3'),
  ('b4', 'Desc B4');
insert into enum_tables.lots_of_enums (enum_3, description) values
  ('c1', 'Desc C1'),
  ('c2', 'Desc C2'),
  ('c3', 'Desc C3'),
  ('c4', 'Desc C4');
insert into enum_tables.lots_of_enums (enum_4, description) values
  ('d1', 'Desc D1'),
  ('d2', 'Desc D2'),
  ('d3', 'Desc D3'),
  ('d4', 'Desc D4');

create table enum_tables.referencing_table(
  id serial primary key,
  enum_1 text references enum_tables.lots_of_enums(enum_1),
  enum_2 varchar(3) references enum_tables.lots_of_enums(enum_2),
  enum_3 char(2) references enum_tables.lots_of_enums(enum_3),
  simple_enum text references enum_tables.simple_enum
);

-- Relates to https://github.com/graphile/postgraphile/issues/1365
create function enum_tables.referencing_table_mutation(t enum_tables.referencing_table)
returns int as $$
declare
  v_out int;
begin
  insert into enum_tables.referencing_table (enum_1, enum_2, enum_3, simple_enum) values (t.enum_1, t.enum_2, t.enum_3, t.simple_enum)
    returning id into v_out;
  return v_out;
end;
$$ language plpgsql volatile;


--------------------------------------------------------------------------------

create schema geometry;
create table geometry.geom (
  id serial primary key,
  point point,
  line line,
  lseg lseg,
  box box,
  open_path path,
  closed_path path,
  polygon polygon,
  circle circle
);

--------------------------------------------------------------------------------

create schema polymorphic;

create table polymorphic.people (
  person_id serial primary key,
  username text not null unique
);

comment on table polymorphic.people is $$
  @unionMember PersonOrOrganization
  @ref applications to:Application
  @refVia applications via:aws_applications
  @refVia applications via:gcp_applications
  $$;

create table polymorphic.organizations (
  organization_id serial primary key,
  name text not null unique
);

comment on table polymorphic.organizations is E'@unionMember PersonOrOrganization';

create table polymorphic.log_entries (
  id serial primary key,
  person_id int references polymorphic.people on delete cascade,
  organization_id int references polymorphic.organizations on delete cascade,
  text text not null,
  constraint owned_by_person_or_organization check ((person_id is null) <> (organization_id is null))
);

comment on table polymorphic.log_entries is $$
  @ref author to:PersonOrOrganization singular
  @refVia author via:people
  @refVia author via:organizations
  $$;

create type polymorphic.item_type as enum (
  'TOPIC',
  'POST',
  'DIVIDER',
  'CHECKLIST',
  'CHECKLIST_ITEM'
);

-- This table itself is not polymorphic
create table polymorphic.priorities (
  id serial primary key,
  title text not null
);
comment on table polymorphic.priorities is E'@omit create,update,delete,filter,order';

create table polymorphic.single_table_items (
  id serial primary key,

  -- Rails-style polymorphic column
  type polymorphic.item_type not null default 'POST'::polymorphic.item_type,

  -- Shared attributes:
  parent_id int references polymorphic.single_table_items on delete cascade,
  root_topic_id int constraint single_table_items_root_topic_fkey references polymorphic.single_table_items on delete cascade,
  author_id int not null references polymorphic.people on delete cascade,
  position bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_explicitly_archived bool not null default false,
  archived_at timestamptz,

  -- Attributes that may be used by one or more item subtypes.
  title text,
  description text,
  note text,
  color text,
  -- This relationship is _only_ used by CHECKLIST_ITEM and POST
  priority_id int references polymorphic.priorities
);



comment on table polymorphic.single_table_items is $$
  @interface mode:single type:type
  @type TOPIC name:SingleTableTopic attributes:title!
  @type POST name:SingleTablePost attributes:title>subject,description,note,priority_id
  @type DIVIDER name:SingleTableDivider attributes:title,color
  @type CHECKLIST name:SingleTableChecklist attributes:title
  @type CHECKLIST_ITEM name:SingleTableChecklistItem attributes:description,note,priority_id
  @ref rootTopic to:SingleTableTopic singular via:(root_topic_id)->polymorphic.single_table_items(id)
  @ref rootChecklistTopic from:SingleTableChecklist to:SingleTableTopic singular via:(root_topic_id)->polymorphic.single_table_items(id)
  $$;

create function polymorphic.single_table_items_meaning_of_life(sti polymorphic.single_table_items) returns int as $$
select 42;
$$ language sql stable;

create function polymorphic.all_single_tables ()
returns setof polymorphic.single_table_items as $$
  select * from polymorphic.single_table_items
$$ language sql stable;

comment on constraint single_table_items_root_topic_fkey on polymorphic.single_table_items is $$
  @behavior -*
  $$;

create table polymorphic.single_table_item_relations (
  id serial primary key,
  parent_id int not null references polymorphic.single_table_items on delete cascade,
  child_id int not null references polymorphic.single_table_items on delete cascade,
  constraint single_table_item_relations_parent_chilk_ak unique (parent_id, child_id)
);

create index on polymorphic.single_table_item_relations (parent_id);
create index on polymorphic.single_table_item_relations (child_id);

create table polymorphic.single_table_item_relation_composite_pks (
  parent_id int not null references polymorphic.single_table_items on delete cascade,
  child_id int not null references polymorphic.single_table_items on delete cascade,
  primary key (parent_id, child_id)
);

create index on polymorphic.single_table_item_relation_composite_pks (child_id);

create function polymorphic.get_single_table_topic_by_id(id int)
returns polymorphic.single_table_items
as $$
  select * from polymorphic.single_table_items
  where single_table_items.id = get_single_table_topic_by_id.id
  and type = 'TOPIC' -- 👈 will guarantee to return a SingleTableTopic
$$ language sql stable;
comment on function polymorphic.get_single_table_topic_by_id is '@returnType SingleTableTopic';

----------------------------------------

create table polymorphic.relational_items (
  id serial primary key,

  -- This column is used to tell us which table we need to join to
  type polymorphic.item_type not null default 'POST'::polymorphic.item_type,

  -- Shared attributes (also 'id'):
  parent_id int references polymorphic.relational_items on delete cascade,
  root_topic_id int, -- constraint being created below
  author_id int not null references polymorphic.people on delete cascade,
  position bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_explicitly_archived bool not null default false,
  archived_at timestamptz
);

create table polymorphic.relational_topics (
  topic_item_id int primary key references polymorphic.relational_items on delete cascade,
  title text not null
);
alter table polymorphic.relational_items add constraint relational_items_root_topic_fkey foreign key (root_topic_id) references polymorphic.relational_topics on delete cascade;
create table polymorphic.relational_posts (
  post_item_id int primary key references polymorphic.relational_items on delete cascade,
  title text not null,
  description text default '-- Enter description here --',
  note text
);
create table polymorphic.relational_dividers (
  divider_item_id int primary key references polymorphic.relational_items on delete cascade,
  title text,
  color text
);
create table polymorphic.relational_checklists (
  checklist_item_id int primary key references polymorphic.relational_items on delete cascade,
  title text not null
);
create table polymorphic.relational_checklist_items (
  checklist_item_item_id int primary key references polymorphic.relational_items on delete cascade,
  description text not null,
  note text
);

-- `type:type` is the default
comment on table polymorphic.relational_items is $$
  @interface mode:relational
  @type TOPIC references:relational_topics
  @type POST references:relational_posts
  @type DIVIDER references:relational_dividers
  @type CHECKLIST references:relational_checklists
  @type CHECKLIST_ITEM references:relational_checklist_items
  $$;

create function polymorphic.relational_items_meaning_of_life(ri polymorphic.relational_items) returns int as $$
select 42;
$$ language sql stable;

CREATE FUNCTION polymorphic.custom_delete_relational_item("nodeId" polymorphic.relational_items)
RETURNS boolean
AS $$
  DELETE FROM polymorphic.relational_items
  WHERE relational_items.id = "nodeId".id
  RETURNING true;
$$ LANGUAGE sql VOLATILE;

comment on function polymorphic.custom_delete_relational_item(polymorphic.relational_items) is E'@arg0variant nodeId';

----------------------------------------

create type polymorphic.applications as (
  id int,
  name text,
  last_deployed timestamptz
);

create table polymorphic.aws_applications (
  id int primary key,
  name text not null,
  last_deployed timestamptz,
  person_id int references polymorphic.people,
  organization_id int references polymorphic.organizations,
  aws_id text
);

create table polymorphic.gcp_applications (
  id int primary key,
  name text not null,
  last_deployed timestamptz,
  person_id int references polymorphic.people,
  organization_id int references polymorphic.organizations,
  gcp_id text
);

create type polymorphic.vulnerabilities as (
  id int,
  name text,
  cvss_score float
);

create table polymorphic.first_party_vulnerabilities (
  id int primary key,
  name text not null,
  cvss_score float not null,
  team_name text
);
create table polymorphic.third_party_vulnerabilities (
  id int primary key,
  name text not null,
  cvss_score float not null,
  vendor_name text
);

create function polymorphic.first_party_vulnerabilities_cvss_score_int (
  r polymorphic.first_party_vulnerabilities
) returns int as $$
select (r.cvss_score * 100)::int;
$$ language sql stable;

create function polymorphic.third_party_vulnerabilities_cvss_score_int (
  r polymorphic.third_party_vulnerabilities
) returns int as $$
select (r.cvss_score * 100)::int;
$$ language sql stable;

create table polymorphic.aws_application_first_party_vulnerabilities (
  aws_application_id int not null references polymorphic.aws_applications,
  first_party_vulnerability_id int not null references polymorphic.first_party_vulnerabilities,
  primary key (aws_application_id, first_party_vulnerability_id)
);
create table polymorphic.aws_application_third_party_vulnerabilities (
  aws_application_id int not null references polymorphic.aws_applications,
  third_party_vulnerability_id int not null references polymorphic.third_party_vulnerabilities,
  primary key (aws_application_id, third_party_vulnerability_id)
);
create table polymorphic.gcp_application_first_party_vulnerabilities (
  gcp_application_id int not null references polymorphic.gcp_applications,
  first_party_vulnerability_id int not null references polymorphic.first_party_vulnerabilities,
  primary key (gcp_application_id, first_party_vulnerability_id)
);
create table polymorphic.gcp_application_third_party_vulnerabilities (
  gcp_application_id int not null references polymorphic.gcp_applications,
  third_party_vulnerability_id int not null references polymorphic.third_party_vulnerabilities,
  primary key (gcp_application_id, third_party_vulnerability_id)
);

create index on polymorphic.aws_application_first_party_vulnerabilities (first_party_vulnerability_id);
create index on polymorphic.aws_application_third_party_vulnerabilities (third_party_vulnerability_id);
create index on polymorphic.gcp_application_first_party_vulnerabilities (first_party_vulnerability_id);
create index on polymorphic.gcp_application_third_party_vulnerabilities (third_party_vulnerability_id);

comment on type polymorphic.applications is $$
@interface mode:union
@name Application
@behavior node
@ref vulnerabilities to:Vulnerability plural
@ref owner to:PersonOrOrganization singular
$$;
comment on column polymorphic.applications.id is '@notNull';
comment on column polymorphic.applications.name is '@notNull';

comment on table polymorphic.aws_applications is $$
@implements Application
@ref vulnerabilities to:Vulnerability plural
@refVia vulnerabilities via:(id)->aws_application_first_party_vulnerabilities(aws_application_id);(first_party_vulnerability_id)->first_party_vulnerabilities(id)
@refVia vulnerabilities via:(id)->aws_application_third_party_vulnerabilities(aws_application_id);(third_party_vulnerability_id)->third_party_vulnerabilities(id)
@ref owner to:PersonOrOrganization singular
@refVia owner via:people
@refVia owner via:organizations
$$;
comment on table polymorphic.gcp_applications is $$
@implements Application
@ref vulnerabilities to:Vulnerability plural
@refVia vulnerabilities via:(id)->gcp_application_first_party_vulnerabilities(gcp_application_id);(first_party_vulnerability_id)->first_party_vulnerabilities(id)
@refVia vulnerabilities via:(id)->gcp_application_third_party_vulnerabilities(gcp_application_id);(third_party_vulnerability_id)->third_party_vulnerabilities(id)
@ref owner to:PersonOrOrganization singular
@refVia owner via:people
@refVia owner via:organizations
$$;

comment on table polymorphic.aws_application_first_party_vulnerabilities is '@omit';
comment on table polymorphic.aws_application_third_party_vulnerabilities is '@omit';
comment on table polymorphic.gcp_application_first_party_vulnerabilities is '@omit';
comment on table polymorphic.gcp_application_third_party_vulnerabilities is '@omit';

comment on type polymorphic.vulnerabilities is $$
@interface mode:union
@name Vulnerability
@behavior node
@ref applications to:Application plural
@ref owners to:PersonOrOrganization plural
$$;

comment on column polymorphic.vulnerabilities.id is '@notNull';
comment on column polymorphic.vulnerabilities.name is '@notNull';
comment on column polymorphic.vulnerabilities.cvss_score is '@notNull';

comment on table polymorphic.first_party_vulnerabilities is $$
@implements Vulnerability
@ref applications to:Application plural
@refVia applications via:aws_application_first_party_vulnerabilities;aws_applications
@refVia applications via:gcp_application_first_party_vulnerabilities;gcp_applications
@ref owners to:PersonOrOrganization plural
@refVia owners via:aws_application_first_party_vulnerabilities;aws_applications;people
@refVia owners via:aws_application_first_party_vulnerabilities;aws_applications;organizations
@refVia owners via:gcp_application_first_party_vulnerabilities;gcp_applications;people
@refVia owners via:gcp_application_first_party_vulnerabilities;gcp_applications;organizations
$$;
comment on table polymorphic.third_party_vulnerabilities is $$
@implements Vulnerability
@ref applications to:Application plural
@refVia applications via:aws_application_third_party_vulnerabilities;aws_applications
@refVia applications via:gcp_application_third_party_vulnerabilities;gcp_applications
@ref owners to:PersonOrOrganization plural
@refVia owners via:aws_application_third_party_vulnerabilities;aws_applications;people
@refVia owners via:aws_application_third_party_vulnerabilities;aws_applications;organizations
@refVia owners via:gcp_application_third_party_vulnerabilities;gcp_applications;people
@refVia owners via:gcp_application_third_party_vulnerabilities;gcp_applications;organizations
$$;

create type polymorphic.zero_implementation as (
  id int,
  name text
);


comment on type polymorphic.zero_implementation is $$
@interface mode:union
@name ZeroImplementation
@behavior node
$$;

create table polymorphic.relational_item_relations (
  id serial primary key,
  parent_id int not null references polymorphic.relational_items on delete cascade,
  child_id int not null references polymorphic.relational_items on delete cascade,
  constraint relational_item_relations_parent_chilk_ak unique (parent_id, child_id)
);

create index on polymorphic.relational_item_relations (parent_id);
create index on polymorphic.relational_item_relations (child_id);

create table polymorphic.relational_item_relation_composite_pks (
  parent_id int not null references polymorphic.relational_items on delete cascade,
  child_id int not null references polymorphic.relational_items on delete cascade,
  primary key (parent_id, child_id)
);

create index on polymorphic.relational_item_relation_composite_pks (child_id);


--------------------------------------------------------------------------------

create schema js_reserved;
/*

Reserved keywords should be safe to use in a non-polymorphic schema

Object.getOwnPropertyNames(Object.prototype)
["toString","toLocaleString","valueOf","hasOwnProperty",
"isPrototypeOf","propertyIsEnumerable","__defineGetter__",
"__defineSetter__","__lookupGetter__","__lookupSetter__",
"__proto__","constructor"]

Also see utils/tamedevil/src/reservedWords.ts - top section
*/

create table js_reserved.building (
  id serial primary key,
  name text,
  constructor text unique
);

create table js_reserved.machine (
  id serial primary key,
  input text,
  constructor text references js_reserved.building(constructor)
);

create type js_reserved.item_type as enum (
  'TOPIC',
  'STATUS'
);

create table js_reserved.relational_items (
  id serial primary key,

  -- This column is used to tell us which table we need to join to
  type js_reserved.item_type not null default 'STATUS'::js_reserved.item_type,

  -- Shared attributes
  constructor text references js_reserved.building (constructor)
);

create table js_reserved.relational_topics (
  id int primary key references js_reserved.relational_items,
  title text not null
);

create table js_reserved.relational_status (
  id int primary key references js_reserved.relational_items,
  description text default '-- Enter description here --',
  note text
);

comment on table js_reserved.relational_items is $$
  @interface mode:relational type:type
  @type TOPIC references:relational_topics
  @type STATUS references:relational_status
  $$;

create table js_reserved.project (
  id serial primary key,
  brand text,
  __proto__ text unique
);

create table js_reserved.crop (
  id serial primary key,
  yield text unique,
  amount int
);

create table js_reserved.material (
  id serial primary key,
  class text unique,
  "valueOf" text unique
);

create table js_reserved.constructor (
  id serial primary key,
  name text unique,
  export text unique
);

create table js_reserved.yield (
  id serial primary key,
  crop text,
  export text unique
);

create table js_reserved.__proto__ (
  id serial primary key,
  name text unique,
  brand text
);

create table js_reserved.null (
  id serial primary key,
  "hasOwnProperty" text unique,
  break text unique
);

create table js_reserved.reserved (
  id serial primary key,
  "null" text unique,
  "case" text unique,
  "do" text unique
);

create function js_reserved.await(yield int, __proto__ int, constructor int, "hasOwnProperty" int) returns int as $$
  select yield + __proto__ + constructor + "hasOwnProperty";
$$ language sql stable;

create function js_reserved.case(yield int, __proto__ int, constructor int, "hasOwnProperty" int) returns int as $$
  select yield + __proto__ + constructor + "hasOwnProperty";
$$ language sql stable;

create function js_reserved."valueOf"(yield int, __proto__ int, constructor int, "hasOwnProperty" int) returns int as $$
  select yield + __proto__ + constructor + "hasOwnProperty";
$$ language sql stable;

create function js_reserved.null_yield(n js_reserved.null, yield int, __proto__ int, constructor int, "valueOf" int) returns int as $$
  select yield + __proto__ + constructor + "valueOf";
$$ language sql stable;

/* This function should never appear in the schema */
create function js_reserved.__proto__(yield int, constructor int) returns int as $$
  select yield + constructor;
$$ language sql stable;

--------------------------------------------------------------------------------

create schema partitions;

create table partitions.users (
  id serial primary key,
  name text not null
);

create table partitions.measurements (
  timestamp timestamptz not null,
  key text,
  value float,
  user_id int not null references partitions.users,
  primary key (timestamp, key)
) partition by range (timestamp);
create index on partitions.measurements (timestamp);
create table partitions.measurements_y2022 partition of partitions.measurements for values from ('2022-01-01T00:00:00Z') to ('2023-01-01T00:00:00Z');
create table partitions.measurements_y2023 partition of partitions.measurements for values from ('2023-01-01T00:00:00Z') to ('2024-01-01T00:00:00Z');
create table partitions.measurements_y2024 partition of partitions.measurements for values from ('2024-01-01T00:00:00Z') to ('2025-01-01T00:00:00Z');

--------------------------------------------------------------------------------

create schema nested_arrays;

-- Code based on code from https://github.com/graphile/postgraphile/issues/1722

create type nested_arrays.work_hour_parts as (
  from_hours   smallint,
  from_minutes smallint,
  to_hours     smallint,
  to_minutes   smallint
);

create domain nested_arrays.work_hour as nested_arrays.work_hour_parts
  not null check (
    (VALUE).from_hours < 24 AND (VALUE).from_minutes < 60 AND
    ((VALUE).to_hours < 24 AND (VALUE).to_minutes < 60 OR
     (VALUE).to_hours = 24 AND (VALUE).to_minutes = 0) AND
    (VALUE).from_hours >= 0 AND (VALUE).from_minutes >= 0 AND (VALUE).to_hours >= 0 AND
    (VALUE).to_minutes >= 0 AND
    ((VALUE).from_hours < (VALUE).to_hours OR (VALUE).from_minutes < (VALUE).to_minutes)
  );

create or replace function nested_arrays.check_work_hours(wh nested_arrays.work_hour[]) returns bool as $body$
declare
    prev    nested_arrays.work_hour_parts;
    current nested_arrays.work_hour_parts;
begin
    foreach current in array wh
        loop
            if (prev is null) then
                prev := current;
            else
                if current.from_hours < prev.to_hours or
                   (current.from_hours = prev.to_hours and current.from_minutes <= prev.to_minutes) then
                    return false;
                end if;
            end if;
        end loop;
    return true;
end;
$body$ language plpgsql strict immutable;

create domain nested_arrays.workhours as nested_arrays.work_hour[] not null check (nested_arrays.check_work_hours(value::nested_arrays.work_hour[]));

create domain nested_arrays.working_hours as nested_arrays.workhours[] check (cardinality(value) = 8);

comment on domain nested_arrays.working_hours is 'Mo, Tu, We, Th, Fr, Sa, Su, Ho';

create table nested_arrays.t (
  k serial primary key,
  v nested_arrays.working_hours
);

--------------------------------------------------------------------------------

create schema composite_domains;
create type composite_domains._user_update_line_node_type as enum ('TEXT', 'MENTION');

create domain composite_domains.user_update_line_node_type as composite_domains._user_update_line_node_type not null;

create domain composite_domains.line_node_text as text not null;

create type composite_domains.base_user_update_content_line_node as (
  line_node_type composite_domains.user_update_line_node_type,
  line_node_text composite_domains.line_node_text
);

create domain composite_domains.user_update_content_line_node as composite_domains.base_user_update_content_line_node not null;

create domain composite_domains.user_update_content_line as composite_domains.user_update_content_line_node[] not null;

create type composite_domains.base_user_update_content as (
  lines composite_domains.user_update_content_line[],
  img_url text
);

create domain composite_domains.user_update_content as composite_domains.base_user_update_content not null
check ((
  (
    case
      when ((value).lines is null) then 0
      else 1
    end +
    case
      when ((value).img_url is null) then 0
      else 1
    end
  ) > 0
));

create table composite_domains.posts (
  id integer primary key generated by default as identity,
  user_id integer not null,
  content composite_domains.user_update_content not null,
  thread_content composite_domains.user_update_content[],
  created_at timestamp with time zone DEFAULT now() not null
);

--------------------------------------------------------------------------------

create schema refs;

create table refs.people (
  id serial primary key,
  name text not null
);

create table refs.posts (
  id serial primary key,
  user_id int not null,
  constraint fk_posts_author foreign key (user_id) references refs.people
);

comment on constraint fk_posts_author on refs.posts is E'@omit';
comment on column refs.posts.user_id is E'@omit';
comment on table refs.posts is $$
@ref author via:(user_id)->people(id) singular
$$;

--------------------------------------------------------------------------------

-- From https://github.com/graphile/crystal/issues/1987
create schema space;

CREATE TYPE space.pad_type AS ENUM('MOBILE', 'STATIC', 'TEMPORARY');
CREATE TYPE space.launch_pad AS (id BIGINT, type space.pad_type);

-- DROP TABLE IF EXISTS space.mobile_pad;
CREATE TABLE space.mobile_pad (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    time_to_reach_in_hours NUMERIC DEFAULT 10
);

-- DROP TABLE IF EXISTS space.static_pad;
CREATE TABLE space.static_pad (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    time_to_reach_in_hours NUMERIC DEFAULT 5
);

-- DROP TABLE IF EXISTS space.temp_pad;
create TABLE space.temp_pad (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    time_to_reach_in_hours NUMERIC DEFAULT 15
);

-- DROP TABLE IF EXISTS space.spacecraft;
CREATE TABLE IF NOT EXISTS space.spacecraft (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    return_to_earth TSRANGE NOT NULL
);


-- DROP FUNCTION space.spacecraft_eta;
CREATE OR REPLACE FUNCTION space.spacecraft_eta(
    spacecraft space.spacecraft,
    "to" space.launch_pad
) RETURNS TSRANGE LANGUAGE plpgsql STABLE
AS $$
BEGIN
    RETURN $1.return_to_earth;
END $$;

--------------------------------------------------------------------------------

create schema issue_2210;

create table issue_2210.test_user (
  id uuid primary key
, name varchar
, created_at timestamptz default now()
);

create table issue_2210.test_message (
  id uuid primary key
, test_chat_id uuid
, test_user_id uuid references issue_2210.test_user (id)
, message text
, created_at timestamptz
);
create index test_message_test_user_id_idx on issue_2210.test_message(test_user_id);

create function issue_2210.some_messages (test_chat_id uuid) returns setof issue_2210.test_message as $$
  select m.*
  from issue_2210.test_message m
  where m.test_chat_id = $1
  order by created_at desc;
$$ language sql stable;

comment on table issue_2210.test_message is E'@behaviour -connection';
comment on function issue_2210.some_messages(uuid) is E'@behaviour +connection';

--------------------------------------------------------------------------------

create schema relay;

create table relay.users (
  id serial primary key,
  username text not null
);

create table relay.spectacles (
  id serial primary key,
  -- manufacturer int not null references relay.manufacturers,
  model_number text not null
);

create table relay.distances (
  id serial primary key,
  user_id int not null references relay.users,
  spectacle_id int null references relay.spectacles,
  max_distance float not null
  -- unique NULLS NOT DISTINCT (user_id, spectacle_id)
);
create unique index on relay.distances (user_id, coalesce(spectacle_id, -1));

create function relay.users_max_reading_distance(u relay.users, with_spectacles relay.spectacles) returns float as $$
  select max_distance
  from relay.distances
  where user_id = u.id
  and spectacle_id is not distinct from with_spectacles.id;
$$ language sql stable;

comment on function relay.users_max_reading_distance is
  E'Reading distance in metres with the given pair of spectacles (or specify null for no spectacles). If null then that combination hasn''t been measured.';
