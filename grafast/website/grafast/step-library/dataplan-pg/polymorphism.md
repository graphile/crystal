---
title: Polymorphism
---

# Polymorphism in @dataplan/pg

Polymorphism in PostgreSQL schemas can take many forms. In `@dataplan/pg` we've
added a few different step classes that you can use to deal with polymorphism;
which one you should choose depends on what shape your data is.

In the simplest case you have a single table that represents all of your
possible polymorphic types, perhaps using a 'type' column or similar to
indicate the underlying type. For this style, you should use
`pgSingleTablePolymorphic`.

A slightly more complex case is having a table that defines the type as above,
but then you join in additional data from other tables in a relational manner;
for this you should use `pgPolymorphic`.

Finally you might just have multiple separate tables that you want to represent
with an interface or union in GraphQL; for example a `users` table and an
`organizations` table which might both belong to the `Owner` interface. In this
case, you're probably going to need `pgUnionAll`.

See [types of polymorphism](#types-of-polymorphism) lower down for examples of these.

## pgSingleTablePolymorphic

`pgSingleTablePolymorphic` is useful only for the "single table" polymorphism
style (see below) but is much simpler to use than `pgPolymorphic`.

### pgSingleTablePolymorphic function

The `pgSingleTablePolymorphic` function can only be used in the "single table"
style, and accepts two arguments:

1. `$typeName` - a step that resolves to the GraphQL type name of the row
2. `$row` - a step representing the database row

Here's a simplified description of the `pgSingleTablePolymorphic` function:

```ts
export function pgSingleTablePolymorphic(
  $typePlan: ExecutableStep<string>,
  $rowPlan: PgSelectSingleStep,
): PgSingleTablePolymorphicStep;
```

## pgPolymorphic

`pgPolymorphic` works by matching the runtime value of a "specifier" step
against a "polymorphic type map" that defines the types supported, how to
detect matches, and what to do when the type is matched.

### Polymorphic type map

Here's a simplified description of the polymorphic type map used by `pgPolymorphic`:

```ts
interface PgPolymorphicTypeMap {
  [typeName: string]: {
    match(specifier: any): boolean;
    plan(
      $specifier: ExecutableStep,
      $item: PgSelectSingleStep | PgClassExpressionStep,
    ): ExecutableStep;
  };
}
```

Every concrete GraphQL object type that the `pgPolymorphic` step should support
must have an entry in this map, the key for which is the type's name, and the
value is an object with two methods:

1. `match(specifier)` - a function called at runtime that returns true if the
   specifier matches this type, false otherwise
2. `plan($specifier, $item)` - a plan resolver function that accepts the
   specifier step and the item step and returns a step representing this
   concrete object type

The specifier can be anything you need it to be - for example it could be the
value of a 'type' column, or it could be the entire composite record itself -
you choose what it is when you feed a step representing it into the
`pgPolymorphic` function.

### pgPolymorphic function

The `pgPolymorphic` function accepts three arguments:

1. `$item` - a step representing the database row or composite type
2. `$specifier` - a step representing the specifier used to identify a match - typically a derivative of `$item`
3. `possibleTypes` - the polymorphic type map object discussed above

Here's a simplified description of the `pgPolymorphic` function:

```ts
export function pgPolymorphic(
  $item: PgSelectSingleStep | PgClassExpressionStep
  $typeSpecifier: ExecutableStep,
  possibleTypes: PgPolymorphicTypeMap
): PgPolymorphicStep
```

## pgUnionAll

If you can't solve your polymorphic problem with `pgSingleTablePolymorphic` or
`pgPolymorphic` then you might need to fall back on `pgUnionAll`.

This step class uses the SQL `UNION ALL` construct to select a number of fields
from a number of different tables that might all be part of the same union or
interface in GraphQL. You can order by these shared fields, or apply conditions
to them, and we'll pass these orders and conditions down to the individual
table selects (as part of the `UNION ALL`) to ensure that we get the results in
the most efficient manner.

### pgUnionAll function

The `pgUnionAll` function accepts one argument - the "PgUnionAllStepConfig".
This configuration object has the following entries:

- `executor` - the PgExecutor to use for executing this `union all` statement
  at runtime
- `sourceSpecs` - details of the sources to combine in the `union all`
  statement; this is a map from the GraphQL object type name to a configuration
  object indicating the `source` for that type
- `attributes` - the available common attributes (if any) as a map from the
  attribute name to a specification object containing the `codec` to use for
  the attribute; this is generally used with GraphQL interfaces

:::note

Every `source` must have the same `executor` as the pgUnionAll executor.

Every `source` must have a primary key (an entry in `source.uniques` with
`isPrimary === true`) that can be used to fetch the resulting record that
matches the entry in the union.

:::

### Applying conditions

Conditions can be applied to the resulting step via the `.where()` method,
which accepts an object containing the following keys:

- `attribute` - the (string) name of the attribute from the pgUnionAll
  `attributes` to apply the condition against
- `callback` - a callback function, invoked for each union source and passed
  the alias for that source, that should return an SQL fragment expressing the
  condition.

:::note

`callback` will be called for each entry in `sourceSpecs` since each source is
responsible for adding its own conditions.

:::

### Custom ordering

The order of the union can be specified via the `.orderBy()` method,
which accepts an object containing the following keys:

- `attribute` - the (string) name of the attribute from the pgUnionAll
  `attributes` to use for ordering.
- `direction` - either `ASC` for ascending order, or `DESC` for descending
  order. All other values have undefined results that may change in a patch
  release.

:::note

Every entry in `sourceSpecs` will be ordered, and the `union all` will be ordered again
to ensure a stable ordering result.

:::

### Pagination

Limit/offset pagination can be accomplished via `.setFirst($n)` and
`.setOffset($n)`. `pgUnionAll` also implements the relevant interfaces to
support the [`connection`](../standard-steps/connection.md) step for cursor
pagination.

### Example

```ts
const $vulnerabilities = pgUnionAll({
  executor: firstPartyVulnerabilitiesSource.executor,
  sourceSpecs: {
    FirstPartyVulnerability: {
      source: firstPartyVulnerabilitiesSource,
    },
    ThirdPartyVulnerability: {
      source: thirdPartyVulnerabilitiesSource,
    },
  },
  attributes: {
    cvss_score: {
      codec: TYPES.float,
    },
  },
});
$vulnerabilities.orderBy({
  attribute: "cvss_score",
  direction: "DESC",
});
$vulnerabilities.where({
  attribute: "cvss_score",
  callback: (alias) =>
    sql`${alias} > ${$vulnerabilities.placeholder(constant(6), TYPES.float)}`,
});
$vulnerabilities.setFirst(2);
$vulnerabilities.setOffset(2);
```

### pgUnionAll SQL explained

Though the `UNION ALL` complicates PostgreSQL's planning and execution, we've
put effort into building the most efficient SQL queries we can for this
problem, whilst still supporting pagination, custom conditions and custom
ordering. This does result in more complex SQL queries than you may be used
to from this module. Effectively the queries look like this:

```sql
-- OUTER SELECT
select
  __union__."0"::text,
  __union__."1"::text
from (
    -- MIDDLE SELECT
    select
      __first_table__."0",
      __first_table__."1",
      __first_table__."2",
      "n"
    from (
      -- INNER SELECT
      select
        __first_table__."column1" as "0",
        __first_table__."id" as "1",
        'FirstTable' as "2",
        row_number() over (partition by 1) as "n"
      from first_table as __first_table__
      where ...
      order by __first_table__."column1"
      limit ...
    )
  -- Any number of additional "middle selects" from different tables
  -- via 'union all'
  union all
    select
  ...
  order by
    "0" desc,
    "n" asc,
    "2" asc
  limit ...
  offset ...
) __union__
```

We'll have as many "inner select" and "middle select" fragments as there are
tables in the union.

Each "inner select" is responsible for selecting the requisite common fields
from each individual table, applying any conditions (into the `where` clause),
applying the ordering (`order by` clause), and applying a limit (which will be
the main limit plus the offset so that we can source enough rows for the
`union all`'s limit/offset to apply).

The middle select exists solely because `union all` only
allows a single `order by` at the end of the statement, and for some reason we
think we know better how to optimize this query than Postgres does... (Time
will tell.) So the middle select just re-selects the relevant attributes.

The `union all` statement then orders by the relevant attributes again
(including the type name and the `row_number()` to ensure there's a stable
order) and applies the final limit/offset.

Finally the "outer select" selects the fields we need, and casts them according
to the codecs involved. Note that we couldn't have cast them earlier since they
were used in ordering, and casting them to text (for example) could seriously
compromise the ordering.

## Types of polymorphism supported

There are many ways of modelling polymorphism in the database, and they each
have various trade-offs. `@dataplan/pg` currently supports the following
approaches, but if you use a different method for modelling polymorphism in
your database please get in touch - maybe we can add support for that too!

### Single table

In this form or polymorphism we have a single database table that contains a
'type' column indicating the type of the row (it needn't be called 'type', and
it can have any data type - we use enum below but that's not a requirement).
The table also contains all fields needed by all the different types in the
interface or union[^1]. For example:

[^1]:
    Modelling a union in this way might indicate an issue with your GraphQL
    design - perhaps you should be using an interface instead?

```sql
create type item_type as enum (
  'TOPIC',
  'POST',
  'DIVIDER',
  'CHECKLIST',
  'CHECKLIST_ITEM'
);

create table items (
  id serial primary key,
  type item_type not null default 'POST'::item_type,

  -- Shared attributes:
  parent_id int references items on delete cascade,
  author_id int not null references people on delete cascade,
  position bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_explicitly_archived bool not null default false,
  archived_at timestamptz,

  -- Attributes that may be used by one or more item subtypes.
  title text,
  description text,
  note text,
  color text
);
```

The `items` table contains all the information that we need for our GraphQL
types `Topic`, `Post`, `Divider`, `Checklist` and `ChecklistItem`.

This style of polymorphism can use `pgSingleTablePolymorphic`:

```ts
// Map the SQL 'type' values to their GraphQL equivalents
const sqlTypeToGraphQLType = (type) =>
  ({
    TOPIC: "Topic",
    POST: "Post",
    DIVIDER: "Divider",
    CHECKLIST: "Checklist",
    CHECKLIST_ITEM: "ChecklistItem",
  }[type] ?? null);
// Or: `const sqlTypeToGraphQLType = pascalCase;`

/******/

const plans = {
  Comment: {
    item($comment) {
      // Get the 'item' related to this comment
      const $item = $comment.singleRelation("item");

      // Get the 'type' column from the item
      const $type = $item.get("type");

      // Convert the 'type' value into the name of a GraphQL type
      const $typeName = lambda($type, sqlTypeToGraphQLType);

      // Return the polymorphic step representing this item
      return pgSingleTablePolymorphic($typeName, $item);
    },
  },
};
```

<details>

<summary>

It's also possible to use `pgPolymorphic` to plan this style of polymorphism.

</summary>

:::note

All `plan` methods just return the `$item` directly, since the `$item` represents all possible types.

:::

```ts
const itemsTypeMap = {
  Topic: {
    match: (t) => t === "TOPIC",
    plan: (_, $item) => $item,
  },
  Post: {
    match: (t) => t === "POST",
    plan: (_, $item) => $item,
  },
  Divider: {
    match: (t) => t === "DIVIDER",
    plan: (_, $item) => $item,
  },
  Checklist: {
    match: (t) => t === "CHECKLIST",
    plan: (_, $item) => $item,
  },
  ChecklistItem: {
    match: (t) => t === "CHECKLIST_ITEM",
    plan: (_, $item) => $item,
  },
};

/******/

const plans = {
  Comment: {
    item($comment) {
      const $item = $comment.singleRelation("item");
      const $type = $item.get("type");
      return pgPolymorphic($item, $type, itemsTypeMap);
    },
  },
};
```

</details>

### Relational table

Similar to the single table example above, the relational table has a central
table with a 'type' column; however the per-type (not shared) fields live on
separate tables that can be joined in as necessary. These relational tables
share the same primary key as the central table, and the type on the central
table indicates which table should be joined to. For example:

```sql
create type item_type as enum (
  'TOPIC',
  'POST',
  'DIVIDER',
  'CHECKLIST',
  'CHECKLIST_ITEM'
);

-- Central table
create table items (
  id serial primary key,
  type item_type not null default 'POST'::item_type,

  -- Shared attributes:
  parent_id int references items on delete cascade,
  author_id int not null references people on delete cascade,
  position bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_explicitly_archived bool not null default false,
  archived_at timestamptz
);

-- Tables for each of the subtypes
create table topics (
  id int primary key references items,
  title text not null
);
create table posts (
  id int primary key references items,
  title text not null,
  description text default '-- Enter description here --',
  note text
);
create table dividers (
  id int primary key references items,
  title text,
  color text
);
create table checklists (
  id int primary key references items,
  title text not null
);
create table checklist_items (
  id int primary key references items,
  description text not null,
  note text
);
```

:::info

When building the `PgSource` for these tables, the subtables should have
entries in `columns` for all of the shared columns, with `via: "item"` to
indicate that those columns come via the 'item' relationship (replacing 'item'
with whatever relation needs to be traversed to access the central table).

:::

:::tip

This pattern can be used to represent unions too, in this case the central
table would probably only have the primary key and type field. However, if
you're using this pattern to represent unions then there may be an issue in
your GraphQL data-modelling and what you actually want is an interface.

:::

This style of polymorphism would be planned via `pgPolymorphic` (note the
`plan` method returns a step representing a row from the relevant underlying
table):

```ts
const itemsTypeMap = {
  Topic: {
    match: (t) => t === "TOPIC",
    plan: (_, $item) => $item.singleRelation("topic"),
  },
  Post: {
    match: (t) => t === "POST",
    plan: (_, $item) => $item.singleRelation("post"),
  },
  Divider: {
    match: (t) => t === "DIVIDER",
    plan: (_, $item) => $item.singleRelation("divider"),
  },
  Checklist: {
    match: (t) => t === "CHECKLIST",
    plan: (_, $item) => $item.singleRelation("checklist"),
  },
  ChecklistItem: {
    match: (t) => t === "CHECKLIST_ITEM",
    plan: (_, $item) => $item.singleRelation("checklistItem"),
  },
};

const plans = {
  Comment: {
    item($comment) {
      const $item = $comment.singleRelation("item");
      const $type = $item.get("type");
      return pgPolymorphic($item, $type, itemsTypeMap);
    },
  },
};
```

### Composite type union

One way to indicate a union would be to use a composite type with an attribute
for each possible type referencing the primary key of the given type; exactly
one attribute should be non-null at a time. For example:

```sql
create table people (...);
create table posts (...);
create table comments (...);

create type entity as (
  person_id int,
  post_id int,
  comment_id int
);
```

This type could then be used as the return result for functions or as the type
for a column to indicate a polymorphic relationship.

This type style of polymorphism would also be planned via `pgPolymorphic`
(note we've modelled the specifier as a tuple):

```ts
const entityTypeMap = {
  Person: {
    match: (specifier) => specifier[0] != null,
    plan: ($specifier) => personSource.get({ person_id: $specifier.at(0) }),
  },
  Post: {
    match: (specifier) => specifier[1] != null,
    plan: ($specifier) => postSource.get({ post_id: $specifier.at(1) }),
  },
  Comment: {
    match: (specifier) => specifier[2] != null,
    plan: ($specifier) => commentSource.get({ comment_id: $specifier.at(2) }),
  },
};

const plans = {
  PersonBookmark: {
    bookmarkedEntity($bookmark) {
      const $item = $bookmark.get("bookmarked_entity");
      const $specifier = list([
        $item.get("person_id"),
        $item.get("post_id"),
        $item.get("comment_id"),
      ]);
      return pgPolymorphic($item, $specifier, entityTypeMap);
    },
  },
};
```

### Column-based union

Another way to indicate a union relationship would be to add a set of columns
to a table to point to all the possible entities in the union, and add a rule
that exactly one of them must be set.

Consider the following GraphQL schema, where a person may have a number
of favourite entities of various types:

```graphql
union PersonFavouriteEntity = Person | Post | Comment
type PersonFavourite {
  id: ID!
  person: Person!
  entity: PersonFavouriteEntity!
}
type Person {
  # ...
  favourites: [PersonFavourite!]!
}
type Query {
  person: Person
}
```

This schema might have the following underlying database table:

```sql
create table person_favourites (
  id serial primary key,
  person_id int not null references people on delete cascade,
  liked_person_id int references people on delete cascade,
  liked_post_id int references posts on delete cascade,
  liked_comment_id int references comments on delete cascade
);
```

Here we might set the rule that exactly one of `liked_person_id`,
`liked_post_id` and `liked_comment_id` must be non-null at a time, and the one
which is non-null would indicate which concrete type the
`PersonFavouriteEntity` represents.

Planning for this would be very similar to the composite type union above:

```ts
const personFavouriteEntityTypeMap = {
  Person: {
    match: (specifier) => specifier[0] != null,
    plan: ($specifier) => personSource.get({ person_id: $specifier.at(0) }),
  },
  Post: {
    match: (specifier) => specifier[1] != null,
    plan: ($specifier) => postSource.get({ post_id: $specifier.at(1) }),
  },
  Comment: {
    match: (specifier) => specifier[2] != null,
    plan: ($specifier) => commentSource.get({ comment_id: $specifier.at(2) }),
  },
};

const plans = {
  Person: {
    favourites($person) {
      const $favourites = personFavouritesSource.find({
        person_id: $person.get("id"),
      });
      return each($favourites, ($favourite) => {
        const $specifier = list([
          $favourite.get("liked_person_id"),
          $favourite.get("liked_post_id"),
          $favourite.get("liked_comment_id"),
        ]);
        return pgPolymorphic(
          $favourite,
          $specifier,
          personFavouriteEntityTypeMap,
        );
      });
    },
  },
};
```

### Completely separate tables

In the completely separate tables form of polymorphism, any number of tables
can become part of a union via `pgUnionAll`. You may also, optionally, declare
attributes that these tables have in common - this can allow you to add
conditions and orders on these common columns. Right now these common columns
must match name and type exactly (we don't check this, but unexpected errors
may occur at runtime if you don't adhere to it) but there's definitely scope to
soften these requirements - get in touch if this is something you need.
