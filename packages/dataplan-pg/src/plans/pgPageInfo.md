# GraphQL Cursor Connection Pagination in @dataplan/pg

_Please familiarize yourself with the
[GraphQL Cursor Connections Specification](https://relay.dev/graphql/connections.htm)
before reading this._

PgPageInfoPlan allows you to retrieve:

- `hasNextPage`
- `hasPreviousPage`
- `totalCount`

for a given connection (which relates ultimately to a `PgSelectPlan`).

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
    |-->                    No cursor
    |A B C|                 First 3
```

"Give me the last 3 rows" (f = null, l = 3, a = null, b = null)

```
     A B C D E F G H I J
                     <--|   No cursor
                  |H I J|   Last 3
```

"Give me the first 3 rows after [C]aroline and before [F]reddie" (f = 3, l =
null, a = C, b = F):

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

"Give me the first 3 rows, offset by 2" (f = 3, o = 2, l = null, a = null, b =
null)

```
     A B C D E F G H I J
    |-->                    No cursor
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

#### If "last" is set, "before" is not set, and "first" is not set, then no next page

**NOTE**: `l` is not null implies `o` is null.

If `b` is null and `f` is null and `l` is not null then there can be no next
page since you're starting the fetch at the end.
