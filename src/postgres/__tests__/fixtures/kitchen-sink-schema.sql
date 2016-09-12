drop schema if exists a cascade;
drop schema if exists b cascade;
drop schema if exists c cascade;

create schema a;
create schema b;
create schema c;

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

create type a.letter as enum ('a', 'b', 'c', 'd');
create type b.color as enum ('red', 'green', 'blue');

create type c.compound_type as (
  a int,
  b text,
  c b.color,
  d uuid
);

comment on type c.compound_type is 'Awesome feature!';

create view b.updatable_view as
  select
    id as __id,
    name,
    about as description,
    2 as constant
  from
    c.person;

comment on view b.updatable_view is 'YOYOYO!!';
comment on column b.updatable_view.constant is 'This is constantly 2';

create view a.no_update as select 2;

-- create table c.compound_key (
--   person_id_2 int references c.person(id),
--   person_id_1 int references c.person(id),
--   primary key (person_id_1, person_id_2)
-- );

-- create table a.foreign_key (
--   person_id int references c.person(id),
--   compound_key_1 int,
--   compound_key_2 int,
--   foreign key (compound_key_1, compound_key_2) references c.compound_key(person_id_1, person_id_2)
-- );

-- create table a.hello (
--   z_some int default 42,
--   world int,
--   moon int not null,
--   abc int default 2,
--   yoyo int
-- );

-- comment on column a.hello.world is 'Hello, world!';

-- create view b.yo as
--   select
--     world,
--     moon,
--     2 as constant
--   from
--     a.hello;

-- create view c.no_update as
--   select
--     (1 + 1) as col1;

-- comment on view b.yo is 'YOYOYO!!';
-- comment on column b.yo.constant is 'This is constantly 2';

-- create domain a.an_int as integer;
-- create domain b.another_int as a.an_int;

-- create table a.types (
--   "bigint" bigint,
--   "boolean" boolean,
--   "varchar" varchar,
--   "enum" b.color,
--   "domain" a.an_int,
--   "domain2" b.another_int
-- );

-- create function a.add_1(int, int) returns int as $$ select $1 + $2 $$ language sql immutable;
-- create function a.add_2(a int, b int) returns int as $$ select $1 + $2 $$ language sql stable;
-- create function a.add_3(a int, int) returns int as $$ select $1 + $2 $$ language sql volatile;
-- create function a.add_4(int, b int) returns int as $$ select $1 + $2 $$ language sql;

-- comment on function a.add_1(int, int) is 'lol, add some stuff';

-- create function b.mult_1(int, int) returns int as $$ select $1 * $2 $$ language sql;
-- create function b.mult_2(int, int) returns int as $$ select $1 * $2 $$ language sql called on null input;
-- create function b.mult_3(int, int) returns int as $$ select $1 * $2 $$ language sql returns null on null input;
-- create function b.mult_4(int, int) returns int as $$ select $1 * $2 $$ language sql strict;

-- create function c.types(a bigint, b boolean, c varchar) returns boolean as $$ select false $$ language sql;

-- create function a.set() returns setof c.person as $$ select * from c.person $$ language sql;

-- create table b.so_unique (
--   id uuid primary key,
--   lucky_number int unique,
--   a text not null,
--   b text not null,
--   unique (a, b)
-- );
