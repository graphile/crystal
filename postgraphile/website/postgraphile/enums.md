---
layout: page
path: /postgraphile/enums/
title: Enums
---

PostGraphile will automatically map PostgreSQL enums into GraphQL enums; they'll
be automatically renamed in order to make sure they conform to the GraphQL
naming requirements and conventions.

```sql
create type animal_type as enum (
  'CAT',
  'DOG',
  'FISH'
);
create table pets (
  id serial primary key,
  type animal_type not null,
  name text not null
);
```

The `@enum` smart comments can be used to set the name (`@enumName`) or the
description (`@enumDescription`) of PostgreSQL enums.

e.g.:

```sql
COMMENT ON TYPE animal_type IS E'@enum\n@enumName TypeOfAnimal';
```

Sometimes people prefer not to use PostgreSQL enums due to their technical
limitations (e.g. you can never drop a value from a PostgreSQL enum, and you
cannot add a value to it within a transaction). There are other ways to add
enums to PostGraphile:

### Enum tables

We can leverage PostgreSQL's foreign key relations to enforce that a value is
contained within a small set, defined by the values in some other table. To use
this feature, we must have a table in which to contain our enums, and we must
tell PostGraphile that it is an enum table using the `@enum` [smart
tag](./smart-tag/). You may also include a column named 'description' to
provide the description for the enum value.

```sql
create table animal_type (
  type text primary key,
  description text
);
comment on table animal_type is E'@enum';
insert into animal_type (type, description) values
  ('CAT', 'A feline animal'),
  ('DOG', 'A canine animal'),
  ('FISH', 'An aquatic animal');

create table pets (
  id serial primary key,
  type text not null references animal_type,
  name text not null
);
```

We also support the `@enum` smart tag on unique constraints (not indexes) so
you could use a single table to contain all your enums should you wish. We do
not recommend this specific pattern, but it's sometimes used in the ecosystem.

Should you wish to use a column other than `description` for the description of
the enum, put the smart comment `@enumDescription` on the desired column.

To set the name of the resulting enum, you may use the `@enumName` smart
comment, e.g.:

```sql
comment on table animal_type is E'@enum\n@enumName TypeOfAnimal';
```

The name must conform to the GraphQL `Name` restrictions.

### With makeExtendSchemaPlugin

Use the standard `enum` GraphQL interface definition language (IDL/SDL) to
define your enum:

```js
import { constant } from "postgraphile/grafast";
import { gql, makeExtendSchemaPlugin } from "graphile-utils";

const myPlugin = makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    enum AnimalType {
      """
      A feline animal
      """
      CAT

      """
      A canine animal
      """
      DOG

      """
      An aquatic animal
      """
      FISH
    }

    extend type Pet {
      type: AnimalType!
    }
  `,
  plans: {
    AnimalType: {
      CAT: "cat",
      DOG: "dog",
      FISH: "fish",
    },
    Pet: {
      type() {
        /* TODO: add logic here */
        return constant("cat");
      },
    },
  },
}));
```

### Other ways

You can also use the underlying Graphile Build API to add a new
`GraphQLEnumType`.
