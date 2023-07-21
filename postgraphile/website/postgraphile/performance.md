---
layout: page
path: /postgraphile/performance/
title: Performance
draft: true
---

:::caution

This documentation is copied from Version 4 and has not been updated to Version
5 yet; it may not be valid.

:::

On a Digital Ocean compute-optimised droplet with 8GB of RAM, running
PostGraphile, PostgreSQL _and_ the benchmarking software all through Docker,
PostGraphile running in cluster mode over 4 vCPUs can handle 3250 requests per
second for the following simple query:

```graphql
query tracks_media_first_20 {
  allTracksList(first: 20) {
    trackId
    name
  }
}
```

For a more complex 3-level query, it can handle about 1450 requests per second:

```graphql
query albums_tracks_genre_some {
  allAlbumsList(condition: { artistId: 127 }) {
    artistId
    title
    tracksByAlbumIdList {
      trackId
      name
      genreByGenreId {
        name
      }
    }
  }
}
```

And for a very heavy query such as the following one, it can still serve 550
requests per second from a single server, all while maintaining sub-50ms 95th
percentile latency:

```graphql
query prisma_deeplyNested {
  allAlbumsList(condition: { artistId: 127 }) {
    albumId
    title
    tracksByAlbumIdList {
      trackId
      name
      genreByGenreId {
        name
      }
    }
    artistByArtistId {
      albumsByArtistIdList {
        tracksByAlbumIdList {
          mediaTypeByMediaTypeId {
            name
          }
          genreByGenreId {
            name
          }
        }
      }
    }
  }
}
```

To read about how PostGraphile's performance compares to that of Prisma, and how
to validate the results for yourself, check out
[this post](https://medium.com/@Benjie/how-i-made-postgraphile-faster-than-prisma-graphql-server-in-8-hours-e66b4c511160)
on Medium.

### How is it so fast?

We leverage graphile-build's
[look-ahead](https://graphile.org/graphile-build/look-ahead/) features when
resolving a GraphQL request so that a single root level query, no matter how
nested, is compiled into just one SQL query. PostgreSQL has an excellent query
planner which optimises and executes this query for us, avoiding the need for
multiple round-trips to the database and thus solving the N+1 problem that is
found in many GraphQL APIs.

For example the following query would be compiled into one SQL statement:

```graphql
{
  allPosts {
    edges {
      node {
        id
        title
        author: userByAuthorId {
          ...UserDetails
        }
        comments {
          text
          author: userByAuthorId {
            ...UserDetails
            recentComments {
              date
              post: postByPostId {
                title
                author {
                  ...UserDetails
                }
              }
              text
            }
          }
        }
      }
    }
  }
}

fragment UserDetails on User {
  id
  username
  bio: bioByUserId {
    preamble
    location
    description
  }
}
```

### How can I improve performance of my PostGraphile API?

Chances are that any performance issues you have are coming from your database
schema, so standard PostgreSQL optimisation techniques apply. Here's a few
things you might want to try:

- Throw more RAM at your database server
- Make sure your database server is using an SSD
- Make sure you have added the correct type of database indexes in the correct
  places (references, filters, order-by)
- Note: making a column a reference to a foreign key does **not** add an index
  to that column, so for example `User.postsByAuthorId` will be slow unless
  you've manually added an index to `posts.author_id`
- `VACUUM` your database tables
- Check your RLS policies aren't too expensive, consider optimising them
- Optimise your computed column functions
- Consider `security definer` on functions to bypass RLS (but make sure you add
  your own auth checks!)
- Use the envvar `DEBUG=graphile-build-pg:sql` to show the SQL statements that
  are being executed; e.g.
  `DEBUG=graphile-build-pg:sql postgraphile -c postgres:///mydb`

If you need help optimising your PostgreSQL database or PostGraphile API, please
[get in touch](https://graphile.org/support/).
