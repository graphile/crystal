---
title: Reserved keywords
---

# Reserved keywords and table names

Some table, column, function and argument names can cause issues with
PostGraphile due to conflicts with auto-generated type and field names. In these
cases you can generally change the GraphQL type and field names for your
PostgreSQL schema to avoid conflicts using [smart tags](./smart-tags).

Note that in many cases the **singular** or the **plural** of the words below
may also cause issues, so assume the list below includes singulars and plurals
too. The same goes for **snake_case** vs **camelCase** since PostGraphile
automatically converts between these for you.

- [Table] `query`, `mutation`, `subscription` - conflict with the root-level
  `Query`, `Mutation` and `Subscription` GraphQL types.
- [Table, Function] `node` - conflicts with the GraphQL root `node(...)`
  interface.
- [Column, Argument] `order_by` / `orderBy` - Used by PostGraphile for ordering,
  may cause issues when declared as a function argument or table column.
- [Column] `primary_key` - we automatically add `orderBy: PRIMARY_KEY_ASC` to
  ordering, if you have a column called `primary_key` then this value will be
  generated twice and cause issues.

There are other potential conflicts too, if you discover more conflicts then
please consider using the "Edit this page" link to suggest some changes!

### Non-unique table names

If there exists multiple schemas with the same table name inside of them, it
can cause naming conflicts as the same name will be generated for each. To
support non-unique table names you should either apply an `@name` [smart
tag](./smart-tags) to one or both tables, or implement an [inflection
override](./inflection/#overriding-inflection---general) that will change how
the GraphQL type names are generated from the raw table name.
