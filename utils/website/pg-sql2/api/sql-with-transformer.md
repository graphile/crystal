---
sidebar_position: 7
title: "sql.withTransformer()"
---

# `sql.withTransformer(transformer, callback)`

Sometimes you may want to embed non-SQL values into your SQL fragments and have
them work automatically. By default we'll throw an error when we see non-SQL
values, however by using "transformers" you can have dictate how (and if)
unknown values should be coerced to SQL.

In this example, we tell the system that if it sees a `number` value then it
can automatically embed it using `sql.value(n)`. Note that it also updates the
types of `sql` to allow for numbers to be embedded (which would normally be
forbidden by TypeScript).

```ts
import sql, { type Transformer } from "pg-sql2";

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

const stmt = sql.withTransformer(
  numberToValue,
  (sql) => sql`select * from users where id = ${42}`,
);
```
