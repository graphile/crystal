---
sidebar_position: 1
---

# Codecs

A `PgCodec` ("codec") represents a type (data type) in the database. There are
loads of built in codecs for dealing with the builtin types in Postgres made
available via the [`TYPES` export](#TYPES), but you can also create your own
codecs for other types using the various helpers.

Every codec has a `name`, which is a handy identifier for you to use to
reference it (you can reference codecs from the registry via
`registry.pgCodecs[name]`). A codec also has an `identifier` which is the name
of the type in the database.

Codecs are responsible for performing coercion and validation; they should
throw errors if the value supplied is invalid.

## `TYPES`

```ts
import { TYPES } from "@dataplan/pg";

const intCodec = TYPES.int;
```

The `TYPES` object comprises a number of builtin codecs for common types in your
database; the following keys on `TYPES` represent the similarly named database
types (e.g. `TYPES.boolean` represents the `bool` type):

<ul style={{columnWidth: '10em'}}>
<li>boolean</li>
<li>int2</li>
<li>int</li>
<li>bigint</li>
<li>float4</li>
<li>float</li>
<li>money</li>
<li>numeric</li>
<li>char</li>
<li>bpchar</li>
<li>varchar</li>
<li>text</li>
<li>name</li>
<li>json</li>
<li>jsonb</li>
<li>xml</li>
<li>citext</li>
<li>uuid</li>
<li>timestamp</li>
<li>timestamptz</li>
<li>date</li>
<li>time</li>
<li>timetz</li>
<li>inet</li>
<li>regproc</li>
<li>regprocedure</li>
<li>regoper</li>
<li>regoperator</li>
<li>regclass</li>
<li>regtype</li>
<li>regrole</li>
<li>regnamespace</li>
<li>regconfig</li>
<li>regdictionary</li>
<li>cidr</li>
<li>macaddr</li>
<li>macaddr8</li>
<li>interval</li>
<li>bit</li>
<li>varbit</li>
<li>point</li>
<li>line</li>
<li>lseg</li>
<li>box</li>
<li>path</li>
<li>polygon</li>
<li>circle</li>
<li>hstore</li>
<li>void</li>
</ul>

## recordCodec(config)

`recordCodec` is a helper function that returns a PgCodec representing a
"composite type" (or "record") - a structured type with attributes. This is
most commonly used when defining a table (the "attributes" in this case being
which columns it has), but is also useful in other cases.

The record codec config should contain:

- `name: string` - the name to use for this codec
- `identifier: SQL` - the database name for this type
- `attributes: Record<string, PgCodecAttribute>` - the attributes (columns) on this codec; the keys on this object are the attribute names, and the values are objects with the following options:
  - `codec: PgCodec` - the PgCodec that details the type of this attribute
  - `notNull: boolean` (optional) - if true, indicates that the column cannot be null
  - `hasDefault: boolean` (optional) - if true, indicates that the column has a default (and
    thus may be omitted from `INSERT` operations)
  - `expression(alias: SQL): SQL` (optional) - indicates that this attribute is not a real
    attribute, but instead a computed value that can be computed using the given
    expression
- `polymorphism` (extremely optional) - see [polymorphism](../polymorphism.md)

### Example

```ts
const forumCodec = recordCodec({
  name: "forums",
  identifier: sql`app_public.forums`,
  attributes: {
    id: {
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
    },
    name: {
      codec: TYPES.citext,
      notNull: true,
    },
    archived_at: {
      codec: TYPES.timestamptz,
    },
    is_archived: {
      codec: TYPES.boolean,
      expression(alias) {
        return sql`${alias}.archived_at is not null`;
      },
    },
  },
});
```

## listOfCodec(innerCodec, config = {})

`listOfCodec` returns a new codec that represents a list (array) of the given
`innerCodec`. Optionally you may provide details about this codec:

- `identifier` - the database name for this type

### Example

For example, in this hypothetical E-commerce scenario, `listOfCodec` is used
in combination with the `$pgSelect.placeholder()` method to return a SQL
expression that allows the transformed list of `$orderIds` to be referenced
inside the step for selecting the associated order items.

```ts
const $orders = orders.find({
  customer_id: context().get("customerId"),
});

const $orderIds = applyTransforms(each($orders, ($order) => $order.get("id")));

const $orderItems = registry.pgResources.order_items.find();

$orderItems.where(
  sql`${$orderItems}.order_id = ANY (${$orderItems.placeholder(
    $orderIds,
    listOfCodec(TYPES.uuid),
  )})`,
);
```

## rangeOfCodec(innerCodec, name, identifier)

`rangeOfCodec` returns a new codec that represents a range of the given
`innerCodec`. You must specify the `name` and `identifier` to use for this
codec.

## Custom scalar codecs

Should you need to define more scalar codecs than those available via `TYPES`, you may create a PgCodec object representing them. The object can have the following properties:

- `name: string` (required) - the name to use for this codec
- `sqlType: string` (required) - the `identifier` for this codec, the SQL fragment that represents the name of the type in the database
- `fromPg` - optional callback function that, given the textual representation from postgres, returns the internal representation for the value to use in JavaScript
- `toPg` - optional callback function that, given the internal representation used in JavaScript, returns the value to insert into an SQL statement - this should be a simple scalar (text, etc) that can be cast by postgres
- `attributes` - see `recordCodec` instead
- `polymorphism` - see [polymorphism](../polymorphism.md)
