import expect from 'expect'
import pg from 'pg'
import { PG_CONFIG } from '../helpers.js'
import getCatalog from '#/postgres/getCatalog.js'

const PG_SCHEMA = `
drop schema if exists a cascade;
drop schema if exists b cascade;
drop schema if exists c cascade;

create schema a;
create schema b;
create schema c;

comment on schema a is 'The a schema.';
comment on schema b is 'qwerty';

create table c.person (
  id serial primary key,
  name varchar not null,
  about text
);

create table c.compound_key (
  person_id_2 int references c.person(id),
  person_id_1 int references c.person(id),
  primary key (person_id_1, person_id_2)
);

create table a.foreign_key (
  person_id int references c.person(id),
  compound_key_1 int,
  compound_key_2 int,
  foreign key (compound_key_1, compound_key_2) references c.compound_key(person_id_1, person_id_2)
);

comment on table c.person is 'Person test comment';
comment on column c.person.name is 'The person’s name';

create table a.hello (
  z_some int default 42,
  world int,
  moon int not null,
  abc int default 2,
  yoyo int
);

comment on column a.hello.world is 'Hello, world!';

create view b.yo as
  select
    world,
    moon,
    2 as constant
  from
    a.hello;

comment on view b.yo is 'YOYOYO!!';
comment on column b.yo.constant is 'This is constantly 2';

create type a.letter as enum ('a', 'b', 'c', 'd');
create type b.color as enum ('red', 'green', 'blue');

create table a.types (
  "bigint" bigint,
  "boolean" boolean,
  "varchar" varchar,
  "enum" b.color
);

create function a.add1(int, int) returns int as $$ select $1 + $2 $$ language sql immutable;
create function a.add2(a int, b int) returns int as $$ select $1 + $2 $$ language sql stable;
create function a.add3(c int, int) returns int as $$ select $1 + $2 $$ language sql volatile;
create function a.add4(int, d int) returns int as $$ select $1 + $2 $$ language sql;

create function b.mult1(int, int) returns int as $$ select $1 * $2 $$ language sql;
create function b.mult2(int, int) returns int as $$ select $1 * $2 $$ language sql called on null input;
create function b.mult3(int, int) returns int as $$ select $1 * $2 $$ language sql returns null on null input;
create function b.mult4(int, int) returns int as $$ select $1 * $2 $$ language sql strict;

create function c.types(bigint, boolean, varchar) returns boolean as $$ select false $$ language sql;

create function a.set() returns setof c.person as $$ select * from c.person $$ language sql;
`

describe('getCatalog', () => {
  // Because catalog is not mutated in these tests, we cache it.
  let catalog = null

  before(async () => {
    const client = await pg.connectAsync(PG_CONFIG)
    await client.queryAsync(PG_SCHEMA)
    client.end()
    catalog = await getCatalog(PG_CONFIG)
  })

  it('gets schemas', () => {
    expect(catalog.getSchema('a')).toExist()
    expect(catalog.getSchema('b')).toExist()
    expect(catalog.getSchema('c')).toExist()
  })

  it('gets schema description', () => {
    expect(catalog.getSchema('a').description).toEqual('The a schema.')
    expect(catalog.getSchema('b').description).toEqual('qwerty')
    expect(catalog.getSchema('c').description).toNotExist()
  })

  it('gets tables', () => {
    expect(catalog.getTable('c', 'person')).toExist()
    expect(catalog.getTable('a', 'hello')).toExist()
  })

  it('gets table description', () => {
    expect(catalog.getTable('c', 'person').description).toEqual('Person test comment')
    expect(catalog.getTable('a', 'hello').description).toNotExist()
    expect(catalog.getTable('b', 'yo').description).toEqual('YOYOYO!!')
  })

  it('gets views', () => {
    expect(catalog.getTable('b', 'yo')).toExist()
  })

  it('gets columns', () => {
    expect(catalog.getColumn('c', 'person', 'id')).toExist()
    expect(catalog.getColumn('c', 'person', 'name')).toExist()
    expect(catalog.getColumn('c', 'person', 'about')).toExist()
    expect(catalog.getColumn('a', 'hello', 'world')).toExist()
    expect(catalog.getColumn('a', 'hello', 'moon')).toExist()
  })

  it('gets columns in definition order', () => {
    expect(catalog.getTable('a', 'hello').columns.map(({ name }) => name))
    .toEqual(['z_some', 'world', 'moon', 'abc', 'yoyo'])
  })

  it('gets columns for views', () => {
    expect(catalog.getColumn('b', 'yo', 'world')).toExist()
    expect(catalog.getColumn('b', 'yo', 'moon')).toExist()
    expect(catalog.getColumn('b', 'yo', 'constant')).toExist()
  })

  it('gets column nullability', () => {
    expect(catalog.getColumn('c', 'person', 'id').isNullable).toEqual(false)
    expect(catalog.getColumn('c', 'person', 'name').isNullable).toEqual(false)
    expect(catalog.getColumn('c', 'person', 'about').isNullable).toEqual(true)
    expect(catalog.getColumn('a', 'hello', 'world').isNullable).toEqual(true)
    expect(catalog.getColumn('a', 'hello', 'moon').isNullable).toEqual(false)
    expect(catalog.getColumn('b', 'yo', 'world').isNullable).toEqual(true)
    expect(catalog.getColumn('b', 'yo', 'moon').isNullable).toEqual(true)
    expect(catalog.getColumn('b', 'yo', 'constant').isNullable).toEqual(true)
  })

  it('gets column primary key status', () => {
    expect(catalog.getColumn('c', 'person', 'id').isPrimaryKey).toEqual(true)
    expect(catalog.getColumn('c', 'person', 'name').isPrimaryKey).toEqual(false)
    expect(catalog.getColumn('c', 'person', 'about').isPrimaryKey).toEqual(false)
    expect(catalog.getColumn('c', 'compound_key', 'person_id_1').isPrimaryKey).toEqual(true)
    expect(catalog.getColumn('c', 'compound_key', 'person_id_2').isPrimaryKey).toEqual(true)
  })

  it('gets column descriptions', () => {
    expect(catalog.getColumn('c', 'person', 'id').description).toNotExist()
    expect(catalog.getColumn('c', 'person', 'name').description).toEqual('The person’s name')
    expect(catalog.getColumn('c', 'person', 'about').description).toNotExist()
    expect(catalog.getColumn('a', 'hello', 'world').description).toEqual('Hello, world!')
    expect(catalog.getColumn('b', 'yo', 'world').description).toNotExist()
    expect(catalog.getColumn('b', 'yo', 'constant').description).toEqual('This is constantly 2')
  })

  it('gets column types', () => {
    expect(catalog.getColumn('a', 'types', 'bigint').type).toEqual(20)
    expect(catalog.getColumn('a', 'types', 'boolean').type).toEqual(16)
    expect(catalog.getColumn('a', 'types', 'varchar').type).toEqual(1043)
  })

  it('gets enums', () => {
    expect(catalog.getEnum('a', 'letter')).toExist().toInclude({ name: 'letter' })
    expect(catalog.getEnum('b', 'color')).toExist().toInclude({ name: 'color' })
    expect(catalog.getEnum('c', 'does_not_exist')).toNotExist()
  })

  it('gets enum variants', () => {
    expect(catalog.getEnum('a', 'letter').variants).toEqual(['a', 'b', 'c', 'd'])
    expect(catalog.getEnum('b', 'color').variants).toEqual(['red', 'green', 'blue'])
  })

  it('will let a column get its enum type', () => {
    expect(catalog.getColumn('a', 'types', 'enum').getEnum()).toInclude({
      name: 'color',
      variants: ['red', 'green', 'blue'],
    })
  })

  it('will get foreign keys', () => {
    const simplifyForeignKey = ({ nativeTable, nativeColumns, foreignTable, foreignColumns }) => ({
      nativeTable: nativeTable.name,
      nativeColumns: nativeColumns.map(({ name }) => name),
      foreignTable: foreignTable.name,
      foreignColumns: foreignColumns.map(({ name }) => name),
    })

    expect(catalog.getTable('c', 'compound_key').getForeignKeys().map(simplifyForeignKey)).toEqual([
      {
        nativeTable: 'compound_key',
        nativeColumns: ['person_id_2'],
        foreignTable: 'person',
        foreignColumns: ['id'],
      },
      {
        nativeTable: 'compound_key',
        nativeColumns: ['person_id_1'],
        foreignTable: 'person',
        foreignColumns: ['id'],
      },
    ])
    expect(catalog.getTable('a', 'foreign_key').getForeignKeys().map(simplifyForeignKey)).toEqual([
      {
        nativeTable: 'foreign_key',
        nativeColumns: ['person_id'],
        foreignTable: 'person',
        foreignColumns: ['id'],
      },
      {
        nativeTable: 'foreign_key',
        nativeColumns: ['compound_key_1', 'compound_key_2'],
        foreignTable: 'compound_key',
        foreignColumns: ['person_id_1', 'person_id_2'],
      },
    ])
  })

  it('will get if a column has a default', () => {
    expect(catalog.getColumn('c', 'person', 'id').hasDefault).toBe(true)
    expect(catalog.getColumn('c', 'person', 'name').hasDefault).toBe(false)
    expect(catalog.getColumn('c', 'person', 'about').hasDefault).toBe(false)
    expect(catalog.getColumn('a', 'hello', 'z_some').hasDefault).toBe(true)
    expect(catalog.getColumn('a', 'hello', 'abc').hasDefault).toBe(true)
    expect(catalog.getColumn('a', 'hello', 'world').hasDefault).toBe(false)
    expect(catalog.getColumn('a', 'hello', 'moon').hasDefault).toBe(false)
  })

  it('will get procedures', () => {
    expect(catalog.getProcedure('a', 'add1')).toExist()
    expect(catalog.getProcedure('b', 'add1')).toNotExist()
  })

  it('will get a procedure’s mutation status', () => {
    expect(catalog.getProcedure('a', 'add1').isMutation).toBe(false)
    expect(catalog.getProcedure('a', 'add2').isMutation).toBe(false)
    expect(catalog.getProcedure('a', 'add3').isMutation).toBe(true)
    expect(catalog.getProcedure('a', 'add4').isMutation).toBe(true)
  })

  it('will get if a procedure is strict', () => {
    expect(catalog.getProcedure('b', 'mult1').isStrict).toBe(false)
    expect(catalog.getProcedure('b', 'mult2').isStrict).toBe(false)
    expect(catalog.getProcedure('b', 'mult3').isStrict).toBe(true)
    expect(catalog.getProcedure('b', 'mult4').isStrict).toBe(true)
  })

  it('will correctly get argument names', () => {
    expect(catalog.getProcedure('a', 'add1').argNames).toEqual(['arg1', 'arg2'])
    expect(catalog.getProcedure('a', 'add2').argNames).toEqual(['a', 'b'])
    expect(catalog.getProcedure('a', 'add3').argNames).toEqual(['c', 'arg2'])
    expect(catalog.getProcedure('a', 'add4').argNames).toEqual(['arg1', 'd'])
    expect(catalog.getProcedure('a', 'set').argNames).toEqual([])
  })

  it('will correctly get argument types', () => {
    expect(catalog.getProcedure('a', 'add1').argTypes).toEqual([23, 23])
    expect(catalog.getProcedure('b', 'mult1').argTypes).toEqual([23, 23])
    expect(catalog.getProcedure('c', 'types').argTypes).toEqual([20, 16, 1043])
    expect(catalog.getProcedure('a', 'set').argTypes).toEqual([])
  })

  it('will correctly get the return type', () => {
    expect(catalog.getProcedure('a', 'add1').returnType).toEqual(23)
    expect(catalog.getProcedure('c', 'types').returnType).toEqual(16)
  })

  it('will correctly get if a procedure is returning a set', () => {
    expect(catalog.getProcedure('a', 'add1').returnsSet).toBe(false)
    expect(catalog.getProcedure('a', 'set').returnsSet).toBe(true)
  })
})
