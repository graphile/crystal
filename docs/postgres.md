# PostgreSQL
This section of the docs is for people who want to use PostGraphQL but don’t have much experience with PostgreSQL and want resources to help explain key concepts. These resources also give some crucial tips on how to optimize queries and keep your PostgreSQL database happy and healthy.

## Indexes
It’s important that your queries stay fast for your users, this section outlines some resources to help you optimize you queries with indexes.

- Heroku’s [Efficient Use of PostgreSQL Indexes][] outlines how to best use indexes to optimize you queries. The entire article is a helpful read, but if nothing else read the last section [Managing and Maintaining Indexes][] for a better understanding of how indexes work.

- The PostgreSQL documentation has a great article describing the relationship between [Indexes and `ORDER BY`][].

[Efficient Use of PostgreSQL Indexes]: https://devcenter.heroku.com/articles/postgresql-indexes
[Managing and Maintaining Indexes]: https://devcenter.heroku.com/articles/postgresql-indexes#managing-and-maintaining-indexes
[Indexes and `ORDER BY`]: http://www.postgresql.org/docs/current/static/indexes-ordering.html
