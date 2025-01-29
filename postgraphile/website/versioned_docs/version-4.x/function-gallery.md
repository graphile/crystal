---
title: Function Gallery
---

# Database Function Gallery

Below you'll find some examples of various PostgreSQL functions, and their
effects on PostGraphile.

_This page is a WIP - sorry that it's hard to read right now, we will definitely
be tidying it up! If you want to help with this, please pop into our
[discord chat](http://discord.gg/graphile) and volunteer!_

_All these diffs are automatically produced using the functions as written._

## Custom Queries

### Logged in user field

```sql
create function viewer()
returns users
as $$
  select *
  from users
  where id = current_user_id();
  /*
   * current_user_id() is a function
   * that returns the logged in user's
   * id, e.g. by extracting from the JWT
   * or indicated via pgSettings.
   */
$$ language sql stable set search_path from current;
```

```diff
--- Original GraphQL Schema
+++ Modified GraphQL Schema
@@ -1795,6 +1795,7 @@

   """Chosen by fair dice roll. Guaranteed to be random. XKCD#221"""
   randomNumber: Int
+  viewer: User

   """Reads a single `Forum` using its globally unique `ID`."""
   forumByNodeId(
```

## Computed Columns

### User primary email

```sql
/*
 * Returns the primary email of the
 * current user; for all other users
 * this function will return null.
 */
create function "users_primaryEmail"(u users)
returns text
as $$
  select email
  from user_emails
  where user_id = current_user_id()
  and user_id = u.id
  and is_verified is true
  order by id asc
  limit 1;
$$ language sql stable set search_path from current;
```

```diff
--- Original GraphQL Schema
+++ Modified GraphQL Schema
@@ -3130,6 +3130,7 @@
     """
     condition: QuizEntryCondition
   ): QuizEntriesConnection!
+  primaryEmail: String
 }

 """
```

## Custom Mutations

### Insert multiple records

```sql
/**
 * Occasionally you'll want to create a bunch of rows in different tables in a
 * single mutation. Here's an example of how to do that.
 *
 * Pretend we're registering quiz entries, and we want to store each answer in
 * its own table as we want to be able to operate on the answers independently
 * later.
 *
 * This means we want:
 *
 *  1. A mutation that takes input data for inserting one quiz entry and
 *  multiple answers.
 *  2. A function that inserts a new quiz entry, inserts an answer for each
 *  answer provided in the input data, and connects each answer to the created
 *  quiz entry.
 *  3. Finally, we want the function to return the inserted quiz entry itself.
 */

/**
 * This type is used for input in the mutation
 */
create type quiz_entry_input as (
  question text,
  answer int
);

/**
 * Here's the function that gets turned into a "custom mutation"
 */
create function add_quiz_entry(
  quiz_id int,
  answers quiz_entry_input[]
)
returns quiz_entry
as $$
  declare
    q quiz_entry;
    a quiz_entry_answer;
  begin
    insert into quiz_entry(user_id, quiz_id)
      values(current_user_id(), quiz_id)
      returning * into q;

    foreach a in array answers loop
      insert into quiz_entry_answer(quiz_entry_id, question, answer)
        values (quiz_id, a.question, a.answer);
    end loop;

    return q;
  end;
$$ language plpgsql volatile strict set search_path from current;
```

```diff
--- Original GraphQL Schema
+++ Modified GraphQL Schema
@@ -1,3 +1,41 @@
+"""All input for the `addQuizEntry` mutation."""
+input AddQuizEntryInput {
+  """
+  An arbitrary string value with no semantic meaning. Will be included in the
+  payload verbatim. May be used to track mutations by the client.
+  """
+  clientMutationId: String
+  quizId: Int!
+  answers: [QuizEntryInputRecordInput]!
+}
+
+"""The output of our `addQuizEntry` mutation."""
+type AddQuizEntryPayload {
+  """
+  The exact same `clientMutationId` that was provided in the mutation input,
+  unchanged and unused. May be used by a client to track mutations.
+  """
+  clientMutationId: String
+  quizEntry: QuizEntry
+
+  """
+  Our root query field type. Allows us to run any query from our mutation payload.
+  """
+  query: Query
+
+  """Reads a single `User` that is related to this `QuizEntry`."""
+  user: User
+
+  """Reads a single `Quiz` that is related to this `QuizEntry`."""
+  quiz: Quiz
+
+  """An edge for our `QuizEntry`. May be used by Relay 1."""
+  quizEntryEdge(
+    """The method to use when ordering `QuizEntry`."""
+    orderBy: [QuizEntriesOrderBy!] = [PRIMARY_KEY_ASC]
+  ): QuizEntriesEdge
+}
+
 """
 A floating point number that requires more precision than IEEE 754 binary 64
 """
@@ -1472,6 +1510,12 @@
     """
     input: DeleteUserByUsernameInput!
   ): DeleteUserPayload
+  addQuizEntry(
+    """
+    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
+    """
+    input: AddQuizEntryInput!
+  ): AddQuizEntryPayload

   """
   If you've forgotten your password, give us one of your email addresses and we'
@@ -2115,6 +2159,12 @@
   quizId: Int!
 }

+"""An input for mutations affecting `QuizEntryInputRecord`"""
+input QuizEntryInputRecordInput {
+  question: String
+  answer: Int
+}
+
 """
 Represents an update to a `QuizEntry`. Fields that are set will be updated.
 """
```
