---
layout: page
path: /postgraphile/inflection/
title: Inflection
---

Inflection governs how things are named whilst building your PostGraphile
schema. "Inflection" is the system of naming things; it's composed of a large
set of named functions, and we call each of these inflection functions an
"inflector."

In GraphQL types typically use `PascalCase`; fields, arguments and directives
typically use `camelCase`; and enum values typically use `CONSTANT_CASE`. The
default inflectors attempt to map things to natural names in GraphQL whilst
avoiding naming conflicts. For example:

- Table names are singularized and changed to UpperCamelCase: `pending_users` →
  `PendingUser`
- Column names are changed to camelCase: `created_at` → `createdAt`
- Relations reference the target type and the referencing columns:
  `postsByAuthorId` (see "advice" below about making this shorter!)

### Overriding Naming - One-off

If you want to rename just one field or type, your best bet is to use a
[smart tag](./smart-tags.md); e.g. for a table you might do:

```sql
COMMENT ON TABLE post IS E'@name message';
```

:::note

Each inflector is responsible for checking for any relevant smart tags and
honouring them.

:::

### Overriding Inflection

You can easily write a plugin to override an individual inflector, it just
needs to add the new inflector under the `inflection.replace` object; an
example might look like:

```js
export default {
  name: 'ReplacePatchTypeInflectorPlugin',
  version: '0.0.0',

  inflection: {
    replace: {
      patchType(previous, resolvedPreset, typeName) {
        return this.upperCamelCase(`${typeName}-change-set`);
      },
    }
  }
);
```

In this example, `previous` is the previous inflector (in case you only want to
override in certain circumstances) - you would call it using the same
arguments, just dropping the first two - so in this case: `previous(typeName)`.

:::tip

TypeScript is your friend when replacing inflectors, it should know what
inflectors are available, their documentation, and the types of all their
arguments.

:::

### Advice

The relation field names are explicit to avoid accidental conflicts, and
can make your schema somewhat verbose, e.g. `userByAuthorId`, `userByEditorId`,
`userByPublisherId`, etc.

Some people like this verbosity, however if you prefer shorter names we
encourage you use
[the `@graphile/simplify-inflection` plugin](https://github.com/graphile/simplify-inflection).
This would automatically change those fields to be named `author`, `editor` and
`publisher` respectively.

```
postgraphile --append-plugins @graphile/simplify-inflection
```

I, Benjie, prefer to use this plugin in all my projects.
