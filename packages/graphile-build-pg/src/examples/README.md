# Examples

Many of these example can run against any database, but if you want you can use
the `pagila` example database for Postgres (see below).

## Pagila example database (optional)

Clone down `pagila`:

```
git clone git@github.com:devrimgunduz/pagila.git
```

Created a database for it:

```
createdb pagila
```

And now populate the database:

```
psql pagila -Xv ON_ERROR_STOP=1 -f pagila-schema.sql -f pagila-data.sql
```
