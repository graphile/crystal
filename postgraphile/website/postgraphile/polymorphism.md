---
title: Polymorphism
---

# Polymorphism in PostGraphile

Polymorphism in PostgreSQL schemas can take many forms. For PostGraphile to
detect and generate GraphQL interfaces and unions (rather than regular object
types) from your database tables, you need to provide PostGraphile some hints
or instructions; one way to do this is with smart tags. Which smart tags to
apply will depend on what shape your data is.

:::tip

Under the hood, PostGraphile polymorphism is powered by
[@dataplan/pg's polymorphism](https://grafast.org/grafast/step-library/dataplan-pg/polymorphism);
some restrictions may apply to what PostGraphile generates for polymorphic
types and fields based on what `@dataplan/pg` supports.

:::

## @interface mode:single

In the simplest case you have a single table that represents all of your
possible polymorphic types, perhaps using a 'type' column or similar to
indicate the underlying type. For this style, you should:

- add the `@interface`
  smart tag to the table, with `mode:single` and the name of the type column indicated via the
  `type:` parameter.
- add `@type` smart tags to the table for each possible value of the `type` column

For example you might have a table like this one:

```sql
create type polymorphic.item_type as enum (
  'TOPIC',
  'POST',
  'DIVIDER',
  'CHECKLIST',
  'CHECKLIST_ITEM'
);

create table polymorphic.single_table_items (
  id serial primary key,

  -- Rails-style polymorphic column
  type polymorphic.item_type not null default 'POST'::polymorphic.item_type,

  -- Shared attributes:
  parent_id int references polymorphic.single_table_items on delete cascade,
  root_topic_id int constraint single_table_items_root_topic_fkey references polymorphic.single_table_items on delete cascade,
  author_id int not null references polymorphic.people on delete cascade,
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

To have PostGraphile generate an interface for this table, you might use a comment such as:

```sql
comment on table polymorphic.single_table_items is $$
  @interface mode:single type:type
  @type TOPIC name:SingleTableTopic attributes:title
  @type POST name:SingleTablePost attributes:title,description,note
  @type DIVIDER name:SingleTableDivider attributes:title,color
  @type CHECKLIST name:SingleTableChecklist attributes:title
  @type CHECKLIST_ITEM name:SingleTableChecklistItem attributes:description,note
  $$;
```

The `@type` tags take the value of the `type` column as the first argument and
then accept `name:` and `attributes:` arguments; `name` being the name to create
the GraphQL object type with and `attributes:` to be a comma-separated list of any
columns that are specific to this type (and shouldn't be on the main
interface).

:::tip

The `type` column doesn't have to be an enum, any string-y type is fine but do
ensure that all possible values it can have are declared in your `@type` smart
tags!

:::

## @interface mode:relational

A slightly more complex case is having a table that defines the common fields
as above, but then you join in additional data from other tables in a
relational manner. This is similar to the above, but we use `mode:relational`
and the `@type` tags declare the table that each type `references` rather than
the columns that are specific to that type.

For example, for the following set of related relationally-polymorphic tables:

```sql
create table polymorphic.relational_items (
  id serial primary key,

  -- This column is used to tell us which table we need to join to
  type polymorphic.item_type not null default 'POST'::polymorphic.item_type,

  -- Shared attributes (also 'id'):
  parent_id int references polymorphic.relational_items on delete cascade,
  root_topic_id int, -- constraint being created below
  author_id int not null references polymorphic.people on delete cascade,
  position bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_explicitly_archived bool not null default false,
  archived_at timestamptz
);

create table polymorphic.relational_topics (
  id int primary key references polymorphic.relational_items,
  title text not null
);
alter table polymorphic.relational_items add constraint relational_items_root_topic_fkey foreign key (root_topic_id) references polymorphic.relational_topics on delete cascade;
create table polymorphic.relational_posts (
  id int primary key references polymorphic.relational_items,
  title text not null,
  description text default '-- Enter description here --',
  note text
);
create table polymorphic.relational_dividers (
  id int primary key references polymorphic.relational_items,
  title text,
  color text
);
create table polymorphic.relational_checklists (
  id int primary key references polymorphic.relational_items,
  title text not null
);
create table polymorphic.relational_checklist_items (
  id int primary key references polymorphic.relational_items,
  description text not null,
  note text
);
```

You might use a comment such as this one:

```sql
comment on table polymorphic.relational_items is $$
  @interface mode:relational type:type
  @type TOPIC references:relational_topics
  @type POST references:relational_posts
  @type DIVIDER references:relational_dividers
  @type CHECKLIST references:relational_checklists
  @type CHECKLIST_ITEM references:relational_checklist_items
  $$;
```

## @interface mode:union

Sometimes you might have multiple independent tables that you want to be part
of an interface, for this you can define a composite type that declares the
shared attributes, and then add the `@interface` smart tag to this composite
type, with `mode:union` (this is an SQL `union`, not a GraphQL `union`!).

For example, imagine that we have a table for AWS applications and a table for
GCP applications (and maybe more for other cloud providers):

```sql
create table polymorphic.aws_applications (
  id int primary key,
  name text not null,
  last_deployed timestamptz,
  person_id int references polymorphic.people,
  organization_id int references polymorphic.organizations,
  aws_id text
);

create table polymorphic.gcp_applications (
  id int primary key,
  name text not null,
  last_deployed timestamptz,
  person_id int references polymorphic.people,
  organization_id int references polymorphic.organizations,
  gcp_id text
);
```

To have all of these tables implement the `Application` interface, we might
add the following to our database:

```sql
-- Declare a composite type to detail the common fields
create type polymorphic.applications as (
  id int,
  name text,
  last_deployed timestamptz
);

-- Mark this composite type as an interface named Application
comment on type polymorphic.applications is $$
  @interface mode:union
  @name Application
  $$;

-- Have our tables implement this interface
comment on table polymorphic.aws_applications is $$
  @implements Application
  $$;
comment on table polymorphic.gcp_applications is $$
  @implements Application
  $$;
```

## @unionMember

For cases where you want multiple tables that don't necessarily share any
fields or relations to be part of a GraphQL union, you can give them the
`@unionMember` smart tag.

For example, consider these independent tables:

```sql
create table polymorphic.people (
  person_id serial primary key,
  username text not null unique
);

create table polymorphic.organizations (
  organization_id serial primary key,
  name text not null unique
);
```

We could define a union that contains them both via:

```sql
comment on table polymorphic.people is $$
  @unionMember PersonOrOrganization
  $$;
comment on table polymorphic.organizations is $$
  @unionMember PersonOrOrganization
  $$;
```

And we could reference this type from an `@ref` smart tag; for example:

```sql
create table polymorphic.log_entries (
  id serial primary key,
  person_id int references polymorphic.people on delete cascade,
  organization_id int references polymorphic.organizations on delete cascade,
  text text not null,
  constraint owned_by_person_or_organization check ((person_id is null) <> (organization_id is null))
);

comment on table polymorphic.log_entries is $$
  @ref author to:PersonOrOrganization singular
  @refVia author via:(person_id)->people(person_id)
  @refVia author via:(organization_id)->organizations(organization_id)
  $$;
```

Now `LogEntry.author` will be a `PersonOrOrganization` by following the given relationships.

:::tip

Since the `log_entries` table only has one reference to `people` and one to
`organizations` we can use a shorthand for the `via:`s:

```sql
comment on table polymorphic.log_entries is $$
  @ref author to:PersonOrOrganization singular
  @refVia author via:people
  @refVia author via:organizations
  $$;
```

:::
