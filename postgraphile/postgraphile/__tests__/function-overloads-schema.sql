-- Test overloaded computed column functions targeting different tables
drop schema if exists function_overloads, function_overloads_other_schema cascade;

create schema function_overloads;
create schema function_overloads_other_schema;
create table function_overloads.pets (id serial primary key, name text);
create table function_overloads.buildings (id serial primary key, address text);

-- Two overloaded functions in the SAME schema as their target tables
create function function_overloads.code(function_overloads.pets) returns text
  as $$ select 'P' || $1.id::text; $$ language sql stable;
create function function_overloads.code(function_overloads.buildings) returns text
  as $$ select 'B' || $1.id::text; $$ language sql stable;
comment on function function_overloads.code(function_overloads.pets)
  is E'@behavior +typeField -queryField';
comment on function function_overloads.code(function_overloads.buildings)
  is E'@behavior +typeField -queryField';

-- Cross-schema computed column functions (different schema from target tables)
create function function_overloads_other_schema.age(function_overloads.pets) returns int
  as $$ select 42; $$ language sql stable;
create function function_overloads_other_schema.age(function_overloads.buildings) returns int
  as $$ select 99; $$ language sql stable;
comment on function function_overloads_other_schema.age(function_overloads.pets)
  is E'@behavior +typeField -queryField';
comment on function function_overloads_other_schema.age(function_overloads.buildings)
  is E'@behavior +typeField -queryField';
