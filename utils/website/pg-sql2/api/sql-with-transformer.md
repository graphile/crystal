---
sidebar_position: 12
title: "sql.withTransformer()"
---

# `sql.withTransformer(t, cb)`

Sometimes you may want to embed non-SQL values into your SQL fragments and have
them work automatically. By default pg-sql2 throws an error when it sees non-SQL
values, however by using "transformers" you can dictate how (and if) unknown
values should be coerced to SQL.

In this example, we tell the system that if it sees a `number` value then it
can automatically embed it using `sql.value(n)`. Note that it also updates the
types of `sql` to allow for numbers to be embedded (which would normally be
forbidden by TypeScript).

## Syntax

```ts
sql.withTransformer<TNewEmbed, TResult = SQL>(
  transformer: Transformer<TNewEmbed>,
  callback: (sql: PgSQL<TNewEmbed>) => TResult,
): TResult
```

## Return value

Returns the result of the callback, which typically will be an SQL fragment.

## Example

```ts
import { sql, type Transformer, type SQL } from "pg-sql2";

const numberToValue: Transformer<number> = (sql, value) => {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(
        `${value} is not a finite number, so cannot safely be used in the SQL statement.`,
      );
    }
    return sql.value(value);
  } else {
    return value;
  }
};

const query: SQL = sql.withTransformer(
  numberToValue,
  (sql) => sql`select * from users where id = ${42}`,
);
console.log(sql.compile(query).text);
// select * from users where id = $1

const query2: SQL = sql.withTransformer(
  numberToValue,
  (sql) => sql`select * from users where id = ${Infinity}`,
);
console.log(sql.compile(query2).text);
// Error: Infinity is not a finite number, so cannot safely be used in the SQL statement.
```
