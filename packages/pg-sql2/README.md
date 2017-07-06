pg-sql2
=======

Create SQL in a powerful and flexible manner without opening yourself to SQL
injection attacks using the power of ES6 tagged template literals.

```js
const sql = require('pg-sql2');
// or import sql from 'pg-sql2';

const tableName = "user";
const fields = ["name", "age", "height"];

// sql.join is used to join fragments with a common separator, NOT to join tables!
const sqlFields = sql.join(
  // sql.identifier safely escapes arguments and joins them with dots
  fields.map(fieldName => sql.identifier(tableName, fieldName)),
  ", "
);

// sql.value will store the value and instead add a placeholder to the SQL
// statement, to ensure that no SQL injection can occur.
const sqlConditions =
  sql.query`created_at > NOW() - interval '3 years' and age > ${sql.value(22)}`;

// This could be a full query, but we're going to embed it in another query safely
const innerQuery =
  sql.query`select ${sqlFields} from ${sql.identifier(tableName)} where ${sqlConditions}`;

// Symbols are automatically assigned unique identifiers
const sqlAlias = sql.identifier(Symbol());

const query = sql.query`
with ${sqlAlias} as (${innerQuery})
select
  (select json_agg(row_to_json(${sqlAlias})) from ${sqlAlias}) as all_data,
  (select max(age) from ${sqlAlias}) as max_age
`;

// sql.compile compiles the query into an SQL statement and a list of values
const { text, values } = sql.compile(query);

console.log(text);
/* ->
with __local_0__ as (select "user"."name", "user"."age", "user"."height" from "user" where created_at > NOW() - interval '3 years' and age > $1)
select
  (select json_agg(row_to_json(__local_0__)) from __local_0__) as all_data,
  (select max(age) from __local_0__) as max_age
*/

console.log(values); // [ 22 ]

// Then to run the query using `pg` module, do something like:
// const { rows } = await pg.query(text, values);
```

API
---

### ``sql.query`...` ``

Builds part of (or the whole of) an SQL query, safely interpretting the embedded expressions. If a non `sql.*` expression is passed in, e.g.:

```js
sql.query`select ${1}`
```

then an error will be thrown (immediately on development, at `sql.compile` time on production for performance).

### `sql.identifier(ident, ...)`

Represents a safely escaped SQL identifier; if multiple arguments are passed then each will be escaped and then they will be joined with dots (e.g. `"schema"."table"."column"`).

### `sql.value(val)`

Represents an SQL value, will be replaced with a placeholder and the value collected up at compile time.

### `sql.literal(val)`

As sql.value, but in the case of very simple values may write them directly to the SQL statement. Should only be used with trusted data, e.g. for the key arguments to `json_build_object(key, val, key, val, ...)`

### `sql.join(arrayOfFragments, delimeter)`

Joins an array of sql.query values using the delimeter (which is treated as a raw SQL string); e.g.

```js
const arrayOfSqlFields = ['a', 'b', 'c', 'd'].map(n => sql.identifier(n));
sql.query`select ${sql.join(arrayOfSqlFields, ', ')}` // -> select "a", "b", "c", "d"

const arrayOfSqlConditions = [sql.query`a = 1`, sql.query`b = 2`, sql.query`c = 3`];
sql.query`where (${sql.join(arrayOfSqlConditions, ') and (')})` // -> where (a = 1) and (b = 2) and (c = 3)

const fragments = [
  {alias: 'name', sqlFragment: sql.identifier('user', 'name')},
  {alias: 'age', sqlFragment: sql.identifier('user', 'age')},
];
sql.query`
  json_build_object(
    ${sql.join(
      fragments.map(
        ({ sqlFragment, alias }) =>
          sql.query`${sql.literal(alias)}, ${sqlFragment}`
      ),
      ",\n"
    )}
  )`;

const arrayOfSqlInnerJoins = [
  sql.query`inner join bar on (bar.foo_id = foo.id)`,
  sql.query`inner join baz on (baz.bar_id = bar.id)`,
];
sql.query`select * from foo ${sql.join(arrayOfSqlInnerJoins, " ")}`
// select * from foo inner join bar on (bar.foo_id = foo.id) inner join baz on (baz.bar_id = bar.id)
```

### `sql.raw(stringValue)`

**DO NOT USE THIS**; honestly outside of the internals I don't think there is any need for this - use `sql.query` instead.

### `sql.compile(query)`

Compiles the query into an SQL statement and a list of values, ready to be executed

```js
const query = sql.query`...`;
const { text, values } = sql.compile(query);

// const { rows } = await pg.query(text, values);
```

History
-------

This is a replacement for [@calebmer's
`pg-sql`](https://www.npmjs.com/package/pg-sql), combining the additional work
that was done to it [in
postgraphql](https://github.com/postgraphql/postgraphql/blob/9c36d7e9b9ad74e665de18964fd2554f9f639903/src/postgres/utils/sql.ts)
and offering the following enhancements:

- Better development experience for people not using TypeScript (throws errors
  a lot earlier in development\*, allowing you to catch issues at the source)
- Slightly more helpful error messages
- Uses a hidden non-enumerable symbol as the type of the query nodes to protect
  against an object accidentally being inserted verbatim and being treated as
  valid
- Adds `sql.literal` which is similar to `sql.value` but when used with simple
  values can write the valid direct to the SQL statement. **USE WITH CAUTION**.
  The purpose for this is if you are using *trusted* values (e.g. for the keys
  to
  [`json_build_object(...)`](https://www.postgresql.org/docs/9.6/static/functions-json.html))
  then debugging your SQL becomes a lot easier because fewer placeholders are
  used.


---

\* Development mode is when `process.env.NODE_ENV` is either `development` or `test`
