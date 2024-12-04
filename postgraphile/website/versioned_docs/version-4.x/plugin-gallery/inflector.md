---
sidebar_position: 1
---

# Inflector Plugins

Below you'll find some small plugins that people have written. Larger plugins likely have their own dedicated repositories, these are typically just examples of how to achieve a small goal.

_This is a work in progress, in future these plugins will be automatically tested but we've not got quite that far yet, so my apologies if you come across any issues._

## PgRenamePatchToPatchSetPlugin

```ts
/**
 * Simply renames the `UserPatch` and `PostPatch` type names to be called
 * `UserPatchSet` and `PostPatchSet` instead.
 *
 * Not particularly useful, just an example. ('PatchSet' chosen to minimise
 * diff to make example clearer.)
 *
 * Replaces this inflector:
 * https://github.com/graphile/graphile-engine/blob/f3fb3878692c6959e481e517375da66503428dc5/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L309-L311
 */
module.exports = function PgRenamePatchToPatchSetPlugin(builder) {
  builder.hook("inflection", (inflector) => ({
    // Retain the existing inflectors
    ...inflector,

    // Override the patchType inflector
    patchType(typeName) {
      // return this.upperCamelCase(`${typeName}-patch`);
      return this.upperCamelCase(`${typeName}-patch-set`);
    },
  }));
};
```

Resulting GraphQL Schema diff:

```diff
--- Original GraphQL Schema
+++ Modified GraphQL Schema
@@ -979,7 +979,7 @@
 """
 Represents an update to a `Forum`. Fields that are set will be updated.
 """
-input ForumPatch {
+input ForumPatchSet {
   id: Int

   """An URL-safe alias for the `Forum`."""
@@ -1573,7 +1573,7 @@
 }

 """Represents an update to a `Post`. Fields that are set will be updated."""
-input PostPatch {
+input PostPatchSet {
   """The body of the `Topic`, which Posts reply to."""
   body: Html
 }
@@ -2043,7 +2043,7 @@
 """
 Represents an update to a `QuizEntryAnswer`. Fields that are set will be updated.
 """
-input QuizEntryAnswerPatch {
+input QuizEntryAnswerPatchSet {
   id: Int
   quizEntryId: Int
   question: String
@@ -2118,7 +2118,7 @@
 """
 Represents an update to a `QuizEntry`. Fields that are set will be updated.
 """
-input QuizEntryPatch {
+input QuizEntryPatchSet {
   id: Int
   userId: Int
   quizId: Int
@@ -2134,7 +2134,7 @@
 }

 """Represents an update to a `Quiz`. Fields that are set will be updated."""
-input QuizPatch {
+input QuizPatchSet {
   id: Int
   name: String
   updatedAt: Datetime
@@ -2317,7 +2317,7 @@
 """
 Represents an update to a `Topic`. Fields that are set will be updated.
 """
-input TopicPatch {
+input TopicPatchSet {
   id: Int
   forumId: Int
   authorId: Int
@@ -2394,7 +2394,7 @@
   """
   An object where the defined keys will be set on the `Forum` being updated.
   """
-  patch: ForumPatch!
+  patch: ForumPatchSet!
 }

 """All input for the `updateForumBySlug` mutation."""
@@ -2408,7 +2408,7 @@
   """
   An object where the defined keys will be set on the `Forum` being updated.
   """
-  patch: ForumPatch!
+  patch: ForumPatchSet!

   """An URL-safe alias for the `Forum`."""
   slug: String!
@@ -2425,7 +2425,7 @@
   """
   An object where the defined keys will be set on the `Forum` being updated.
   """
-  patch: ForumPatch!
+  patch: ForumPatchSet!
   id: Int!
 }

@@ -2468,7 +2468,7 @@
   """
   An object where the defined keys will be set on the `Post` being updated.
   """
-  patch: PostPatch!
+  patch: PostPatchSet!
 }

 """All input for the `updatePost` mutation."""
@@ -2482,7 +2482,7 @@
   """
   An object where the defined keys will be set on the `Post` being updated.
   """
-  patch: PostPatch!
+  patch: PostPatchSet!
   id: Int!
 }

@@ -2531,7 +2531,7 @@
   """
   An object where the defined keys will be set on the `Quiz` being updated.
   """
-  patch: QuizPatch!
+  patch: QuizPatchSet!
 }

 """All input for the `updateQuizEntryAnswerByNodeId` mutation."""
@@ -2550,7 +2550,7 @@
   """
   An object where the defined keys will be set on the `QuizEntryAnswer` being updated.
   """
-  patch: QuizEntryAnswerPatch!
+  patch: QuizEntryAnswerPatchSet!
 }

 """All input for the `updateQuizEntryAnswer` mutation."""
@@ -2564,7 +2564,7 @@
   """
   An object where the defined keys will be set on the `QuizEntryAnswer` being updated.
   """
-  patch: QuizEntryAnswerPatch!
+  patch: QuizEntryAnswerPatchSet!
   id: Int!
 }

@@ -2610,7 +2610,7 @@
   """
   An object where the defined keys will be set on the `QuizEntry` being updated.
   """
-  patch: QuizEntryPatch!
+  patch: QuizEntryPatchSet!
 }

 """All input for the `updateQuizEntry` mutation."""
@@ -2624,7 +2624,7 @@
   """
   An object where the defined keys will be set on the `QuizEntry` being updated.
   """
-  patch: QuizEntryPatch!
+  patch: QuizEntryPatchSet!
   id: Int!
 }

@@ -2668,7 +2668,7 @@
   """
   An object where the defined keys will be set on the `Quiz` being updated.
   """
-  patch: QuizPatch!
+  patch: QuizPatchSet!
   id: Int!
 }

@@ -2711,7 +2711,7 @@
   """
   An object where the defined keys will be set on the `Topic` being updated.
   """
-  patch: TopicPatch!
+  patch: TopicPatchSet!
 }

 """All input for the `updateTopic` mutation."""
@@ -2725,7 +2725,7 @@
   """
   An object where the defined keys will be set on the `Topic` being updated.
   """
-  patch: TopicPatch!
+  patch: TopicPatchSet!
   id: Int!
 }

@@ -2774,7 +2774,7 @@
   """
   An object where the defined keys will be set on the `UserAuthentication` being updated.
   """
-  patch: UserAuthenticationPatch!
+  patch: UserAuthenticationPatchSet!
 }

 """
@@ -2790,7 +2790,7 @@
   """
   An object where the defined keys will be set on the `UserAuthentication` being updated.
   """
-  patch: UserAuthenticationPatch!
+  patch: UserAuthenticationPatchSet!

   """The login service used, e.g. `twitter` or `github`."""
   service: String!
@@ -2810,7 +2810,7 @@
   """
   An object where the defined keys will be set on the `UserAuthentication` being updated.
   """
-  patch: UserAuthenticationPatch!
+  patch: UserAuthenticationPatchSet!
   id: Int!
 }

@@ -2853,7 +2853,7 @@
   """
   An object where the defined keys will be set on the `User` being updated.
   """
-  patch: UserPatch!
+  patch: UserPatchSet!
 }

 """All input for the `updateUserByUsername` mutation."""
@@ -2867,7 +2867,7 @@
   """
   An object where the defined keys will be set on the `User` being updated.
   """
-  patch: UserPatch!
+  patch: UserPatchSet!

   """Public-facing username (or 'handle') of the user."""
   username: String!
@@ -2889,7 +2889,7 @@
   """
   An object where the defined keys will be set on the `UserEmail` being updated.
   """
-  patch: UserEmailPatch!
+  patch: UserEmailPatchSet!
 }

 """All input for the `updateUserEmailByUserIdAndEmail` mutation."""
@@ -2903,7 +2903,7 @@
   """
   An object where the defined keys will be set on the `UserEmail` being updated.
   """
-  patch: UserEmailPatch!
+  patch: UserEmailPatchSet!
   userId: Int!

   """The users email address, in `a@b.c` format."""
@@ -2921,7 +2921,7 @@
   """
   An object where the defined keys will be set on the `UserEmail` being updated.
   """
-  patch: UserEmailPatch!
+  patch: UserEmailPatchSet!
   id: Int!
 }

@@ -2962,7 +2962,7 @@
   """
   An object where the defined keys will be set on the `User` being updated.
   """
-  patch: UserPatch!
+  patch: UserPatchSet!

   """Unique identifier for the user."""
   id: Int!
@@ -3167,7 +3167,7 @@
 """
 Represents an update to a `UserAuthentication`. Fields that are set will be updated.
 """
-input UserAuthenticationPatch {
+input UserAuthenticationPatchSet {
   id: Int

   """The login service used, e.g. `twitter` or `github`."""
@@ -3273,7 +3273,7 @@
 """
 Represents an update to a `UserEmail`. Fields that are set will be updated.
 """
-input UserEmailPatch {
+input UserEmailPatchSet {
   id: Int
   userId: Int

@@ -3355,7 +3355,7 @@
 }

 """Represents an update to a `User`. Fields that are set will be updated."""
-input UserPatch {
+input UserPatchSet {
   """Unique identifier for the user."""
   id: Int

```

## PgShortenAllRowsInflectorPlugin

```ts
/**
 * Simply renames the `allUsers` and `allPosts` Query fields to `users` and
 * `posts` respectively.
 *
 * Not particularly useful, just an example.
 *
 * Replaces this inflector:
 * https://github.com/graphile/graphile-engine/blob/f3fb3878692c6959e481e517375da66503428dc5/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L460-L464
 */
module.exports = function PgShortenAllRowsInflectorPlugin(builder) {
  builder.hook("inflection", (inflector) => ({
    // Retain the existing inflectors
    ...inflector,

    // Override the allRows inflector
    allRows(table) {
      return this.camelCase(
        // Was: `all-${this.pluralize(this._singularizedTableName(table))}`
        // Now:
        this.pluralize(this._singularizedTableName(table)),
      );
    },
  }));
};
```
