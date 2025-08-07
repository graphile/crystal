# GraphQL Cursor Connection Pagination in @dataplan/pg

**THIS STEP IS NO LONGER SUPPORTED**

_Please familiarize yourself with the
[GraphQL Cursor Connections Specification](https://relay.dev/graphql/connections.htm)
before reading this._

PgPageInfoPlan allows you to retrieve:

- `hasNextPage`
- `hasPreviousPage`
- `startCursor`
- `endCursor`

for a given connection (which relates ultimately to a `PgSelectPlan`). You can
also typically request the `totalCount` via the connection directly.

Satisfying `startCursor` and `endCursor` merely involves resolving the cursors
of the returned nodes and returning the first and last ones.

As for satisfying `hasNextPage` / `hasPreviousPage` we honour the spec text and
the intent of the spec; i.e. we only figure out if there's another page in the
_current direction of pagination_ (i.e. if `first` is set then `hasNextPage`, if
`last` is set then `hasPreviousPage`) and we set the opposite field to be
`null`.

There's lots of different ways of calculating `hasNextPage` and
`hasPreviousPage` and different approaches may be more or less appropriate
depending on the situation. We should also only calculate the values that the
user has requested - if they don't request `totalCount` then calculating it
would be an unnecessary expense (and it can be very expensive if it involves a
table scan over a large table).

## Example situation

Imagine we have a table containing `s` ("size") rows. We're going to represent
the "cursor" `c` to these rows within a given ordering by the letters A-J. For
convenience lets imagine that we're dealing with a `users` table which contains
10 rows (`s` = 10), and the ordering that we've chosen results in the cursors
A-J relating to these users:

- [A]lice
- [B]ob
- [C]aroline
- [D]ave
- [E]llie
- [F]reddie
- [G]illian
- [H]arry
- [I]ndia
- [J]ames

A user can ask for rows "after" an optional cursor `a` and "before" an optional
cursor `b`. Further, within this subset, they can ask for the "first" `f` and/or
"last" `l` rows within the subset. If both `f` and `l` are specified, then `f`
applies first, then `l` applies within the subset returned.

For example:

"Give me the last 3 rows before [H]arry" (f = null, l = 3, a = null, b = H):

```
     A B C D E F G H I J
                <--|        Before H
            |E F G|         Last 3
```

"Give me the first 3 rows after [C]aroline" (f = 3, l = null, a = C, b = null):

```
     A B C D E F G H I J
         |-->               After C
          |D E F|           First 3
```

"Give me the first 3 rows" (f = 3, l = null, a = null, b = null)

```
     A B C D E F G H I J
    |-->             <--|   No cursor
    |A B C|                 First 3
```

"Give me the last 3 rows" (f = null, l = 3, a = null, b = null)

```
     A B C D E F G H I J
    |-->             <--|   No cursor
                  |H I J|   Last 3
```

"Give me the first 3 rows after [C]aroline and before [F]reddie" (f = 3, a = C,
b = F):

```
     A B C D E F G H I J
         |-->               After C
            <--|            Before F
          |D E|             First 3 (there are only 2)
```

"Give me the last 2 rows from the first 3 rows after [B]ob and before [I]ndia"
(f = 3, l = 2, a = B, b = I):

```
     A B C D E F G H I J
       |-->                 After B
                  <--|      Before I
        |C D E|             First 3 in range
          |D E|             Last 2 of these
```

To make things even hairier, we also allow _limit/offset_ pagination. To do so
we use the "first" argument as the limit, and an additional "offset" `o`
argument.

"Give me the first 3 rows, offset by 2" (f = 3, o = 2)

```
     A B C D E F G H I J
    |-->             <--|   No cursor
     X X|-->                Skip first 2 results
        |C D E|             First 3 in range
```

To keep things simple we have the following rule:

**RULE**: **When using the `offset` argument, neither `before`, `after` nor
`last` may be specified** - you must strictly use "limit/offset pagination" or
"cursor pagination" but not both. This means that if `o` is not null then
`l = a = b = null`.

**NOTE**: in all these cases, the results returned always follow the order
specified (A-J) - even if you say "last 3 before H" the result is `E F G` not
`G F E`. This is a requirement of the GraphQL Cursor Connections specification.

**NOTE**: in all these cases, `hasNextPage` always means "is there more cursors
to the right" and `hasPreviousPage` means "is there more cursors to the left"
(again, this is as specified in the GraphQL Cursor Connections specification).

## Trivial results

### Arguments

Things we can derive from the arguments themselves without consulting the
database.

#### If "last" < 0; throw

Invalid.

#### If "first" < 0; throw

Invalid.

#### If "last" = 0 or "first" = 0; undefined - set next/last = false

This is generally seen as a user error; however we want to maintain it for
backwards compatibility.

You're effectively dividing by zero... which doesn't really make sense. There's
no new cursor you can use to paginate forwards/backwards; therefore we're going
to say there are no previous/next pages.

#### If "offset" and any of "last", "after" or "before" are set; throw

User may only perform limit/offset pagination or cursor pagination, not both.

#### If "first" and "last" are both set and "last" >= "first" then ignore "last"

The Cursor Connections spec states that "first" is evaluated first, then "last"
filters the remaining matches. If `l >= f` then no further filtering will be
performed, so this is equivalent to `l = null`.

#### If "offset" is greater than 0 then there's a previous page

The previous page would have any smaller offset. Doesn't really matter if
there's actually data present or not.

#### If no "offset", no "first"/"last" and no "before"/"after" then no other pages

If `o` is null and `f` is null and `l` is null and `a` is null and `b` is null
then there can be no next/previous page since you're already fetching
everything.

#### If no "offset", no "after" and "last" is not specified, then no previous page

If `o` is null and `a` is null and `l` is null then there can be no previous
page since you're starting the fetch at the beginning.

#### If "before" is not set, and "first" is not set, then no next page

If `b` is null and `f` is null then there can be no next page since you have no
upper bound.

## Remaining strategies

Assuming none of the above apply, we need to figure out whether there is a
previous/next page.

It's highly recommended that you read the algorithm in the spec before reading
this section:
https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo.Fields

### `hasPreviousPage`

Assumption: `offset` is not set (or is zero).

#### If `last` is set:

Assumption: `first` is not set, or `first > last`.

We're paginating backwards through the set. We need to determine if there's more
than `last` records between `after` (or the start) and `before` (or the end). To
do this, here's some options:

1. if `totalCount` is calculated and neither `after` nor `before` are set, then:
   `hasPreviousPage = totalCount > last`. _(0 additional queries)_
1. fetch `last` matching rows; if fewer than `last` rows are returned, then
   `false`, otherwise apply a different strategy. _(0+ additional queries)_
1. instead of selecting `last` records, select `last+1` records and throw the
   extra away - if it existed then we know there's a previous page, otherwise
   there isn't. This might be expensive if the selection query is expensive. _(0
   additional queries)_
1. as above, but using a CTE that does `select *` with the `last+1` records
   (works around the expensive selection set problem). _(0 additional queries)_
1. do a separate query with a cheap selection set (e.g. `select 1`) and see if
   `last+1` rows exist
   (`select 1 from <source> where <filters> and <"before" condition> limit <last + 1>`).
   _(1 additional query)_

Which of these options to select depends on the circumstances. The first option
should always be leveraged when it's applicable because it saves further
calculation, but failing that... play it by ear.

#### If `last` is not set:

Assumption: `after` is set.

Determining if you have a previous page can be determined via an `EXISTS`
subquery seeing if anything exists "before or matching the after"; something
like:

```sql
select exists(
  select 1
  from <source>
  where <filters>
  and <inverse of "after" condition>
) as has_previous_page
```

Note: the spec states

> If the server can efficiently determine that elements exist prior to after,
> return true. [Otherwise] return false.

So if we have to do extra work then it's acceptable to return `false` in all
cases.

Current strategy: return `false` in all cases.

### `hasNextPage`

This is basically the same strategy as `hasPreviousPage`, but swapping `first`
for `last` and `after` for `before`. The `first > last` assumption may need
adjustment.

## Taking the easy way out

After reading up on https://github.com/graphql/graphql-relay-js/issues/58 it
became clear that in general the Cursor Connections Spec only cares about
`hasNextPage` when paginating "forwards" (i.e. when `first` is set), and only
cares about `hasPreviousPage` when paginating backwards (i.e. when `last` is
set). (And if both are set then it doesn't care about either.)

It has become much more clear that the intent is that you fetch an extra node,
and if it exists then you can set `true` otherwise you set `false`. This is
option 3 from the "If last is set" list above; so we're going to go with that
initially but we may want to revise this in future.
