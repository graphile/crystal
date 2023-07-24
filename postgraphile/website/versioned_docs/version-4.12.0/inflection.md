---
layout: page
path: /postgraphile/inflection/
title: Inflection
---

In PostGraphile, we have the concept of "inflection" which details how things in
PostgreSQL are named in the generated GraphQL schema.

The default inflections in PostGraphile attempts to map things to natural names
in GraphQL whilst attempting to avoid naming conflicts. For example:

- Table names are singularised and changed to UpperCamelCase: `pending_users` →
  `PendingUser`
- Column names are changed to camelCase: `created_at` → `createdAt`
- Relations reference the target type and the referencing columns:
  `postsByAuthorId` (see "advice" below about making this shorter!)

### Overriding Naming - One-off

If you want to rename just one field or type, your best bet is to use a
[smart comment](./smart-comments/); e.g. for a table you might do:

```sql
COMMENT ON TABLE post IS E'@name message';
```

NOTE: this still uses the inflectors, but it pretends that the tables name is
different, so the input to the inflectors differs.

### Overriding Inflection - General

It's possible to override individual inflectors with a plugin. Doing so is
documented in the
[`makeAddInflectorsPlugin` article](./make-add-inflectors-plugin/).

An example plugin looks something like this:

```js {2-4}
module.exports = makeAddInflectorsPlugin(
  {
    patchType(typeName: string) {
      return this.upperCamelCase(`${typeName}-change-set`);
    },
  },
  true
);
```

See there also for
[which inflectors to overwrite](./make-add-inflectors-plugin/#where-are-the-default-inflectors-defined).

### Advice

The relation field names are quite explicit to avoid accidental conflicts, and
can make your schema quite verbose, e.g. `userByAuthorId`, `userByEditorId`,
`userByPublisherId`, etc.

Some people like this verbosity, however if you prefer shorter names we
encourage you use
[the `@graphile-contrib/pg-simplify-inflector` plugin](https://github.com/graphile-contrib/pg-simplify-inflector).
This would automatically change those fields to be named `author`, `editor` and
`publisher` respectively.

```
postgraphile --append-plugins @graphile-contrib/pg-simplify-inflector
```

I, Benjie, prefer to use the pg-simplify-inflector in all my projects.
