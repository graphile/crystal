---
layout: page
path: /postgraphile/v3-migration/
title: Migrating from PostGraphQL v3
---

Despite the fact that PostGraphile v4 has rewritten the _entire_ GraphQL schema
generation from scratch it is still broadly compatible with version 3. This
document aims to outline solutions to issues you might face whilst upgrading. If
you face issues that you cannot solve, please do reach out!

### Short list of breaking changes

These are things that can't be easily solved by just adding a command-line
switch or configuration parameter - if these are a problem for you then please
get in touch and we'll discuss how one might go about fixing them (please read
the below first though!)

- Per-function `returns setof <table>` connection names have been removed in
  favour of a shared connection with the tables themselves - only affects you if
  you have referenced the type name in queries/fragments
- What's nullable and what isn't has changed slightly - shouldn't cause an issue
  in most cases (please read [Why is it nullable?](./why-nullable/) for an
  explanation of why each thing is nullable)
- JWTs now have an audience of 'postgraphile' rather than 'postgraphql', but you
  can change this with the `--jwt-verify-audience` option
- If you have any tables ending with `_input`, `_patch`, `Input` or `Patch` they
  will be renamed (see bottom of this article)

### Aside: project financial status

**If your business uses PostGraphile, please invest in
[our Patreon](https://www.patreon.com/benjie)** - you'll benefit from faster
fixes, more features, and better performance. If you need a more commercially
justifiable way of funding the project then please
[get in touch](mailto:team@graphile.org?subject=Giving%20back).

### Deprecations

#### One-to-one backward relations

These are now supported, so the previous one-to-many approximation for them has
been deprecated. If you can do so we encourage you to remove the old API via
`--legacy-relations=omit` (or `legacyRelations: 'omit'` in the library version);
however by default we include both relations. If for some reason you don't want
the deprecation and you don't want the new behaviour (why?! It's so much
better!) then you can enable the old behaviour only via
`--legacy-relations=only`.

Example:

```sql
create table foo (
  id serial primary key
);

create table bar (
  foo_id int not null primary key references foo,
  name text
);
```

```graphql
{
  fooById(id: 1) {
    # Old interface - deprecated
    # Note: this connection can only return at most one result so doesn't
    # deserve a connection
    barsByFooId {
      edges {
        node {
          name
        }
      }
    }

    # New interface - no more indirection!
    barByFooId {
      name
    }
  }
}
```

### Breakdown of issues you might face

#### New minimum requirements

**Problem**: the system fails to start (or even install) because the
requirements are not met.

**Solution**: upgrade your software

- Node.js v8.6+ required
- PostgreSQL 9.4+ required (v9.6+ recommended)
- GraphQL v0.9+ required

**Reasoning**: Node.js v8 is the current active LTS, v6 will be leaving active
LTS status for maintenance mode in April 2018 (next month at time of writing),
and supporting 8.6+ as the base level gives us longevity whilst also allowing us
to leverage native support for some of the powerful features of ES2017 and
ES2018.

#### Type 'Json' or 'Uuid' is not recognized

**Problem**: `Json` and `Uuid` have been renamed to `JSON` and `UUID`
respectively

**Solution**: either modify your queries, or if you cannot do that then use the
`--legacy-json-uuid` command line flag (or `legacyJsonUuid: true` library
option) to change back to the old naming.

**Reasoning**: purely correctness/aesthetic. Sorry. 😅

#### Connection `orderBy` is now an array

**Problem**: `orderBy` in connection fields now allows an array of order
specifications, so you can order by multiple things (like in SQL). However
certain clients might have a problem with this?

**Solution**: in most cases this should _not_ cause an issue for existing
queries - according to
[3.1.7 in the GraphQL specification](https://graphql.github.io/graphql-spec/October2016/#sec-Lists):

> If the value passed as an input to a list type is not a list and not the null
> value, it should be coerced as though the input was a list of size one, where
> the value passed is the only item in the list.

So any spec-compliant client should **not** have an issue with this.

**Reasoning**: people want to sort by multiple columns and since we could do it
with a non-breaking change (according to the above) we did!

#### Expected 'UUID' but received 'String'

**Problem**: 'UUID' is enabled by default

**Solution**: raise an issue and we can add a toggle to not enable it by default

**Reasoning**: named types are helpful

#### JWTs now have audience 'postgraphile' / issuer 'postgraphile'

**Problem**: we changed the audience with the rename of the library

**Solution**: if you can't update your config you can make sure your token
objects returned in the DB have `aud: 'postgraphql', iss: 'postgraphql'`
(solution untested - if you used this please let
[me](https://twitter.com/benjie) know whether it worked or not)

**Reasoning**: we renamed the library, it'd be confusing for new users to
reference the old name.

#### Functions now use table connections where possible (again!)

**Problem**: functions that return setof a table type now use the same
connection class as the tables themselves do (just like PostGraphQL v2 did)

**Solution**: if this is a problem for you and you're unable to fix the queries,
please do get in touch!

**Reasoning**: performing pagination against multiple sources of the same table
type is much more complex if the connection types differ.

**Potential future solution**: have the connections implement a shared
interface.

#### Issues with nullables

**Problem**: some things are nullable that weren't, some things aren't nullable
that were.

**Solution**: you can enable the `--no-setof-functions-contain-nulls` CLI option
(or `setofFunctionsContainNulls: false` library option) to reduce the nullables
in the generated schema.

**Reasoning**:

Functions like this can exist:

```sql
create function c.badly_behaved_function() returns setof c.person as $$
begin
  return query select * from c.person order by id asc limit 1;
  return next null;
  return query select * from c.person order by id desc limit 1;
end;
$$ language plpgsql stable;
```

This function returns an array of `[{person}, null, {person}]` where `{person}`
is a Person object. In PostGraphile because it is a `setof` function we treat it
as a connection. As explained above, we now (like in version 2) use the same
connections for functions as for tables - as such these connections now have to
support that the entries within them are nullable.

If you don't like the nulls everywhere, I encourage you to use the `-N` /
`--no-setof-functions-contain-nulls` option mentioned above. Enabling this is a
non-breaking change, but disabling it **is** a breaking change - hence why it is
not the default behaviour.

#### Fields in create mutations now respect defaults

In v3, omitting a field from a create mutation would cause it to be set to
`NULL`, ignoring the column default. We fixed this in v4, now if you want to set
the column null you must specify NULL in the mutation (rather than omitting the
key).

#### Query procedures that `returns setof <scalar>` no longer have `pageInfo` nor `totalCount`

**Problem**: as heading.

**Solution**: it's possibly to re-introduce support via a plugin - get in touch
if you need this

**Reasoning**: I did not feel it was particularly necessary and I've only got
limited time to work on the project...

#### Watch schema has changed

_Note that changes to the watch schema are NOT deemed to be breaking changes._

**Problem**: watch schema has changed to fix issues with dropping objects

**Solution**: most people shouldn't be affected by this (though they might want
to drop the old watch schema) because `--watch` is only intended for development
use and the new schema should install itself just fine. But if you had to
manually install the old watch schema, you'll need to manually install the
[new one](https://github.com/graphile/graphile-engine/blob/master/packages/graphile-build-pg/res/watch-fixtures.sql)
in the same way

**Reasoning**: the old schema did not detect certain `DROP` commands and so
adding tables, columns, functions, etc. to your schema was fine, but removing
them did not result in a refresh.

### Other changes that may affect you

These are things that I doubt affect many people (if any) but I want to raise so
you can check your own applications.

#### Introspection query has changed

And will probably continue to change. Changes to the introspection query are not
deemed to be breaking changes. The introspection query is now programatically
generated so that we can support PG10 and PG11 features.

#### Field descriptions have changed a little

Field description changes are not deemed to be breaking changes.

#### Case changing library has changed

We replaced the library but this doesn't affect any of the tests. If this causes
you pain please submit an issue so we can add your fields/table names/etc to the
tests to ensure this doesn't happen again.

Workaround: you can change the inflection engine back to the old one with a
plugin - [see `makeAddInflectorsPlugin`](./make-add-inflectors-plugin/).

#### Procedures that only supported `orderBy: NATURAL` now **do not have `orderBy` at all**.

Though technically a breaking change, I'm not deeming it as such because I don't
understand why you'd explicitly set the orderBy for a field that only has one
value and that value is enabled by default.

If this is a problem for you please get in touch and we can add support back via
a simple plugin.

#### Using a return type PostGraphile user can't access

`security definer` mutations that return a type from a schema that the
requesting PostgreSQL user is not allowed to view may now result in
`permission denied for schema xxxx`.

**Solution**: don't do that 😉

#### Conflicting tables names - `*_input`, `*_patch`

Tables that end in `_input` or `_patch` such as `foo_input` will no longer be
exported as `FooInput` but as `FooInputRecord` - this prevents collisions with
mutation types on tables that share the prefix (e.g. table `foo`/`foos` requires
`FooInput` for its create mutation).

Even if they don't clash _right now_ there's a risk that they will clash in
future; e.g. if you create the table `foo_bar_input` then creating `FooBarInput`
and `FooBarInputInput` and `FooBarInputPatch` is fine... But if you later add
the table `foo_bar` then `FooBarInput` will clash. So renaming the tables up
front means that whether or not you add that table later it'll still be fine
without breaking existing functionality.

You can rename tables directly, or if you prefer not to change your database
layout you can use [smart comments](./smart-comments/) or write a custom
[inflector](./inflection/).

#### Very large numbers

Large integers (over 4 bytes) are still referred to as `BigInt`, large floats
(those beyond IEEE754) are now called `BigFloat`. The specific boundaries in
which these new types kick in may have changed - particularly for
`DECIMAL`/`NUMERIC` types. `DECIMAL`/`NUMERIC` are likely to change in future
(so that smaller versions might be represented as int/float rather than
BigInt/BigFloat).
