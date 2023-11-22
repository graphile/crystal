# @graphile/simplify-inflection

This preset simplifies field names in the PostGraphile schema; e.g. `allUsers`
becomes simply `users`, `User.postsByAuthorId` becomes simply `User.posts`, and
`Post.userByAuthorId` becomes simply `Post.author`.

**Adding this preset to your schema is almost certainly a breaking change, so do
it before you ship anything!**

**This preset is recommended for all PostGraphile users** with a compatible
database schema. The main reason this preset is not enabled by default is
because it increases the risk of conflicts where multiple relationships try and
use the same field name, and because some people name their primary key and
foreign key columns in a way that would cause conflicts. Conflicts can be
avoided by careful use of naming conventions or by specifically tagging the
conflicting relations with their preferred name.

## Incompatible database schemas

This plugin assumes that your primary key and foreign key columns are:

- named `id`, `uuid`, or `pk`; or
- named ending in `_id`, `_uuid`, or `_pk`; or
- named ending in `Id`, `Uuid`, or `Pk`.

If your database schema uses a different naming convention (and particularly if
you name the primary key after the table itself, or the singularized version of
it, with no prefix or suffix) then you are likely to receive a lot of naming
conflicts if you use this plugin. If you are affected by this, this plugin is
probably not for you (but feel free to fork it and make changes to accomodate
your schemas naming conventions); however you may have luck using the
"postgraphile/presets/relay" preset which hides primary key and foreign key
columns throughout the schema, reducing the sources for these conflicts.

## Customising

This preset is just one file, simply copy it into your project and customise it
as you see fit.

Alternatively, you can
[write your own inflection plugin](https://postgraphile.org/postgraphile/next/inflection).

## Changes:

Given these tables:

```sql
create table companies (
  id serial primary key,
  name text not null
);
create table beverages (
  id serial primary key,
  company_id int not null references companies,
  distributor_id int references companies,
  name text not null
);
```

- `Query.allCompanies` 👉 `Query.companies` (disable via
  `pgSimplifyAllRows = false`)
- `Query.allBeverages` 👉 `Query.beverages`
- `Beverage.companyByCompanyId` 👉 `Beverage.company`
- `Beverage.companyByDistributorId` 👉 `Beverage.distributor`
- `Company.beveragesByCompanyId` 👉 `Company.beverages` (because the
  `company_id` column follows the `[table_name]_id` naming convention)
- All update mutations now accept `patch` instead of `companyPatch` /
  `beveragePatch` (disable via `pgSimplifyPatch = false`)
- If you prefer lists then you can use `pgOmitListSuffix = true` to omit the
  `List` suffix, and instead append `Connection` to connections
- Fields where the singular and plural are the same and a distinct plural is
  required are force-pluralised ("fishes") to avoid conflicts (e.g.
  `singularize("fish") === pluralize("fish")`).

Note: `Company.beveragesByDistributorId` will remain, because `distributor_id`
does not follow the `[table_name]_id` naming convention, but you could rename
this yourself with a smart comment:

```sql
comment on constraint "beverages_distributor_id_fkey" on "beverages" is
  E'@foreignFieldName distributedBeverages';
```

or with a custom inflector plugin:

```js
const plugin = {
  name: "MyCustomInflectionPlugin",
  version: "0.0.0",
  inflection: {
    replace: {
      getOppositeBaseName(previous, options, baseName) {
        return (
          {
            // These are the default opposites
            parent: "child",
            child: "parent",
            author: "authored",
            editor: "edited",
            reviewer: "reviewed",

            // 👇 Add/customise this line:
            distributor: "distributed",
          }[baseName] || previous.call(this, baseName)
        );
      },
    },
  },
};
```

## Installation:

```bash
yarn add @graphile/simplify-inflection@beta
```

or

```bash
npm install --save @graphile/simplify-inflection@beta
```

## Usage:

Add the preset to your Graphile Config file, under presets:

```ts
// graphile.config.mjs or similar

import { PgSimplifyInflectionPreset } from "@graphile/simplify-inflection";

export default {
  extends: [
    // ... (PostGraphileAmber, etc)
    PgSimplifyInflectionPreset,
  ],

  schema: {
    // ...
    /*
     * Uncomment if you want simple collections to lose the 'List' suffix
     * (and connections to gain a 'Connection' suffix).
     */
    //pgOmitListSuffix: true,
    /*
     * Uncomment if you want 'userPatch' instead of 'patch' in update
     * mutations.
     */
    //pgSimplifyPatch: false,
    /*
     * Uncomment if you want 'allUsers' instead of 'users' at root level.
     */
    //pgSimplifyAllRows: false,
    /*
     * Uncomment if you want primary key queries and mutations to have
     * `ById` (or similar) suffix; and the `nodeId` queries/mutations
     * to lose their `ByNodeId` suffix.
     */
    // pgShortPk: true,
  },
};
```

## Naming your foreign key fields

By naming your foreign key along the lines of `author_id` or `author_fk`, e.g.:

```sql
CREATE TABLE posts (
  id serial primary key,
  author_id int not null references users,
  ...
);
```

We can automatically extract the field prefix: `author` and call the relation
`author` rather than the default: `user`. This allows for a post to have an
`author`, `editor`, `reviewer`, etc. all which point to `users`.

The reverse, however, is not so easy. On the User type, we can't call the
reverse of all these different relations `posts`. The default inflector refers
to these as `postsByAuthorId`, `postsByEditorId`, etc. However we'd rather use
shorter names, so we introduce a new inflector: `getOppositeBaseName`. This
inflector is passed a baseName (the part without the `_id`/`_fk` suffix, e.g.
`author`, `editor`, `reviewer` above) and should return the opposite of that
base name which will be prepended to the target type to produce, e.g.
`authoredPosts`, `editedPosts`, `reviewedPosts`. Failing this, we just fall back
to the default (verbose) inflector; it will be up to you to add smart comments
or a custom inflector to override these.

## Handling field conflicts:

In most cases, the conflict errors will guide you on how to fix these issues
using [smart comments](https://www.graphile.org/postgraphile/smart-comments/).

## Smart Tags

### `@listSuffix`

`@listSuffix` allows you to override the default naming on a per-entity basis,
overriding `pgOmitListSuffix`. For example, with `pgOmitListSuffix: true`, you
can apply `@listSuffix include` to have the `-List` suffix appended to the
simple collection generated for that table, and remove the `-Connection` suffix
from the Relay connection. When `pgOmitListSuffix` is not `true`, you can use
`@listSuffix omit` to selectively omit the `-List` suffix on simple collections
and append `-Connection` to the Relay connection instead.

If `@listSuffix` is set, the only valid values are `"omit"` and `"include"`. Any
other value will cause an error.

|                   | @listSuffix omit    | @listSuffix include |
| ----------------: | :------------------ | :------------------ |
|  Relay Connection | companiesConnection | companies           |
| Simple Collection | companies           | companiesList       |

> NOTE: `@listSuffix` will have no effect when using `@foreignSimpleFieldName`.

Applies to:

- tables
- foreign key constraints
- computed column functions returning `SETOF <record type>`
