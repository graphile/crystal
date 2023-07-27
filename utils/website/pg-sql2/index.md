---
sidebar_position: 1
---

# pg-sql2 Introduction

Create highly dynamic SQL in a powerful and flexible manner without opening yourself to SQL injection attacks.

A key aim of this library is to be very fast, if you think you can improve performance further please open a PR!

## Usage

```js
const { default: sql } = require("pg-sql2");
// or import sql from 'pg-sql2';

const tableName = "user";
const fields = ["name", "age", "height"];

// sql.join is used to join fragments with a common separator, NOT to join tables!
const sqlFields = sql.join(
  // sql.identifier safely escapes arguments and joins them with dots
  fields.map((fieldName) => sql.identifier(tableName, fieldName)),
  ", ",
);

// sql.value will store the value and instead add a placeholder to the SQL
// statement, to ensure that no SQL injection can occur.
const sqlConditions = sql`created_at > NOW() - interval '3 years' and age > ${sql.value(
  22,
)}`;

// This could be a full query, but we're going to embed it in another query safely
const innerQuery = sql`select ${sqlFields} from ${sql.identifier(
  tableName,
)} where ${sqlConditions}`;

// Symbols are automatically assigned unique identifiers
const sqlAlias = sql.identifier(Symbol());

const query = sql`
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

## History

This is a replacement for [@calebmer's pg-sql](https://www.npmjs.com/package/pg-sql), combining the additional work that was done to it [in postgraphql](https://github.com/postgraphql/postgraphql/blob/9c36d7e9b9ad74e665de18964fd2554f9f639903/src/postgres/utils/sql.ts) and offering the following enhancements:

- Better development experience for people not using TypeScript (throws errors a lot earlier allowing you to catch issues at the source)
- Slightly more helpful error messages
- Uses a symbol-key on the query nodes to protect against an object accidentally being inserted verbatim and being treated as valid (because every Symbol is unique an attacker would need control of the code to get a reference to the Symbol in order to set it on an object (it cannot be serialised/deserialised via JSON or any other medium), and if the attacker has control of the code then you've already lost)
- Adds `sql.literal` which is similar to `sql.value` but when used with simple values can write the valid direct to the SQL statement. **USE WITH CAUTION**. The purpose for this is if you are using _trusted_ values (e.g. for the keys to [`json_build_object(...)`](https://www.postgresql.org/docs/9.6/static/functions-json.html)) then debugging your SQL becomes a lot easier because fewer placeholders are used.
