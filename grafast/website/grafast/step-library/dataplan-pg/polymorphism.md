---
title: Polymorphism
---

# Polymorphism in @dataplan/pg

Polymorphism in PostgreSQL schemas can take many forms, and each haev their own
trade-offs. `@dataplan/pg` has two
main ways of querying polymorphic data: `pgSelect` (for querying either a single
table for all types or a single table left-joined to tables with additional data
for each type), and `pgUnionAll` (for querying multiple different (independent)
database tables via the SQL `UNION ALL` construct). These two step classes are
similar in many ways, but `pgUnionAll` is much more limited in order to maintain
performance even when dealing with complex setups.

## Types of polymorphism supported

Gra*fast* leaves the planning of abstract types to the user (via the `planType`
method - see [Grafast polymorphism](/grafast/polymorphism)), so `@dataplan/pg`
does not specifically need polymorphism support. That said; we want to make
your life easier when dealing with polymorphism, so here's how to handle some
common forms of polymorphism in PostgreSQL:

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
  position int not null default 0,

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
regular row selection; and might have types and plans such as these:

<details>
  <summary>Click to expand typeDefs and itemTypeNameFromType definition</summary>

```ts
const typeDefs = /* GraphQL */ `
  type Query {
    item(id: Int!): Item
  }

  interface Item {
    id: Int!
    parent: Item
    position: Int
  }

  type Topic implements Item {
    id: Int!
    parent: Item
    position: Int

    title: String
  }
  type Post implements Item {
    id: Int!
    parent: Item
    position: Int

    title: String
    description: String
    note: String
  }
  type Divider implements Item {
    id: Int!
    parent: Item
    position: Int

    title: String
    color: String
  }
  type Checklist implements Item {
    id: Int!
    parent: Item
    position: Int

    title: String
  }
  type ChecklistItem implements Item {
    id: Int!
    parent: Item
    position: Int

    description: String
    note: String
  }
`;

const itemTypeNameFromType = (type: string) =>
  ({
    TOPIC: "Topic",
    POST: "Post",
    DIVIDER: "Divider",
    CHECKLIST: "Checklist",
    CHECKLIST_ITEM: "ChecklistItem",
  })[type];
```

</details>

```ts
// TODO: test this!

const singleTableSchema = makeGrafastSchema({
  typeDefs,
  plans: {
    Query: {
      item(_, { $id }) {
        // The `Item` type expects the specifier to simply be the item ID
        return $id;
      },
    },
    // Our abstract (interface) type
    Item: {
      __planType($id: Step<number>) {
        // Load the item
        const $item = singleTableItems.get({ id: $id });
        // Get its type (e.g. CHECKLIST_ITEM)
        const $type = get($item, "type");
        // Convert that to a GraphQL type (e.g. ChecklistItem)
        const $__typename = lambda($type, itemTypeNameFromType);
        // Return the abstract type planner, use $item for every type
        return { $__typename, planForType: () => $item };
      },
    },
  },
});
```

<!-- TODO: move this to the PostGraphile documentation?

, however the codec on the source your `pgSelect` uses
must have the `polymorphic` configuration option set to `mode: "single"` for it
to work. Something like:

```ts
itemResource.codec.polymorphism = {
  mode: "single",
  typeAttributes: ["type"],
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

-->

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
  position int not null default 0
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
regular row selection, but the `planType` is a tiny bit more complex:

```ts
// TODO: test this!

// Note: we're using the same `typeDefs` and `itemTypeNameFromType` as above

const relationalSchema = makeGrafastSchema({
  typeDefs,
  plans: {
    Query: {
      item(_, { $id }) {
        // The `Item` type expects the specifier to simply be the item ID
        return $id;
      },
    },
    Item: {
      __planType($id: Step<number>) {
        // Load the base item
        const $item = relationalItems.get({ id: $id });
        // Get its type (e.g. CHECKLIST_ITEM)
        const $type = get($item, "type");
        // Convert that to a GraphQL type (e.g. ChecklistItem)
        const $__typename = lambda($type, itemTypeNameFromType);
        // Return the abstract type planner
        return {
          $__typename,
          planForType(t) {
            // This time, each GraphQL object type needs to select from its own
            // subtable via a relational join.
            switch (t.name) {
              case "Topic":
                return $item.singleRelation("topic");
              case "Post":
                return $item.singleRelation("post");
              case "Divider":
                return $item.singleRelation("divider");
              case "Checklist":
                return $item.singleRelation("checklist");
              case "ChecklistItem":
                return $item.singleRelation("checklistItem");
              default:
                throw new Error(`Don't know how to plan type ${t}`);
            }
          },
        };
      },
    },
  },
});
```

<!-- TODO: move these to PostGraphile docs?

, however the codec on the source your `pgSelect` uses
must have the `polymorphic` configuration option set to `mode: "relational"`
for it to work. Something like:

```ts
itemResource.codec.polymorphic = {
  mode: "relational",
  typeAttributes: ["type"],
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


-->

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

```ts
const plans = {
  PersonBookmark: {
    bookmarkedEntity($bookmark) {
      return $bookmark.get("bookmarked_entity");
    },
  },
  Entity: {
    planType($specifier) {
      const $personId = $item.get("person_id");
      const $postId = $item.get("post_id");
      const $commentId = $item.get("comment_id");
      const $__typename = lambda(
        [$personId, $postId, $commentId],
        ([personId, postId, commentId]) => {
          if (personId != null) return "Person";
          if (postId != null) return "Post";
          if (commentId != null) return "Comment";
          return null;
        },
        true,
      );
      return {
        $__typename,
        planForType(t) {
          switch (t.name) {
            case "Person":
              return personResource.get({ person_id: $personId });
            case "Post":
              return postResource.get({ post_id: $postId });
            case "Comment":
              return commentResource.get({ comment_id: $commentId });
            default:
              throw new Error(`Don't know how to plan type ${t}`);
          }
        },
      };
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
union Entity = Person | Post | Comment
type Person {
  # ...
  favourites: [Entity!]!
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
which is non-null would indicate which concrete type the `Entity`
represents. Planning this would be very similar to the above:

We can plan this using a `pgUnionAll`:

```ts
const plans = {
  Person: {
    favourites($person) {
      const $favourites = personFavouritesResource.find({
        person_id: $person.get("id"),
      });
      // Convert the $favourites collection into a set of specifiers for our
      // Entity polymorphic type.
      return each($favourites, ($favourite) =>
        object({
          person_id: $favourite.get("liked_person_id"),
          post_id: $favourite.get("liked_post_id"),
          comment_id: $favourite.get("liked_comment_id"),
        }),
      );
    },
  },
  Entity: {
    // The same __planType as the previous example
    __planType($specifier) {
      const $personId = $item.get("person_id");
      const $postId = $item.get("post_id");
      const $commentId = $item.get("comment_id");
      const $__typename = lambda(
        [$personId, $postId, $commentId],
        ([personId, postId, commentId]) => {
          if (personId != null) return "Person";
          if (postId != null) return "Post";
          if (commentId != null) return "Comment";
          return null;
        },
        true,
      );
      return {
        $__typename,
        planForType(t) {
          switch (t.name) {
            case "Person":
              return personResource.get({ person_id: $personId });
            case "Post":
              return postResource.get({ post_id: $postId });
            case "Comment":
              return commentResource.get({ comment_id: $commentId });
            default:
              throw new Error(`Don't know how to plan type ${t}`);
          }
        },
      };
    },
  },
};
```

### Completely separate tables

If you have two completely different tables (let's say `users` and
`organizations`) and you want them to partake in a GraphQL interface or union,
you could use [pgUnionAll](./pgUnionAll.md) to plan them.

```ts
const plans = {
  Query: {
    allPeopleAndOrganizations() {
      return pgUnionAll({
        resourceByTypeName: {
          Person: personResource,
          Organization: organizationResource,
        },
      });
    },
  },
  PersonOrOrganization: {
    __planType($spec) {
      // PgUnionAllSingleStep has a `toSpecifier` method, so we know the object
      // will already have the right shape.
      const $__typename = get($spec, "__typename");
      return {
        $__typename,
        planForType(t) {
          switch (t.name) {
            case "Person":
              return personResource.get({ id: get($spec, "id") });
            case "Organization":
              return organizationResource.get({ id: get($spec, "id") });
            default:
              throw new Error(`Don't know how to plan type ${t}`);
          }
        },
      };
    },
  },
};
```
