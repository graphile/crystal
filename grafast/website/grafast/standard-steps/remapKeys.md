# remapKeys

Returns an object resulting from extracting the given `actualKey` from the input
and storing it as the `desiredKey` in the output.

Usage:

```ts
// const $original: Step<{ id: number, first_name: string }>
const $mapped: Step<{ name: string; row_id: number }> = remapKeys(
  $original,

  // Take the `first_name` and `id` properties of the original object, and
  // return a new object where these are stored into the `name` and `row_id`
  // properties respectively.
  {
    name: "first_name",
    row_id: "id",
  },
);
```

## Use in optimize

If your step inlines its work into an ancestor step during the optimize phase,
it will want to replace itself with an alternative step that extracts the result
from the ancestor.

For example, consider you loading details about a post including the author:

```graphql
query Post($id: Int!) {
  post(id: $id) {
    id
    title
    body
    author {
      id
      name
    }
  }
}
```

Imagine both `post` and `author` load their details from a database table:

```sql
-- Post-loading step:
select
  posts.id,
  posts.title,
  posts.body,
  posts.author_id
from posts
where posts.id = any(:post_ids);

-- Author-loading step:
select
  authors.id,
  authors.name
from authors
where authors.id = any(:author_ids);
```

Your author-loading step might want to optimize itself into the posts loading
step, so the post and its author load via the same query:

```sql
-- Post-loading step:
select
  posts.id,
  posts.title,
  posts.body,
  authors.id as author_id,
  authors.name as author_name
from posts
inner join authors
on (authors.id = posts.author_id)
where posts.id = any(:post_ids);
```

Now your Author-loading step can replace itself with a step that remaps the keys
from the ancestor:

```ts
class DbLoadStep extends Step {
  // ...

  optimize() {
    const $parent = findAncestorForInlining(this);
    if (!$parent) return this;

    // ... inline into $parent ...

    return remapKeys($parent, {
      id: "author_id",
      name: "author_name",
    });
  }
}
```

:::
