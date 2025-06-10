# pgUnionAll

If you need to pull data from multiple tables and cannot use joins to do so,
then `pgUnionAll` is your friend.

This step class uses the SQL `UNION ALL` construct to select a number
(including zero, which is a good number for GraphQL unions :wink:) of fields
from a one or more different tables that might all be part of the same union or
interface in GraphQL.

You may specify a list of shared fields, and if so then you can order by these
shared fields, or apply conditions to them, and we'll pass these orders and
conditions down to the individual table selects (as part of the `UNION ALL`) to
ensure that we get the results in the most efficient manner. You can of course
still select fields that are not shared using the normal GraphQL typed fragment
spreading mechanism.

:::warning

Right now these shared fields must match name and type exactly on each source
in the union (we don't check this, but unexpected errors may occur at runtime
if you don't adhere to it). There's definitely scope to soften these
requirements - get in touch if this is something you need.

:::

`pgUnionAll` is polymorphic-capable (but it doesn't
have to be polymorphic!) and supports both limit/offset and cursor pagination.

## pgUnionAll function

The `pgUnionAll` function accepts one argument - the `PgUnionAllStepConfig`.
This configuration object has the following entries:

- `resourceByTypeName` - (required) a map from GraphQL type name to the relevant
  `PgResource` from which matching records can be fetched.
- `members` - (optional) a list of details of the sources and relationship
  paths to combine in the `union all` statement; each entry in `members` will
  become another `union all`'d `select` statement. If unspecified, we'll generate
  members for you based on `resourceByTypeName`.
  - TODO: document subkeys of members
- `attributes` - (optional) an object defining the available common attributes
  (if any) as a map from the attribute name to a specification object
  containing the `codec` to use for the attribute; this is generally used with
  GraphQL interfaces
- `mode` - (optional) `normal` for normal mode (default), or `aggregate` for
  performing aggregates (such as `count(*)`)

:::note

Every `source` must have the same `executor`, whether the source is defined
explicitly, or implicitly by following the given relationships.

Every final `source` (the source found at the end of any relationship paths)
must have a primary key (an entry in `source.uniques` with
`isPrimary === true`) that can be used to fetch the resulting record that
matches the entry in the union.

:::

## Applying conditions

Conditions can be applied to the resulting step via the `.where()` method,
which accepts an object containing the following keys:

- `attribute` - the (string) name of the attribute from the `pgUnionAll`
  `attributes` to apply the condition against
- `callback` - a callback function, invoked for each union source and passed
  the alias for that source, that should return an SQL fragment expressing the
  condition.

:::note

`callback` will be called for each entry in `members` since each source is
responsible for adding its own conditions.

:::

## Custom ordering

The order of the union can be specified via the `.orderBy()` method,
which accepts an object containing the following keys:

- `attribute` - the (string) name of the attribute from the `pgUnionAll`
  `attributes` to use for ordering.
- `direction` - either `ASC` for ascending order, or `DESC` for descending
  order. All other values have undefined results that may change in a patch
  release.

:::note

Every entry in `members` will be ordered, and the `union all` will be ordered again
to ensure a stable ordering result.

:::

## Pagination

Limit/offset pagination can be accomplished via `.setFirst($n)` and
`.setOffset($n)`. `pgUnionAll` also implements the relevant interfaces to
support the [`connection`](../standard-steps/connection.md) step for cursor
pagination.

## Example

```ts
const $vulnerabilities = pgUnionAll({
  executor: firstPartyVulnerabilitiesResource.executor,
  resourceByTypeName: {
    FirstPartyVulnerability: firstPartyVulnerabilitiesResource,
    ThirdPartyVulnerability: thirdPartyVulnerabilitiesResource,
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

## pgUnionAll SQL explained

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
