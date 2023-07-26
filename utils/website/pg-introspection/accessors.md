---
sidebar_position: 2
---

# Accessors

Into the introspection results we mix "accessor" functions to make following
relationships easier. Note that these functions are typically evaluated lazily -
the first time you call them they may need to do an expensive lookup (e.g.
finding the relevant record from the list of records) but they cache the result
so that the next call will be near-instant.

Examples:

```js
const myTable = introspection.classes.find((rel) => rel.relname === "my_table");
const myTableAttributes = myTable.getAttributes();
const myColumn = myTable.getAttribute({ name: "my_column" });
const myColumnDescription = myColumn.getDescription();
```

You can use the TypeScript autocompletion to see what accessors are available,
or look in the `index.ts` file.
