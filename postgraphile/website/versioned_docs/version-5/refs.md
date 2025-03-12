# Refs

When you have two database tables with a foreign key constraint between them,
PostGraphile will automatically add that relation to your GraphQL schema in
both directions. Sometimes you want to add additional links between types,
perhaps links that traverse multiple relationships (e.g.
`post -> topic -> forum`), or links that perform polymorphism over relations.
For this need, we have refs. Refs are uni-directional (they do not
automatically create a reverse field) and may be plural or singular. Plural
refs support both list and connection interfaces in GraphQL.

:::note

Refs follow relations defined via foreign key constraints (or
`@foreignKey` smart tags), attempts to build relations via a `@ref`
without having an underlying foreign key relation will be ignored, though you
may see a warning in the console such as:

```
When processing ref for resource 'posts', could not find matching relation for
via:'(author_id)->users'
```

:::

## @ref and @refVia

The easiest way to define a ref is with a `@ref` smart tag. The first argument to your `@ref` smart tag
is the name for your reference, and then it supports the following optional parameters:

- `to:` - the name of the GraphQL type we're referencing (required if `via:` is not present)
- `from:` - the name of the GraphQL type we're applying the reference to when using polymorphism
- `via:`- the route string (see below) through which we can reach the target
- `singular` - present if this is a singular relationship
- `plural` - indicates that the ref is plural (default). Not allowed if
  `singular` is specified.

For example:

```sql
comment on table posts is $$
  @ref author via:(author_id)->people(id) singular
  $$;`
```

Sometimes we want a ref to use multiple routes; this might be because there's
multiple join tables we want to traverse to the same target table, or because
we want to target multiple tables. When we need this, instead of specifying a
`via:` directly on the `@ref` smart tag, we add multiple `@refVia` smart tags,
each with the ref name followed by a `via:` (see "Route strings" below):

```sql
comment on table books is $$
  @ref relatedPeople to:Person
  @refVia relatedPeople via:book_authors;people
  @refVia relatedPeople via:book_editors;people
  $$;
```

We can also use multiple targets to indicate polymorphism (see [the polymorphism
docs](./polymorphism) for full details):

```sql
comment on table log_entries is $$
  @ref author to:PersonOrOrganization singular
  @refVia author via:(person_id)->people(person_id)
  @refVia author via:(organization_id)->organizations(organization_id)
  $$;
```

## Route strings

The value for a `via:` parameter takes the form of a chain of one or more
relationships separated by semicolons. Each relationship is either:

- `<table_name>` - a table name (in which case there must be exactly one
  foreign key referencing this table), or
- `(<column>,...)-><table_name>` - a list of local columns referencing a
  remote table's primary key
- `(<column>,...)-><table_name>(<column>,...)` - a list of local columns
  referencing a remote table's list of columns
