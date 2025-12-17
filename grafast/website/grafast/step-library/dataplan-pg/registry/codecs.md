---
sidebar_position: 1
---

# Codecs

A `PgCodec` ("codec") represents a type (data type) in the database. There are
loads of built in codecs for dealing with the built-in types in Postgres made
available via the [`TYPES` export](#types), but you can also create your own
codecs for other types using the various helpers.

Every codec has a `name`, which is a handy identifier for you to use to
reference it (you can reference codecs from the registry via
`registry.pgCodecs[name]`). A codec also has an `sqlType` which is an SQL
expression giving the name
of the type in the database.

Codecs are responsible for performing coercion and validation; they should
throw errors if the value supplied is invalid.

## `TYPES`

```ts
import { TYPES } from "@dataplan/pg";

const intCodec = TYPES.int;
```

The `TYPES` object comprises a number of built-in codecs for common types in your
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

## `recordCodec(config)`

`recordCodec` is a helper function that returns a PgCodec representing a
"composite type" (or "record") - a structured type with attributes. This is
most commonly used when defining a table (the "attributes" in this case being
which columns it has), but is also useful in other cases.

The record codec config should contain:

- `name: string` - the name to use for this codec
- `identifier: SQL` - an SQL fragment detailing the name of the type in the
  database
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

## `listOfCodec(innerCodec, config = {})`

`listOfCodec` returns a new codec that represents a list (array) of the given
`innerCodec`. Optionally you may provide details about this codec:

- `identifier` - the (SQL) database name for this type

### Example

For example, in this hypothetical E-commerce scenario, `listOfCodec` is used
in combination with the `$pgSelect.placeholder()` method to return a SQL
expression that allows the transformed list of `$orderIds` to be referenced
inside the step for selecting the associated order items.

```ts
const $customerId = context().get("customerId");
const $orders = orders.find({ customer_id: $customerId });
const $orderIds = applyTransforms(each($orders, ($order) => $order.get("id")));
const $orderItems = registry.pgResources.order_items.find();
$orderItems.where(
  // highlight-start
  sql`${$orderItems}.order_id = ANY (${$orderItems.placeholder(
    $orderIds,
    listOfCodec(TYPES.uuid),
  )})`,
  // highlight-end
);
```

## `rangeOfCodec(innerCodec, name, identifier)`

`rangeOfCodec` returns a new codec that represents a range of the given
`innerCodec`. You must specify the `name` and `identifier` to use for this
codec.

## Custom scalar codecs

Should you need to define more scalar codecs than those available via `TYPES`,
you may create a PgCodec object representing them. The object can have the
following properties:

```ts
/**
 * A codec for a Postgres type, tells us how to convert to-and-from Postgres
 * (including changes to the SQL statement itself). Also includes metadata
 * about the type.
 */
export interface PgScalarCodec<
  TName extends string = string,
  TFromPostgres = any,
  TFromJavaScript = TFromPostgres,
> {
  /**
   * Unique name to identify this codec.
   */
  name: TName;

  /**
   * When we have an expression of this type, we can safely cast it within
   * Postgres using the cast `(${expression})::${sqlType}` to make the type
   * explicit.
   */
  sqlType: SQL;

  /**
   * If this codec came from a specific database, specify the executor here. If
   * the codec is used with multiple databases (or if unsure), set this null.
   */
  executor: PgExecutor | null;

  /**
   * Given a value of type TFromJavaScript, returns an `SQL` value to insert into an SQL
   * statement.
   *
   * **IMPORTANT**: nulls must already be handled!
   */
  toPg: PgEncode<TFromJavaScript>;

  /**
   * Given a text value from PostgreSQL, returns the value cast to TCanonical.
   *
   * **IMPORTANT**: nulls must already be handled!
   */
  fromPg: PgDecode<TFromJavaScript, TFromPostgres>;

  /**
   * We'll append `::text` by default to each selection; however if this type
   * needs something special (e.g. `money` should be converted to `numeric`
   * before being converted to `text`) then you can provide this custom
   * callback to provide your own casting - this could even include function
   * calls if you want.
   */
  castFromPg?: (fragment: SQL, guaranteedNotNull?: boolean) => SQL;

  /**
   * If you provide `castFromPg` you probably ought to also specify
   * `listCastFromPg` so that a list of this type can be converted properly.
   */
  listCastFromPg?: (fragment: SQL, guaranteedNotNull?: boolean) => SQL;

  /**
   * True if this type is a binary type (e.g. bytea)
   */
  isBinary?: boolean;

  /**
   * True if doing an equality check for this value would have intuitive
   * results for a human. E.g. `3.0` and `3.0000` when encoded as `float` are
   * the same as a human would expect, so `float` has natural equality. On the
   * other hand Postgres sees the `json` `{"a":1}` as different to
   * `{ "a": 1 }`), whereas a human would see these as the same JSON objects,
   * so `json` does not have natural equality.
   *
   * Typically true primitives will set this true.
   */
  hasNaturalEquality?: boolean;

  /**
   * True if this type has a natural ordering that would be intuitive for a human.
   * For example numbers and text have natural ordering, whereas `{"a":1}` and
   * `{ "a": 2 }` are not so obvious. Similarly, a `point` could be ordered in many
   * ways relative to another point (x-first, then y; y-first, then x; distance
   * from origin first, then angle; etc) so do not have natural order.
   *
   * Typically true primitives will set this true.
   */
  hasNaturalOrdering?: boolean;

  description?: string;

  /**
   * Arbitrary metadata
   */
  extensions?: Partial<PgCodecExtensions>;
}
```
