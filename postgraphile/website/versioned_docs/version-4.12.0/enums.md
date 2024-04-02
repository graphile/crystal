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

### With enum tables

_Since 4.8.0_

We can leverage PostgreSQL's foreign key relations to enforce that a value is
contained within a small set, defined by the values in some other table. To use
this feature, we must have a table in which to contain our enums, and we must
tell PostGraphile that it is an enum table using the `@enum`
[smart comment](./smart-comments/). You may also include a column named
'description' to provide the description for the enum value.

**IMPORTANT**: this is one of the few places where a smart tag and a smart
comment is not equivalent, this **must** be achieved with a smart comment since
smart tags have not yet loaded at this stage in introspection.

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

We also support the `@enum` smart comment on unique constraints (not indexes) so
you could use a single table to contain all your enums should you wish. We do
not recommend this specific pattern, but it's sometimes used in the ecosystem.

Should you wish to use a column other than `description` for the description of
the enum, put the smart comment `@enumDescription` on the desired column.

To set the name of the resulting enum, you may use the `@enumName` smart
comment, e.g.:

```sql
comment on table animal_type is E'@enum\n@enumName TypeOfAnimal';
```

The name must conform to the GraphQL identifier restrictions.

#### Functions and table enums

_Since 4.14.0_

Functions exposed via GraphQL (as custom queries, computed columns and custom
mutations) need a little assistance in order to indicate that an argument type
or return type references a enum table and should be typed as a GraphQL enum.

You can achieve this by creating a domain for your enum that either:

- has a name that ends with `_enum_domain`, or
- is tagged with `@enum the_enum_table_it_references`.

Example:

```sql
create table stage_options (
  type text primary key
);
comment on table stage_options is E'@enum';
insert into stage_options
  (type) values
  ('pending'),
  ('round 1'),
  ('round 2'),
  ('rejected'),
  ('hired');

-- Either follow the convention of [enum_name]_enum_domain:
create domain stage_options_enum_domain as text;
-- or use any name for the domain and add a smart comment:
-- create domain stage as text;
-- comment on domain stage is E'@enum stage_options';

-- This function will add a `nextStage` field to applicant with GraphQL type
-- `StageOptions` (our table enum):
create function applicants_next_stage(a applicants)
returns stage_options_enum_domain
as $$
  select (case
    when a.stage = 'round 2' then 'hired'
    else 'rejected'
  end)::stage_options_enum_domain;
$$ language sql stable;

-- This function allows to filter applicants by `StageOptions` value:
create function applicants_by_stage(wanted_stage stage_options_enum_domain)
returns setof applicants
as $$
  select * from applicants a where a.stage = wanted_stage
$$ language sql stable;
```

For enums using unique constraints, you can achieve the same result by creating
a domain that either:

- has a name that follows this pattern:
  `[enum_table_name]_[constraint_name]_enum_domain`, or
- is that tagged with `@enum [enum_table_name]_[constraint_name]`.

For example:

```sql
create table my_enums (
  transportation text not null constraint transportation_mean unique
);

comment on constraint transportation_mean on my_enums is E'@enum';
insert into my_enums
  (transportation) values
  ('CAR'),
  ('BIKE'),
  ('SUBWAY');

-- Either follow the convention of [enum_table_name]_[constraint_name]_enum_domain:
create domain my_enums_transportation_mean_enum_domain as text;

-- Or use any name for the domain and add a smart comment referencing the enum
-- via `[enum_table_name]_[constraint_name]`:
create domain transportation as text;
comment on domain transportation is E'@enum my_enums_transportation_mean';

-- Then you can create functions that take this domain as the type of their
-- arguments or return value like in the previous example.
```

### With makeExtendSchemaPlugin

Use the standard `enum` GraphQL interface definition language (IDL/SDL) to
define your enum:

```js
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
  resolvers: {
    AnimalType: {
      CAT: "cat",
      DOG: "dog",
      FISH: "fish",
    },
    Pet: {
      type() {
        /* TODO: add logic here */
        return "cat";
      },
    },
  },
}));
```

### Other ways

You can also use the underlying Graphile Engine API to add a new
`GraphQLEnumType`.
