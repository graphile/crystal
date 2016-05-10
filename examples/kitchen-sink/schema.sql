begin;

create schema kitchen_sink;

set search_path = kitchen_sink;

create table thing (
  id               serial not null primary key,
  note             text not null
);

create table relation (
  a_thing_id        int not null references thing(id) on delete cascade,
  b_thing_id        int not null references thing(id) on delete cascade,

  primary key (a_thing_id, b_thing_id)
);

create function add(a int, b int) returns int as $$
  select a + b
$$ language sql
immutable
strict;

create function first_thing() returns thing as $$
  select * from thing limit 1
$$ language sql
stable
set search_path from current;

create type http_status as enum (
  'Continue',
  'Ok',
  'Bad Request',
  'I’m a teapot',
  'Internal Server Error'
);

create function http_status_code(status http_status) returns int as $$
  select case
    when status = 'Continue' then 100
    when status = 'Ok' then 200
    when status = 'Bad Request' then 400
    when status = 'I’m a teapot' then 418
    when status = 'Internal Server Error' then 500
    else 0
  end
$$ language sql
stable
strict;

create function things_modulo(modulo int, remainder int) returns setof thing as $$
  select * from thing where id % coalesce(modulo, 2) = coalesce(remainder, 1)
$$ language sql
stable
set search_path from current;

create function thing_display(thing thing) returns text as $$
  select thing.id || ': ' || thing.note || '!'
$$ language sql
stable;

create function thing_b_things(thing) returns setof thing as $$
  select t.* from relation as r left join thing as t on t.id = r.b_thing_id where r.a_thing_id = $1.id
$$ language sql
stable
set search_path from current;

create function notes() returns setof text as $$
  select note from thing
$$ language sql
stable
set search_path from current;

create function thing_add(thing, a int, b int) returns int as $$
  select a + b
$$ language sql
stable
strict;

create function insert_related_nodes(
  note_a text,
  note_b text
) returns relation as $$
declare
  thing_a thing;
  thing_b thing;
  relation relation;
begin
  insert into thing (note) values (note_a) returning * into thing_a;
  insert into thing (note) values (note_b) returning * into thing_b;
  insert into relation (a_thing_id, b_thing_id) values (thing_a.id, thing_b.id) returning * into relation;
  return relation;
end;
$$ language plpgsql
strict
set search_path from current;

insert into thing (note) values
  ('hello'),
  ('world'),
  ('foo'),
  ('bar'),
  ('baz'),
  ('bux'),
  ('qux');

insert into relation (a_thing_id, b_thing_id) values
  (1, 2),
  (1, 3),
  (1, 7),
  (2, 3),
  (3, 4),
  (3, 5),
  (4, 3),
  (7, 1);

commit;
