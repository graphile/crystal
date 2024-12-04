---
sidebar_position: 4
---

# Customisation

Below you'll find some small plugins that people have written. Larger plugins likely have their own dedicated repositories, these are typically just examples of how to achieve a small goal.

_This is a work in progress, in future these plugins will be automatically tested but we've not got quite that far yet, so my apologies if you come across any issues._

## OmitMutationsByDefaultPlugin

```ts
/**
 * This plugin treats any table that doesn't have an `@omit` comment as if it
 * had `@omit create,update,delete` (thereby disabling mutations).
 *
 * Override it by adding a smart comment to the table. To restore all
 * mutations, do `COMMENT ON my_table IS E'@omit :';` (the `:` is special
 * syntax for "nothing").
 */
module.exports = function OmitMutationsByDefaultPlugin(builder) {
  builder.hook("build", (build) => {
    const { pgIntrospectionResultsByKind } = build;
    pgIntrospectionResultsByKind.class
      .filter((table) => table.isSelectable && table.namespace)
      .forEach((table) => {
        if (!("omit" in table.tags)) {
          table.tags.omit = "create,update,delete";
        }
      });
    return build;
  });
};

// Tested via:
// npx postgraphile --append-plugins @graphile-contrib/pg-simplify-inflector,`pwd`/examples/plugins/0400_customisation/OmitMutationsByDefaultPlugin.js -c graphile_org_demo -s app_public
```

Resulting GraphQL schema diff, showing all mutations omitted:

```diff
--- Original GraphQL Schema
+++ Modified GraphQL Schema
@@ -3,41 +3,6 @@
 """
 scalar BigFloat

-"""All input for the create `Forum` mutation."""
-input CreateForumInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """The `Forum` to be created by this mutation."""
-  forum: ForumInput!
-}
-
-"""The output of our create `Forum` mutation."""
-type CreateForumPayload {
-  """
-  The exact same `clientMutationId` that was provided in the mutation input,
-  unchanged and unused. May be used by a client to track mutations.
-  """
-  clientMutationId: String
-
-  """The `Forum` that was created by this mutation."""
-  forum: Forum
-
-  """
-  Our root query field type. Allows us to run any query from our mutation payload.
-  """
-  query: Query
-
-  """An edge for our `Forum`. May be used by Relay 1."""
-  forumEdge(
-    """The method to use when ordering `Forum`."""
-    orderBy: [ForumsOrderBy!] = [PRIMARY_KEY_ASC]
-  ): ForumsEdge
-}
-
 """All input for the create `Post` mutation."""
 input CreatePostInput {
   """
@@ -79,120 +44,6 @@
   ): PostsEdge
 }

-"""All input for the create `QuizEntryAnswer` mutation."""
-input CreateQuizEntryAnswerInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """The `QuizEntryAnswer` to be created by this mutation."""
-  quizEntryAnswer: QuizEntryAnswerInput!
-}
-
-"""The output of our create `QuizEntryAnswer` mutation."""
-type CreateQuizEntryAnswerPayload {
-  """
-  The exact same `clientMutationId` that was provided in the mutation input,
-  unchanged and unused. May be used by a client to track mutations.
-  """
-  clientMutationId: String
-
-  """The `QuizEntryAnswer` that was created by this mutation."""
-  quizEntryAnswer: QuizEntryAnswer
-
-  """
-  Our root query field type. Allows us to run any query from our mutation payload.
-  """
-  query: Query
-
-  """Reads a single `QuizEntry` that is related to this `QuizEntryAnswer`."""
-  quizEntry: QuizEntry
-
-  """An edge for our `QuizEntryAnswer`. May be used by Relay 1."""
-  quizEntryAnswerEdge(
-    """The method to use when ordering `QuizEntryAnswer`."""
-    orderBy: [QuizEntryAnswersOrderBy!] = [PRIMARY_KEY_ASC]
-  ): QuizEntryAnswersEdge
-}
-
-"""All input for the create `QuizEntry` mutation."""
-input CreateQuizEntryInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """The `QuizEntry` to be created by this mutation."""
-  quizEntry: QuizEntryInput!
-}
-
-"""The output of our create `QuizEntry` mutation."""
-type CreateQuizEntryPayload {
-  """
-  The exact same `clientMutationId` that was provided in the mutation input,
-  unchanged and unused. May be used by a client to track mutations.
-  """
-  clientMutationId: String
-
-  """The `QuizEntry` that was created by this mutation."""
-  quizEntry: QuizEntry
-
-  """
-  Our root query field type. Allows us to run any query from our mutation payload.
-  """
-  query: Query
-
-  """Reads a single `User` that is related to this `QuizEntry`."""
-  user: User
-
-  """Reads a single `Quiz` that is related to this `QuizEntry`."""
-  quiz: Quiz
-
-  """An edge for our `QuizEntry`. May be used by Relay 1."""
-  quizEntryEdge(
-    """The method to use when ordering `QuizEntry`."""
-    orderBy: [QuizEntriesOrderBy!] = [PRIMARY_KEY_ASC]
-  ): QuizEntriesEdge
-}
-
-"""All input for the create `Quiz` mutation."""
-input CreateQuizInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """The `Quiz` to be created by this mutation."""
-  quiz: QuizInput!
-}
-
-"""The output of our create `Quiz` mutation."""
-type CreateQuizPayload {
-  """
-  The exact same `clientMutationId` that was provided in the mutation input,
-  unchanged and unused. May be used by a client to track mutations.
-  """
-  clientMutationId: String
-
-  """The `Quiz` that was created by this mutation."""
-  quiz: Quiz
-
-  """
-  Our root query field type. Allows us to run any query from our mutation payload.
-  """
-  query: Query
-
-  """An edge for our `Quiz`. May be used by Relay 1."""
-  quizEdge(
-    """The method to use when ordering `Quiz`."""
-    orderBy: [QuizzesOrderBy!] = [PRIMARY_KEY_ASC]
-  ): QuizzesEdge
-}
-
 """All input for the create `Topic` mutation."""
 input CreateTopicInput {
   """
@@ -351,66 +202,6 @@
 """
 scalar Datetime

-"""All input for the `deleteForumByNodeId` mutation."""
-input DeleteForumByNodeIdInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """
-  The globally unique `ID` which will identify a single `Forum` to be deleted.
-  """
-  nodeId: ID!
-}
-
-"""All input for the `deleteForumBySlug` mutation."""
-input DeleteForumBySlugInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """An URL-safe alias for the `Forum`."""
-  slug: String!
-}
-
-"""All input for the `deleteForum` mutation."""
-input DeleteForumInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-  id: Int!
-}
-
-"""The output of our delete `Forum` mutation."""
-type DeleteForumPayload {
-  """
-  The exact same `clientMutationId` that was provided in the mutation input,
-  unchanged and unused. May be used by a client to track mutations.
-  """
-  clientMutationId: String
-
-  """The `Forum` that was deleted by this mutation."""
-  forum: Forum
-  deletedForumNodeId: ID
-
-  """
-  Our root query field type. Allows us to run any query from our mutation payload.
-  """
-  query: Query
-
-  """An edge for our `Forum`. May be used by Relay 1."""
-  forumEdge(
-    """The method to use when ordering `Forum`."""
-    orderBy: [ForumsOrderBy!] = [PRIMARY_KEY_ASC]
-  ): ForumsEdge
-}
-
 """All input for the `deletePostByNodeId` mutation."""
 input DeletePostByNodeIdInput {
   """
@@ -465,159 +256,6 @@
   ): PostsEdge
 }

-"""All input for the `deleteQuizByNodeId` mutation."""
-input DeleteQuizByNodeIdInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """
-  The globally unique `ID` which will identify a single `Quiz` to be deleted.
-  """
-  nodeId: ID!
-}
-
-"""All input for the `deleteQuizEntryAnswerByNodeId` mutation."""
-input DeleteQuizEntryAnswerByNodeIdInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """
-  The globally unique `ID` which will identify a single `QuizEntryAnswer` to be deleted.
-  """
-  nodeId: ID!
-}
-
-"""All input for the `deleteQuizEntryAnswer` mutation."""
-input DeleteQuizEntryAnswerInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-  id: Int!
-}
-
-"""The output of our delete `QuizEntryAnswer` mutation."""
-type DeleteQuizEntryAnswerPayload {
-  """
-  The exact same `clientMutationId` that was provided in the mutation input,
-  unchanged and unused. May be used by a client to track mutations.
-  """
-  clientMutationId: String
-
-  """The `QuizEntryAnswer` that was deleted by this mutation."""
-  quizEntryAnswer: QuizEntryAnswer
-  deletedQuizEntryAnswerNodeId: ID
-
-  """
-  Our root query field type. Allows us to run any query from our mutation payload.
-  """
-  query: Query
-
-  """Reads a single `QuizEntry` that is related to this `QuizEntryAnswer`."""
-  quizEntry: QuizEntry
-
-  """An edge for our `QuizEntryAnswer`. May be used by Relay 1."""
-  quizEntryAnswerEdge(
-    """The method to use when ordering `QuizEntryAnswer`."""
-    orderBy: [QuizEntryAnswersOrderBy!] = [PRIMARY_KEY_ASC]
-  ): QuizEntryAnswersEdge
-}
-
-"""All input for the `deleteQuizEntryByNodeId` mutation."""
-input DeleteQuizEntryByNodeIdInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """
-  The globally unique `ID` which will identify a single `QuizEntry` to be deleted.
-  """
-  nodeId: ID!
-}
-
-"""All input for the `deleteQuizEntry` mutation."""
-input DeleteQuizEntryInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-  id: Int!
-}
-
-"""The output of our delete `QuizEntry` mutation."""
-type DeleteQuizEntryPayload {
-  """
-  The exact same `clientMutationId` that was provided in the mutation input,
-  unchanged and unused. May be used by a client to track mutations.
-  """
-  clientMutationId: String
-
-  """The `QuizEntry` that was deleted by this mutation."""
-  quizEntry: QuizEntry
-  deletedQuizEntryNodeId: ID
-
-  """
-  Our root query field type. Allows us to run any query from our mutation payload.
-  """
-  query: Query
-
-  """Reads a single `User` that is related to this `QuizEntry`."""
-  user: User
-
-  """Reads a single `Quiz` that is related to this `QuizEntry`."""
-  quiz: Quiz
-
-  """An edge for our `QuizEntry`. May be used by Relay 1."""
-  quizEntryEdge(
-    """The method to use when ordering `QuizEntry`."""
-    orderBy: [QuizEntriesOrderBy!] = [PRIMARY_KEY_ASC]
-  ): QuizEntriesEdge
-}
-
-"""All input for the `deleteQuiz` mutation."""
-input DeleteQuizInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-  id: Int!
-}
-
-"""The output of our delete `Quiz` mutation."""
-type DeleteQuizPayload {
-  """
-  The exact same `clientMutationId` that was provided in the mutation input,
-  unchanged and unused. May be used by a client to track mutations.
-  """
-  clientMutationId: String
-
-  """The `Quiz` that was deleted by this mutation."""
-  quiz: Quiz
-  deletedQuizNodeId: ID
-
-  """
-  Our root query field type. Allows us to run any query from our mutation payload.
-  """
-  query: Query
-
-  """An edge for our `Quiz`. May be used by Relay 1."""
-  quizEdge(
-    """The method to use when ordering `Quiz`."""
-    orderBy: [QuizzesOrderBy!] = [PRIMARY_KEY_ASC]
-  ): QuizzesEdge
-}
-
 """All input for the `deleteTopicByNodeId` mutation."""
 input DeleteTopicByNodeIdInput {
   """
@@ -960,40 +598,6 @@
   updatedAt: Datetime
 }

-"""An input for mutations affecting `Forum`"""
-input ForumInput {
-  id: Int
-
-  """An URL-safe alias for the `Forum`."""
-  slug: String!
-
-  """The name of the `Forum` (indicates its subject matter)."""
-  name: String!
-
-  """A brief description of the `Forum` including it's purpose."""
-  description: String
-  createdAt: Datetime
-  updatedAt: Datetime
-}
-
-"""
-Represents an update to a `Forum`. Fields that are set will be updated.
-"""
-input ForumPatch {
-  id: Int
-
-  """An URL-safe alias for the `Forum`."""
-  slug: String
-
-  """The name of the `Forum` (indicates its subject matter)."""
-  name: String
-
-  """A brief description of the `Forum` including it's purpose."""
-  description: String
-  createdAt: Datetime
-  updatedAt: Datetime
-}
-
 """A connection to a list of `Forum` values."""
 type ForumsConnection {
   """A list of `Forum` objects."""
@@ -1045,14 +649,6 @@
 The root mutation type which contains root level fields which mutate data.
 """
 type Mutation {
-  """Creates a single `Forum`."""
-  createForum(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: CreateForumInput!
-  ): CreateForumPayload
-
   """Creates a single `Post`."""
   createPost(
     """
@@ -1061,30 +657,6 @@
     input: CreatePostInput!
   ): CreatePostPayload

-  """Creates a single `Quiz`."""
-  createQuiz(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: CreateQuizInput!
-  ): CreateQuizPayload
-
-  """Creates a single `QuizEntry`."""
-  createQuizEntry(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: CreateQuizEntryInput!
-  ): CreateQuizEntryPayload
-
-  """Creates a single `QuizEntryAnswer`."""
-  createQuizEntryAnswer(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: CreateQuizEntryAnswerInput!
-  ): CreateQuizEntryAnswerPayload
-
   """Creates a single `Topic`."""
   createTopic(
     """
@@ -1117,30 +689,6 @@
     input: CreateUserInput!
   ): CreateUserPayload

-  """Updates a single `Forum` using its globally unique id and a patch."""
-  updateForumByNodeId(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: UpdateForumByNodeIdInput!
-  ): UpdateForumPayload
-
-  """Updates a single `Forum` using a unique key and a patch."""
-  updateForum(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: UpdateForumInput!
-  ): UpdateForumPayload
-
-  """Updates a single `Forum` using a unique key and a patch."""
-  updateForumBySlug(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: UpdateForumBySlugInput!
-  ): UpdateForumPayload
-
   """Updates a single `Post` using its globally unique id and a patch."""
   updatePostByNodeId(
     """
@@ -1157,56 +705,6 @@
     input: UpdatePostInput!
   ): UpdatePostPayload

-  """Updates a single `Quiz` using its globally unique id and a patch."""
-  updateQuizByNodeId(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: UpdateQuizByNodeIdInput!
-  ): UpdateQuizPayload
-
-  """Updates a single `Quiz` using a unique key and a patch."""
-  updateQuiz(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: UpdateQuizInput!
-  ): UpdateQuizPayload
-
-  """Updates a single `QuizEntry` using its globally unique id and a patch."""
-  updateQuizEntryByNodeId(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: UpdateQuizEntryByNodeIdInput!
-  ): UpdateQuizEntryPayload
-
-  """Updates a single `QuizEntry` using a unique key and a patch."""
-  updateQuizEntry(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: UpdateQuizEntryInput!
-  ): UpdateQuizEntryPayload
-
-  """
-  Updates a single `QuizEntryAnswer` using its globally unique id and a patch.
-  """
-  updateQuizEntryAnswerByNodeId(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: UpdateQuizEntryAnswerByNodeIdInput!
-  ): UpdateQuizEntryAnswerPayload
-
-  """Updates a single `QuizEntryAnswer` using a unique key and a patch."""
-  updateQuizEntryAnswer(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: UpdateQuizEntryAnswerInput!
-  ): UpdateQuizEntryAnswerPayload
-
   """Updates a single `Topic` using its globally unique id and a patch."""
   updateTopicByNodeId(
     """
@@ -1297,30 +795,6 @@
     input: UpdateUserByUsernameInput!
   ): UpdateUserPayload

-  """Deletes a single `Forum` using its globally unique id."""
-  deleteForumByNodeId(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: DeleteForumByNodeIdInput!
-  ): DeleteForumPayload
-
-  """Deletes a single `Forum` using a unique key."""
-  deleteForum(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: DeleteForumInput!
-  ): DeleteForumPayload
-
-  """Deletes a single `Forum` using a unique key."""
-  deleteForumBySlug(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: DeleteForumBySlugInput!
-  ): DeleteForumPayload
-
   """Deletes a single `Post` using its globally unique id."""
   deletePostByNodeId(
     """
@@ -1337,54 +811,6 @@
     input: DeletePostInput!
   ): DeletePostPayload

-  """Deletes a single `Quiz` using its globally unique id."""
-  deleteQuizByNodeId(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: DeleteQuizByNodeIdInput!
-  ): DeleteQuizPayload
-
-  """Deletes a single `Quiz` using a unique key."""
-  deleteQuiz(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: DeleteQuizInput!
-  ): DeleteQuizPayload
-
-  """Deletes a single `QuizEntry` using its globally unique id."""
-  deleteQuizEntryByNodeId(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: DeleteQuizEntryByNodeIdInput!
-  ): DeleteQuizEntryPayload
-
-  """Deletes a single `QuizEntry` using a unique key."""
-  deleteQuizEntry(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: DeleteQuizEntryInput!
-  ): DeleteQuizEntryPayload
-
-  """Deletes a single `QuizEntryAnswer` using its globally unique id."""
-  deleteQuizEntryAnswerByNodeId(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: DeleteQuizEntryAnswerByNodeIdInput!
-  ): DeleteQuizEntryAnswerPayload
-
-  """Deletes a single `QuizEntryAnswer` using a unique key."""
-  deleteQuizEntryAnswer(
-    """
-    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
-    """
-    input: DeleteQuizEntryAnswerInput!
-  ): DeleteQuizEntryAnswerPayload
-
   """Deletes a single `Topic` using its globally unique id."""
   deleteTopicByNodeId(
     """
@@ -2032,24 +1458,6 @@
   answer: Int
 }

-"""An input for mutations affecting `QuizEntryAnswer`"""
-input QuizEntryAnswerInput {
-  id: Int
-  quizEntryId: Int!
-  question: String!
-  answer: Int
-}
-
-"""
-Represents an update to a `QuizEntryAnswer`. Fields that are set will be updated.
-"""
-input QuizEntryAnswerPatch {
-  id: Int
-  quizEntryId: Int
-  question: String
-  answer: Int
-}
-
 """A connection to a list of `QuizEntryAnswer` values."""
 type QuizEntryAnswersConnection {
   """A list of `QuizEntryAnswer` objects."""
@@ -2108,40 +1516,6 @@
   quizId: Int
 }

-"""An input for mutations affecting `QuizEntry`"""
-input QuizEntryInput {
-  id: Int
-  userId: Int!
-  quizId: Int!
-}
-
-"""
-Represents an update to a `QuizEntry`. Fields that are set will be updated.
-"""
-input QuizEntryPatch {
-  id: Int
-  userId: Int
-  quizId: Int
-}
-
-"""An input for mutations affecting `Quiz`"""
-input QuizInput {
-  id: Int
-  name: String!
-  updatedAt: Datetime
-  precision12Scale2: BigFloat
-  precision200Scale100: BigFloat
-}
-
-"""Represents an update to a `Quiz`. Fields that are set will be updated."""
-input QuizPatch {
-  id: Int
-  name: String
-  updatedAt: Datetime
-  precision12Scale2: BigFloat
-  precision200Scale100: BigFloat
-}
-
 """A connection to a list of `Quiz` values."""
 type QuizzesConnection {
   """A list of `Quiz` objects."""
@@ -2378,80 +1752,6 @@
   PRIMARY_KEY_DESC
 }

-"""All input for the `updateForumByNodeId` mutation."""
-input UpdateForumByNodeIdInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """
-  The globally unique `ID` which will identify a single `Forum` to be updated.
-  """
-  nodeId: ID!
-
-  """
-  An object where the defined keys will be set on the `Forum` being updated.
-  """
-  patch: ForumPatch!
-}
-
-"""All input for the `updateForumBySlug` mutation."""
-input UpdateForumBySlugInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """
-  An object where the defined keys will be set on the `Forum` being updated.
-  """
-  patch: ForumPatch!
-
-  """An URL-safe alias for the `Forum`."""
-  slug: String!
-}
-
-"""All input for the `updateForum` mutation."""
-input UpdateForumInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """
-  An object where the defined keys will be set on the `Forum` being updated.
-  """
-  patch: ForumPatch!
-  id: Int!
-}
-
-"""The output of our update `Forum` mutation."""
-type UpdateForumPayload {
-  """
-  The exact same `clientMutationId` that was provided in the mutation input,
-  unchanged and unused. May be used by a client to track mutations.
-  """
-  clientMutationId: String
-
-  """The `Forum` that was updated by this mutation."""
-  forum: Forum
-
-  """
-  Our root query field type. Allows us to run any query from our mutation payload.
-  """
-  query: Query
-
-  """An edge for our `Forum`. May be used by Relay 1."""
-  forumEdge(
-    """The method to use when ordering `Forum`."""
-    orderBy: [ForumsOrderBy!] = [PRIMARY_KEY_ASC]
-  ): ForumsEdge
-}
-
 """All input for the `updatePostByNodeId` mutation."""
 input UpdatePostByNodeIdInput {
   """
@@ -2515,186 +1815,6 @@
   ): PostsEdge
 }

-"""All input for the `updateQuizByNodeId` mutation."""
-input UpdateQuizByNodeIdInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """
-  The globally unique `ID` which will identify a single `Quiz` to be updated.
-  """
-  nodeId: ID!
-
-  """
-  An object where the defined keys will be set on the `Quiz` being updated.
-  """
-  patch: QuizPatch!
-}
-
-"""All input for the `updateQuizEntryAnswerByNodeId` mutation."""
-input UpdateQuizEntryAnswerByNodeIdInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """
-  The globally unique `ID` which will identify a single `QuizEntryAnswer` to be updated.
-  """
-  nodeId: ID!
-
-  """
-  An object where the defined keys will be set on the `QuizEntryAnswer` being updated.
-  """
-  patch: QuizEntryAnswerPatch!
-}
-
-"""All input for the `updateQuizEntryAnswer` mutation."""
-input UpdateQuizEntryAnswerInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """
-  An object where the defined keys will be set on the `QuizEntryAnswer` being updated.
-  """
-  patch: QuizEntryAnswerPatch!
-  id: Int!
-}
-
-"""The output of our update `QuizEntryAnswer` mutation."""
-type UpdateQuizEntryAnswerPayload {
-  """
-  The exact same `clientMutationId` that was provided in the mutation input,
-  unchanged and unused. May be used by a client to track mutations.
-  """
-  clientMutationId: String
-
-  """The `QuizEntryAnswer` that was updated by this mutation."""
-  quizEntryAnswer: QuizEntryAnswer
-
-  """
-  Our root query field type. Allows us to run any query from our mutation payload.
-  """
-  query: Query
-
-  """Reads a single `QuizEntry` that is related to this `QuizEntryAnswer`."""
-  quizEntry: QuizEntry
-
-  """An edge for our `QuizEntryAnswer`. May be used by Relay 1."""
-  quizEntryAnswerEdge(
-    """The method to use when ordering `QuizEntryAnswer`."""
-    orderBy: [QuizEntryAnswersOrderBy!] = [PRIMARY_KEY_ASC]
-  ): QuizEntryAnswersEdge
-}
-
-"""All input for the `updateQuizEntryByNodeId` mutation."""
-input UpdateQuizEntryByNodeIdInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """
-  The globally unique `ID` which will identify a single `QuizEntry` to be updated.
-  """
-  nodeId: ID!
-
-  """
-  An object where the defined keys will be set on the `QuizEntry` being updated.
-  """
-  patch: QuizEntryPatch!
-}
-
-"""All input for the `updateQuizEntry` mutation."""
-input UpdateQuizEntryInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """
-  An object where the defined keys will be set on the `QuizEntry` being updated.
-  """
-  patch: QuizEntryPatch!
-  id: Int!
-}
-
-"""The output of our update `QuizEntry` mutation."""
-type UpdateQuizEntryPayload {
-  """
-  The exact same `clientMutationId` that was provided in the mutation input,
-  unchanged and unused. May be used by a client to track mutations.
-  """
-  clientMutationId: String
-
-  """The `QuizEntry` that was updated by this mutation."""
-  quizEntry: QuizEntry
-
-  """
-  Our root query field type. Allows us to run any query from our mutation payload.
-  """
-  query: Query
-
-  """Reads a single `User` that is related to this `QuizEntry`."""
-  user: User
-
-  """Reads a single `Quiz` that is related to this `QuizEntry`."""
-  quiz: Quiz
-
-  """An edge for our `QuizEntry`. May be used by Relay 1."""
-  quizEntryEdge(
-    """The method to use when ordering `QuizEntry`."""
-    orderBy: [QuizEntriesOrderBy!] = [PRIMARY_KEY_ASC]
-  ): QuizEntriesEdge
-}
-
-"""All input for the `updateQuiz` mutation."""
-input UpdateQuizInput {
-  """
-  An arbitrary string value with no semantic meaning. Will be included in the
-  payload verbatim. May be used to track mutations by the client.
-  """
-  clientMutationId: String
-
-  """
-  An object where the defined keys will be set on the `Quiz` being updated.
-  """
-  patch: QuizPatch!
-  id: Int!
-}
-
-"""The output of our update `Quiz` mutation."""
-type UpdateQuizPayload {
-  """
-  The exact same `clientMutationId` that was provided in the mutation input,
-  unchanged and unused. May be used by a client to track mutations.
-  """
-  clientMutationId: String
-
-  """The `Quiz` that was updated by this mutation."""
-  quiz: Quiz
-
-  """
-  Our root query field type. Allows us to run any query from our mutation payload.
-  """
-  query: Query
-
-  """An edge for our `Quiz`. May be used by Relay 1."""
-  quizEdge(
-    """The method to use when ordering `Quiz`."""
-    orderBy: [QuizzesOrderBy!] = [PRIMARY_KEY_ASC]
-  ): QuizzesEdge
-}
-
 """All input for the `updateTopicByNodeId` mutation."""
 input UpdateTopicByNodeIdInput {
   """
```

## SanitizeHTMLTypePlugin

```ts
// Author: Benjie Gillam
// License: https://benjie.mit-license.org/
//
// This is a documentation example, you will need to edit it to make it useful.
// Instructions on running this plugin are at the bottom.

// This function is the one that would perform sanitisation (writing actual
// sanitisation is left as an exercise to the reader)
function sanitize(html) {
  return html.toUpperCase();
}

// Export our plugin function (it can be async if you want)
module.exports = /* async */ function SanitizeHTMLTypePlugin(
  builder
) {
  // Builder is an instance of SchemaBuilder:
  //
  //   https://www.graphile.org/graphile-build/schema-builder/

  //////////////////////////////////////////////////////////////////////////////

  // Here we're hooking the init event; this event occurs after the `build`
  // object is finalised, but before we start building our schema - it's the
  // perfect time to hook up additional types.
  //
  // 'init' is an a-typical hook in that the first argument is meaningless (but
  // you should still return it at the end of the hook).
  //
  // Note all hooks in graphile-build must be synchronous; any async work must be done above here.
  builder.hook("init", (_, build) => {
    // The `build` object is an instance of Build: https://www.graphile.org/graphile-build/build-object/
    // graphile-build-pg adds a bunch of additional helpers to this object:
    const {
      pgIntrospectionResultsByKind, // From PgIntrospectionPlugin
      pgRegisterGqlTypeByTypeId, // From PgTypesPlugin
      pgRegisterGqlInputTypeByTypeId, // From PgTypesPlugin
      pg2GqlMapper, // From PgTypesPlugin
      pgSql: sql, // From PgBasicsPlugin, this is equivalent to `require('pg-sql2')` but avoids multiple-module conflicts
      graphql, // Equivalent to `require('graphql')` but avoids multiple-module conflicts
    } = build;
    const { GraphQLString } = graphql;

    // First we find the type that we care about. In this case we've done
    //
    //   CREATE DOMAIN html AS text;
    // or
    //   CREATE DOMAIN public.html AS text;
    //
    // so we are looking for the 'html' type in the 'public' schema (namespace).
    const htmlDomain = pgIntrospectionResultsByKind.type.find(
      type =>
        type.name === "html" &&
        type.namespaceName ===
          "public"
    );

    // If this type exists, then...
    if (htmlDomain) {
      // Register the *output* type for this type, we just want to use the `String` type
      pgRegisterGqlTypeByTypeId(
        htmlDomain.id,
        () => GraphQLString
      );

      // Register the *input* type for this type, again we'll use `String`
      pgRegisterGqlInputTypeByTypeId(
        htmlDomain.id,
        () => GraphQLString
      );

      // The pg2GqlMapper is responsible for translating things from PostgreSQL
      // into GraphQL and back again.
      pg2GqlMapper[htmlDomain.id] = {
        // From Postgres to GraphQL: we simply take the string from postgres
        // and sanitise it and return the resulting string to GraphQL.
        map: value => sanitize(value),

        // From GraphQL to SQL: we must construct an SQL fragment that can be
        // interpolated into larger SQL queries (e.g. as the argument to a
        // function or the input value for a CREATE/UPDATE mutation). Graphile
        // uses the pg-sql2 module for this purpose, you can find the docs
        // here:
        //
        //   https://github.com/graphile/pg-sql2/blob/master/README.md
        //
        // We're going to take the value (string) the client gave us, stick it
        // through the sanitise function, then pass it into SQL using
        // `sql.value` to avoid SQL injection and being sure to cast it to our
        // HTML type. Note that if you miss the `sql.value(...)` pg-sql2 will
        // throw an error, so you don't have to worry about accidental SQL
        // injection - just never use `sql.raw`!
        unmap: value =>
          sql.fragment`(${sql.value(
            sanitize(value)
          )}::public.html)`,
      };
    }

    // All hooks in graphile-build must return something; normally it's an
    // augmented form of the thing that was passed as the first argument. We
    // don't manipuate _ at all so we can simply return it.
    return _;
  });
};

/*
```

You can test this plugin by saving it to a file 'plugin.js', then executing the
following:

```sql
  # Create a database to test against
  createdb sanitise-html
  # Seed the database with our domain, table and some data
  psql -1X sanitise-html <<SQL
    CREATE DOMAIN html AS text;
    CREATE TABLE a (id SERIAL PRIMARY KEY, t TEXT, h HTML);
    INSERT INTO a (t, h) VALUES ('AaAaAa', 'BbBbBb');
  SQL
  # Run PostGraphile
  postgraphile --append-plugins `pwd`/plugin.js -c postgres:///sanitise-html
```

Here's a GraphQL query for selecting the data:

```graphql
{
  allAs {
    nodes {
      id
      t
      h
    }
  }
}
```

And one for updating the data:

```graphql
  mutation {
    updateAById(
      input: {
        id: 1
        aPatch: {
          t: "tttt_TTTT_tttt"
          h: "hhhh_HHHH_hhhh"
        }
      }
    ) {
      a {
        id
        t
        h
      }
    }
  }

*/

// Tested via:
// npx postgraphile --append-plugins @graphile-contrib/pg-simplify-inflector,`pwd`/examples/plugins/0400_customisation/SanitizeHTMLTypePlugin.js -c graphile_org_demo -s app_public

```
