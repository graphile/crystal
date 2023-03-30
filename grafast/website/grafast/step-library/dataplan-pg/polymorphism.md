---
title: Polymorphism
---

# Polymorphism in @dataplan/pg

Polymorphism in PostgreSQL schemas can take many forms. `@dataplan/pg` has two
main ways of dealing with this polymorphism: `pgSelect` (which is polymorphic
capable so long as all the data either comes from a single table, or a single
table left-joined to additional tables), and `pgUnionAll` (which allows you to
pull data from multiple different (independent) database tables via the SQL
`UNION ALL` construct). These two step classes are similar in many ways, but
`pgUnionAll` is much more limited in order to maintain performance even when
dealing with complex setups.

Read on for examples of these.

<!--
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
-->

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

This style of polymorphism can use `pgSelect` in the same way as you would with
regular row selection, however the codec on the source your `pgSelect` uses
must have the `polymorphic` configuration option set to `mode: "single"` for it
to work. Something like:

```ts
itemSource.codec.polymorphic = {
  mode: "single",
  typeColumns: ["type"],
  types: {
    TOPIC: {
      name: "Topic",
    },
    POST: {
      name: "Post",
    },
    DIVIDER: {
      name: "Divider",
    },
    CHECKLIST: {
      name: "Checklist",
    },
    CHECKLIST_ITEM: {
      name: "ChecklistItem",
    },
  },
};
```

<details>
<summary>Alternatively, if you'd rather not change your source/codec...</summary>

If you'd rather not change your source/codec then you can use `pgSingleTablePolymorphic`:

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

When building the `PgResource` for these tables, the subtables should have
entries in `columns` for all of the shared columns, with `via: "item"`
(replacing `"item"` with the name of the relation that needs to be traversed to
access the central table) to indicate that those columns come via the 'item'
relationship.

:::

:::tip

This pattern can be used to represent unions too, in this case the central
table would probably only have the primary key and type field. However, if
you're using this pattern to represent unions then this may indicate an issue
in your GraphQL data-modelling and that what you actually want is an interface.

:::

This style of polymorphism can use `pgSelect` in the same way as you would with
regular row selection, however the codec on the source your `pgSelect` uses
must have the `polymorphic` configuration option set to `mode: "relational"`
for it to work. Something like:

```ts
itemSource.codec.polymorphic = {
  mode: "relational",
  typeColumns: ["type"],
  types: {
    TOPIC: {
      name: "Topic",
      relationName: "topic",
    },
    POST: {
      name: "Post",
      relationName: "post",
    },
    DIVIDER: {
      name: "Divider",
      relationName: "divider",
    },
    CHECKLIST: {
      name: "Checklist",
      relationName: "checklist",
    },
    CHECKLIST_ITEM: {
      name: "ChecklistItem",
      relationName: "checklistItem",
    },
  },
};
```

:::info

The `relationName` in the above configuration is the name of the relation that
your central source has which links to the relevant table that contains
additional data for this type.

:::

<details>

<summary>Alternatively, if you don't want to change your codec...</summary>

This style of polymorphism could be planned via `pgPolymorphic` (note the
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

</details>

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

This type style of polymorphism could be planned via `pgPolymorphic` (note
we've modelled the specifier as a tuple):

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

We can plan this using a `pgUnionAll`:

```ts
const plans = {
  Person: {
    favourites($person) {
      const $favourites = personFavouritesSource.find({
        person_id: $person.get("id"),
      });
      return each($favourites, ($favourite) => {
        const $list = pgUnionAll({
          attributes: {},
          sourceByTypeName: {
            Person: personSource,
            Post: postSource,
            Comment: pommentSource,
          },
          members: [
            {
              typeName: "Person",
              source: personSource,
              match: {
                id: $favourite.get("liked_person_id"),
              },
            },
            {
              typeName: "Post",
              source: postSource,
              match: {
                id: $favourite.get("liked_post_id"),
              },
            },
            {
              typeName: "Comment",
              source: commentSource,
              match: {
                id: $favourite.get("liked_comment_id"),
              },
            },
          ],
        });
        return $list.single();
      });
    },
  },
};
```

<details>

<summary>Alternatively, you could use <tt>pgPolymorphic</tt>:</summary>

Planning for this could be very similar to the composite type union above:

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

</details>

### Completely separate tables

If you have two completely different tables (let's say `users` and
`organizations`) and you want them to partake in a GraphQL interface or union,
you could use [pgUnionAll](./pgUnionAll.md) to plan them.

```ts
const plans = {
  Query: {
    allPeopleAndOrganizations() {
      const $list = pgUnionAll({
        sourceByTypeName: {
          Person: personSource,
          Organization: organizationSource,
        },
      });
      return $list;
    },
  },
};
```
