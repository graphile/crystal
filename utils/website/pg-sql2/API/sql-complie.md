---
sidebar_position: 6
title: "sql.compile()"
---

# `sql.compile(query)`

Compiles the query into an SQL statement and a list of values, ready to be executed

```js
const query = sql`...`;
const { text, values } = sql.compile(query);

// const { rows } = await pg.query(text, values);
```

## `sql.compile(query, options)`

An advanced form of `sql.compile` that can be used to provide the placeholders
when you're using `sql.placeholder`.
