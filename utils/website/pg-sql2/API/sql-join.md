---
sidebar_position: 5
title: "sql.join()"
---

# `sql.join(arrayOfFragments, delimiter)`

Joins an array of `sql` values using the delimiter (which is treated as a raw SQL string); e.g.

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
