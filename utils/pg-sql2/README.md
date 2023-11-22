# pg-sql2

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Patreon sponsor button](https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg)](https://patreon.com/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

Create highly dynamic SQL in a powerful and flexible manner without opening
yourself to SQL injection attacks.

A key aim of this library is to be very fast, if you think you can improve
performance further please open a PR!

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably, we ask all individuals and
businesses that use it to help support its ongoing maintenance and development
via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
<td align="center"><a href="https://dovetailapp.com/"><img src="https://graphile.org/images/sponsors/dovetail.png" width="90" height="90" alt="Dovetail" /><br />Dovetail</a> *</td>
<td align="center"><a href="https://www.netflix.com/"><img src="https://graphile.org/images/sponsors/Netflix.png" width="90" height="90" alt="Netflix" /><br />Netflix</a> *</td>
<td align="center"><a href="https://stellate.co/"><img src="https://graphile.org/images/sponsors/Stellate.png" width="90" height="90" alt="Stellate" /><br />Stellate</a> *</td>
</tr><tr>
<td align="center"><a href="https://www.accenture.com/"><img src="https://graphile.org/images/sponsors/accenture.svg" width="90" height="90" alt="Accenture" /><br />Accenture</a> *</td>
<td align="center"><a href="https://microteam.io/"><img src="https://graphile.org/images/sponsors/micro.png" width="90" height="90" alt="We Love Micro" /><br />We Love Micro</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

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

## API

### `` sql`...` ``

Builds part of (or the whole of) an SQL query, safely interpreting the embedded
expressions. If a non `sql` expression is passed in, e.g.:

<!-- skip-example -->

```js
sql`select ${1}`;
```

then an error will be thrown. This prevents SQL injection, as all values must go
through an allowed API.

### `sql.identifier(ident, ...)`

Represents a safely escaped SQL identifier; if multiple arguments are passed
then each will be escaped and then they will be joined with dots (e.g.
`"schema"."table"."column"`).

### `sql.value(val)`

Represents an SQL value, will be replaced with a placeholder and the value
collected up at compile time.

### `sql.literal(val)`

As `sql.value`, but in the case of very simple values may write them directly to
the SQL statement rather than using a placeholder. Should only be used with data
that is not sensitive and is trusted (not user-provided data), e.g. for the key
arguments to `json_build_object(key, val, key, val, ...)` which you have
produced.

### `sql.join(arrayOfFragments, delimiter)`

Joins an array of `sql` values using the delimiter (which is treated as a raw
SQL string); e.g.

```js
const arrayOfSqlFields = ["a", "b", "c", "d"].map((n) => sql.identifier(n));
sql`select ${sql.join(arrayOfSqlFields, ", ")}`; // -> select "a", "b", "c", "d"

const arrayOfSqlConditions = [sql`a = 1`, sql`b = 2`, sql`c = 3`];
sql`where (${sql.join(arrayOfSqlConditions, ") and (")})`; // -> where (a = 1) and (b = 2) and (c = 3)

const fragments = [
  { alias: "name", sqlFragment: sql.identifier("user", "name") },
  { alias: "age", sqlFragment: sql.identifier("user", "age") },
];
sql`
  json_build_object(
    ${sql.join(
      fragments.map(
        ({ sqlFragment, alias }) => sql`${sql.literal(alias)}, ${sqlFragment}`,
      ),
      ",\n",
    )}
  )`;

const arrayOfSqlInnerJoins = [
  sql`inner join bar on (bar.foo_id = foo.id)`,
  sql`inner join baz on (baz.bar_id = bar.id)`,
];
sql`select * from foo ${sql.join(arrayOfSqlInnerJoins, " ")}`;
// select * from foo inner join bar on (bar.foo_id = foo.id) inner join baz on (baz.bar_id = bar.id)
```

### `sql.compile(query)`

Compiles the query into an SQL statement and a list of values, ready to be
executed

```js
const query = sql`...`;
const { text, values } = sql.compile(query);

// const { rows } = await pg.query(text, values);
```

### `sql.compile(query, options)`

An advanced form of `sql.compile` that can be used to provide the placeholders
when you're using `sql.placeholder`.

## History

This is a replacement for
[@calebmer's `pg-sql`](https://www.npmjs.com/package/pg-sql), combining the
additional work that was done to it
[in postgraphql](https://github.com/postgraphql/postgraphql/blob/9c36d7e9b9ad74e665de18964fd2554f9f639903/src/postgres/utils/sql.ts)
and offering the following enhancements:

- Better development experience for people not using TypeScript (throws errors a
  lot earlier allowing you to catch issues at the source)
- Slightly more helpful error messages
- Uses a symbol-key on the query nodes to protect against an object accidentally
  being inserted verbatim and being treated as valid (because every Symbol is
  unique an attacker would need control of the code to get a reference to the
  Symbol in order to set it on an object (it cannot be serialised/deserialised
  via JSON or any other medium), and if the attacker has control of the code
  then you've already lost)
- Adds `sql.literal` which is similar to `sql.value` but when used with simple
  values can write the valid direct to the SQL statement. **USE WITH CAUTION**.
  The purpose for this is if you are using _trusted_ values (e.g. for the keys
  to
  [`json_build_object(...)`](https://www.postgresql.org/docs/9.6/static/functions-json.html))
  then debugging your SQL becomes a lot easier because fewer placeholders are
  used.
