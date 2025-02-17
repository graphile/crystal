---
title: Inflection
---

Inflection governs how things are named whilst building your PostGraphile
schema. "Inflection" is the system of naming things; it's composed of a large
set of named functions, and we call each of these inflection functions an
"inflector."

The inflectors that you have available will depend on the plugins and presets
you're using. To get a list of the inflectors available to you, you can use
TypeScript autocompletion, or if you're a sponsor you can install the
`graphile` package and run `yarn graphile inflection list` (or equivalent for
other package managers).

In GraphQL, types typically use singular `UpperCamelCase` (`PascalCase`);
fields, arguments and directives typically use `camelCase`; and enum values
typically use `CONSTANT_CASE`. These conventions can be seen in [the GraphQL
specification itself](https://spec.graphql.org/draft/#example-916f4). The
default inflectors attempt to map things to natural names in GraphQL whilst
avoiding naming conflicts. For example:

- Table names are singularized and changed to UpperCamelCase: `pending_users` →
  `PendingUser`
- Column names are changed to camelCase: `created_at` → `createdAt`
- Relations reference the target type and the referencing columns:
  `postsByAuthorId` (see "advice" below about making this shorter!)

But if you don't want this (or it's doing something wrong), then you can fix it
by overriding inflectors!

### Overriding naming - once

If you want to rename just one field or type, your best bet is to use a
[smart tag](./smart-tags.md); e.g. for a table you might do:

```sql
COMMENT ON TABLE post IS E'@name message';
```

:::note

Each inflector is responsible for checking for any relevant smart tags and
honouring them.

:::

### Overriding inflection

You can easily write a plugin to override an individual inflector, it just
needs to add the new inflector under the `inflection.replace` object; an
example might look like:

```js
export default {
  name: "ReplacePatchTypeInflectorPlugin",
  version: "0.0.0",

  inflection: {
    replace: {
      patchType(previous, resolvedPreset, typeName) {
        return this.upperCamelCase(`${typeName}-change-set`);
      },
    },
  },
};
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

By default, the relation field names are explicit to avoid accidental
conflicts, and can make your schema somewhat verbose, e.g. `userByAuthorId`,
`userByEditorId`, `userByPublisherId`, etc.

Some people like this verbosity; however if you, like us, prefer shorter names
then we encourage you use
[the `@graphile/simplify-inflection` plugin](https://www.npmjs.com/package/@graphile/simplify-inflection).
This would automatically change those fields to be named `author`, `editor` and
`publisher` respectively.

```js title="graphile.config.mjs"
import { PgSimplifyInflectionPreset } from "@graphile/simplify-inflection";

const preset = {
  extends: [
    PgSimplifyInflectionPreset,
    //...
  ],
  //...
};
```

Our maintainer, Benjie, prefers to use this plugin in all his projects.

## Listing available inflectors

We've built a command into our sponsors-only `graphile` development assistant
to help you determine all the inflectors available to you:

```bash npm2yarn
npm install --save-dev graphile@beta
npx graphile inflection list
```

<figure>

![Initial output of the `graphile inflection list` command](./graphile-inflection-list-1.png)

<figcaption>Screenshot showing the initial output of the <code>graphile inflection list</code> command, including a summary of the available inflectors and their arguments.</figcaption>
</figure>

<figure>

![More detailed output from later in the `graphile inflection list` command](./graphile-inflection-list-2.png)

<figcaption>Screenshot from lower down in the output of the <code>graphile inflection list</code> command, detailing each inflector, its documentation and its rough TypeScript definition.</figcaption>
</figure>
