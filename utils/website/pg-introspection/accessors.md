---
sidebar_position: 2
---

# Accessors

Navigation helpers make following catalog relationships easier. Augmentation
builds indexes for looking up related objects; some derived values are computed
lazily and cached for subsequent calls.

Examples:

```js
const myTable = introspection.classes.find((rel) => rel.relname === "my_table");
if (!myTable) {
  throw new Error("Table my_table was not found");
}
const myTableAttributes = myTable.getAttributes();
const myColumn = myTable.getAttribute({ name: "my_column" });
const myColumnDescription = myColumn?.getDescription();
```

Use your editor's TypeScript autocompletion to discover the available accessors.
Lookups for individual objects return `undefined` when no matching object was
fetched and retained.

`introspect` adds these helpers automatically. For data from `introspectRaw`,
call `augmentIntrospectionData` first, as described in [Usage](./index.md).

Helpers require their corresponding collections. For example,
`table.getAttributes()` throws if `attributes` was omitted from `onlyEntities`.
In [multipass introspection](./multipass.md), helpers navigate only the data
fetched and retained by the configured policies and filters. A table's
constraints therefore contain only the discovered constraints, not necessarily
every constraint in the database.
