---
title: Smart Comments
---

# Database Smart Comments

_Ensure you've read the [Smart Tags](./smart-tags) page before referring here._

You can customize your PostGraphile GraphQL schema without making breaking
changes to your database schema by adding specially formatted comments to
tables, columns, functions, relations, etc. within your PostgreSQL database. We
call these "smart comments".

## Smart comment spec

Comments can be added to various entities within PostgreSQL using
[the `COMMENT` statement](https://www.postgresql.org/docs/current/sql-comment.html);
we add a special syntax to these comments that enables PostGraphile to treat
them as smart comments.

A smart comment is made up of one or more "tags" and optionally followed by the
remaining comment. Tags may have a string payload (which follows a the tag and a
space, and must not contain newline characters) and are separated by newlines.
Tags always start with an `@` symbol and must always come before the remaining
comment, hence all smart comments start with an `@` symbol. If a tag has no
payload then its value will be the boolean `true`, otherwise it will be a
string. If the same tag is present more than once in a smart comment then its
final value will become an array of the individual values for that tag.

The following text could be parsed as a smart comment (**the smart comment
values shown are examples only, and don't have any meaning**):

```
@name meta
@isImportant
@jsonField date timestamp
@jsonField name text
@jsonField episode enum ONE=1 TWO=2
This field has a load of arbitrary tags.
```

and would result in the following JSON tags object:

```json
{
  "name": "meta",
  "isImportant": true,
  "jsonField": ["date timestamp", "name text", "episode enum ONE=1 TWO=2"]
}
```

and the description on the last line
(`This field has a load of arbitrary tags.`) would be made available as
documentation as regular comments are.

Note that the parser is deliberately very strict currently, we might make it
more flexible in future; you might want to check out the
[test suite](https://github.com/graphile/graphile-engine/blob/master/packages/graphile-build-pg/__tests__/tags.test.js).

## Adding newlines

To put newlines in smart comments we recommend the use of the
[`E` "escape" string constants](https://www.postgresql.org/docs/current/static/sql-syntax-lexical.html#SQL-SYNTAX-CONSTANTS),
wherein you can use `\n` for newlines. For example the text above could be added
to a comment on a field via:

```sql
comment on column my_schema.my_table.my_column is
  E'@name meta\n@isImportant\n@jsonField date timestamp\n@jsonField name text\n@jsonField episode enum ONE=1 TWO=2\nThis field has a load of arbitrary tags.';
```

You can use newlines verbatim but this can cause issues with some tooling,
particularly if you have developers on both Windows and Unix-based operating
systems.

## Applying smart tags to database entities

### Tables

```sql
comment on table my_schema.my_table is
  E'@name my_new_table_name\n@omit update,delete\nThis is the documentation.';
```

### Views

```sql
comment on view my_schema.mv_view is
  E'@name my_new_view_name\n@omit update,delete\nThis is the documentation.';
```

### Materialized Views

```sql
comment on materialized view my_schema.mv_view is
  E'@name my_new_view_name\n@omit update,delete\nThis is the documentation.';
```

### Types

```sql
comment on type my_schema.my_type is
  E'@name my_new_type_name\nThis is the documentation.';
```

### Columns

```sql
comment on column my_schema.my_table.my_column is
  E'@name my_new_column\n@omit create,update\nThis is the documentation.';
```

### Constraints

```sql
comment on constraint my_constraint on my_schema.my_table is
  E'@foreignFieldName foos\n@fieldName bar\nDocumentation here.';
```

### Functions

```sql
comment on function my_function(arg_type_1, arg_type_2) is
  E'@name my_new_function_name\nDocumentation here.';
```

## Adding smart tags to fake constraints

If you need to apply any smart comments to a fake constraint, you cannot use
newlines (`\n`) because they will be interpreted as separate smart comments on
the original entity. We've added a workaround for this: you can use the pipe
(`|`) symbol to assign smart comments to the fake constraint, for example to
rename the fake constraint:

```sql
comment on materialized view my_materialized_view is
  E'@foreignKey (post_id) references posts (id)|@fieldName yourNameHere';
```
