---
layout: page
path: /postgraphile/postgresql-indexes/
title: PostgreSQL Indexes
---

It’s important that your queries stay fast for your users, this section outlines
some resources to help you optimize you queries with indexes.

- Heroku’s [Efficient Use of PostgreSQL Indexes][] outlines how to best use
  indexes to optimize you queries. The entire article is a helpful read, but if
  nothing else read the last section [Managing and Maintaining Indexes][] for a
  better understanding of how indexes work.

- The PostgreSQL documentation has a great article describing the relationship
  between [Indexes and `ORDER BY`][].

[efficient use of postgresql indexes]: https://devcenter.heroku.com/articles/postgresql-indexes
[managing and maintaining indexes]: https://devcenter.heroku.com/articles/postgresql-indexes#managing-and-maintaining-indexes
[indexes and `order by`]: http://www.postgresql.org/docs/current/static/indexes-ordering.html

_This article was originally written by
[Caleb Meredith](https://twitter.com/calebmer)._

### Advice - Foreign Key Indexes

Many people don't realise that when you create a
[foreign key relation](./relations/), PostgreSQL does NOT automatically create
an index on the referencing column(s). That can mean that when you query based
on that relation, which PostGraphile does a lot when traversing relationships,
it can involve a full table scan which is very expensive.

Cameron Ellis has written a short article on
[finding missing indexes on foreign keys](https://medium.com/@awesboss/how-to-find-missing-indexes-on-foreign-keys-2faffd7e6958)
which utilises SQL similar to the following to automatically detect missing
foreign key indexes:

```sql
WITH indexed_tables AS (
  select
      ns.nspname,
      t.relname as table_name,
      i.relname as index_name,
      array_to_string(array_agg(a.attname), ', ') as column_names,
      ix.indrelid,
      string_to_array(ix.indkey::text, ' ')::smallint[] as indkey
  FROM pg_class i
  JOIN pg_index ix ON i.OID = ix.indrelid
  JOIN pg_class t ON ix.indrelid = t.oid
  JOIN pg_namespace ns ON ns.oid = t.relnamespace
  JOIN pg_attribute a ON a.attrelid = t.oid
  where a.attnum = ANY(ix.indkey)
  and t.relkind = 'r'
  and nspname not in ('pg_catalog')
  group by
      ns.nspname,
      t.relname,
      i.relname,
      ix.indrelid,
      ix.indkey
  order by
      ns.nspname,
      t.relname,
      i.relname,
      ix.indrelid,
      ix.indkey
)
SELECT
  conrelid::regclass
  ,conname
  ,reltuples::bigint
FROM pg_constraint pgc
JOIN pg_class ON (conrelid = pg_class.oid)
WHERE contype = 'f'
AND NOT EXISTS(
  SELECT 1
  FROM indexed_tables
  WHERE indrelid = conrelid
  AND conkey = indkey
  OR (array_length(indkey, 1) > 1 AND indkey @> conkey)
)
ORDER BY reltuples DESC;
```

You should consider integrating something like this into your CI tests to ensure
that all your foreign keys are indexed.
