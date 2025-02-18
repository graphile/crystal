---
title: PostgreSQL indexes
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

### Advice - foreign key indexes

Many people don't realize that when you create a [foreign key
relation](./relations), PostgreSQL does NOT automatically create an index on
the referencing column(s). That can mean that when you query based on that
relation, which PostGraphile does a lot when traversing relationships, it can
involve a full table scan which is very expensive. By default, PostGraphile
will not add this "reverse lookup" field to the GraphQL schema unless there is
an index on it for this reason (though you can force it with the `+select`
behavior on the foreign key constraint).

Cameron Ellis has written a short article on
[finding missing indexes on foreign keys](https://medium.com/@awesboss/how-to-find-missing-indexes-on-foreign-keys-2faffd7e6958)
which utilises SQL similar to the following to automatically detect missing
foreign key indexes:

```sql
with indexed_tables as (
  select
      ns.nspname,
      t.relname as table_name,
      i.relname as index_name,
      array_to_string(array_agg(a.attname), ', ') as column_names,
      ix.indrelid,
      string_to_array(ix.indkey::text, ' ')::smallint[] as indkey
  from pg_class i
  join pg_index ix on i.OID = ix.indrelid
  join pg_class t on ix.indrelid = t.oid
  join pg_namespace ns on ns.oid = t.relnamespace
  join pg_attribute a on a.attrelid = t.oid
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
select
  conrelid::regclass
  ,conname
  ,reltuples::bigint
from pg_constraint pgc
join pg_class on (conrelid = pg_class.oid)
where contype = 'f'
and not exists(
  select 1
  from indexed_tables
  where indrelid = conrelid
  and conkey = indkey
  or (array_length(indkey, 1) > 1 and indkey @> conkey)
)
order by reltuples desc;
```

You should consider integrating something like this into your CI tests to ensure
that all your foreign keys are indexed.

Our [pgRITA.com](https://pgrita.com) tool will also help you spot this kind of
issue and more; it has a free usage tier with some essentials and is also
included in certain sponsorship tiers.
