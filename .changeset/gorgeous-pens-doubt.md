---
"grafast": patch
---

Allow destructuring steps directly from FieldArgs for more convenient plan
resolvers.

Example:

```diff
 const plans = {
   Mutation: {
-    updateUser(_, fieldArgs) {
-      const $id = fieldArgs.getRaw(['input', 'id']);
-      const $username = fieldArgs.getRaw(['input', 'patch', 'username']);
-      const $bio = fieldArgs.getRaw(['input', 'patch', 'bio']);
+    updateUser(_, { $input: { $id, $patch: { $username, $bio } } }) {
       return pgUpdateSingle(
         usersResource,
         { id: $id },
         { username: $username, bio: $bio }
       );
     }
```
