---
"postgraphile": patch
"grafast": patch
---

🚨 `loadOne` and `loadMany` no longer accept 2-4 arguments; instead exactly two
arguments are accepted. **There is a codeshift available** in the repository
(`shifts/loadArguments.ts`) that you can execute with `jscodeshift` (see comment
at top of file) to do this rewrite for you across your codebase. Be sure to
check the results carefully!

The first argument is unchanged, the second argument is either the loader
callback (as before) or a "loader object":

- `shared` (optional) - replaces the `unary` argument, and works as before
  except you may now also use a thunk! (See below)
- `ioEquivalence` (optional) - as before
- `load` (required) - the loader callback
- `name` (optional) - display name for the callback (will appear in plan
  diagrams)
- `paginationSupport` (optional) - only relevant to loadMany, add this to
  indicate which optimizations your loader callback supports (see the
  documentation) - for example, does it support applying a `limit`?

**The motivation for the "loader object"** is that every step that calls a given
load function should have the same `ioEquivalence`, `shared`, `name` and
`paginationSupport` - so rather than defining them in each of your plan
resolvers, we should **associate the metadata with the callback directly**.

To make this practical, `shared` (previously: `unary`) can now be a callback so
that you can create steps to provide any shared details, e.g. database or API
clients from `context()`.

Ultimately the aim is to move this boilerplate out of your plan resolvers and
instead to co-locate it with your data loading callbacks:

```diff
 function User_friends($user, { $first }) {
   const $userId = get($user, "id");
-  const $apiClient = context().get("apiClient");
-  const $collection = loadMany(
-    $userId,
-    null, // ioEquivalence
-    $apiClient, // shared (previously 'unary')
-    batchGetFriendsByUserId // load callback
-  );
+  const $collection = loadMany($userId, batchGetFriendIdsByUserId);
   $collection.setParam("limit", $first);
   return $collection;
 }

 const batchGetFriendsByUserId =
+  {
+    shared: () => context().get("apiClient"),
+    load:
       (userIds, info) => {
-        const apiClient = info.unary;
+        const apiClient = info.shared;
         /* ... */
       }
+  }
```
