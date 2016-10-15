# Postgres Schema Design
The Postgres database is rich with features well beyond that of any other database. However, most developers do not know the extent to which they can leverage the features in Postgres to completely express their application business logic in the database.

Often developers may find themselves re-implimenting authentication and authorization in their apps, when Postgres comes with application level security features out of the box. Or perhaps developers may rewrite basic insert functions with some extra app logic where that too may be handled in the database.

This reimplementation of features that come with Postgres is not just an inefficient way to spend developer resources, but may also result in an interface that is slower than if the logic was implemented in Postgres itself. PostGraphQL aims to make developers more efficient and their APIs faster by packaging the repeatable work in one open source project that encourages community contributions.

In this article we will walk through the Postgres schema design for a forum application. While we will discuss how you can use the schema we create with PostGraphQL, this article should be useful for anyone designing a Postgres schema.

The application we will build uses the following specification:

> Our forum should have many users who can all create posts and leave comments on those posts. Users should also be able to like posts they found particularly interesting.
>
> TODO: More + better description

Outline:

- About this tutorial.
- Database setup
  - Schemas
    - Naming
    - Public
    - Private
- Person
  - Main Table
  - Comments
- Post
  - Enum
  - Table
- Procedures
  - Simple add function.
  - Computed Columns (`person_full_name`)
  - More complex computed columns (`person_latest_post`, `post_summary`)
  - Set returning function (`search_posts`)
  - Triggers (`updated_at`)
- Auth
  - Person Account Table
  - Create account: Plpgsql (`register_person`)
  - Login: (`authenticate`)
  - Procedures (`current_person`)
  - Access
    - Grant
    - Row Level Security
- Conclusion
- Likes?

## Setup
### Installing Postgres
First, you are going to need to make sure Postgres is installed. If you are running on MacOS, it is highly recommended that you install and use [Postgres.app](http://postgresapp.com/). If you are on another platform, go to the [Postgres download page](https://www.postgresql.org/download/) to pick up a copy of Postgres. We recommend using a version of Postgres higher than `9.5.0` as Postgres `9.5` introduces Row Level Security, an important feature when building your business logic into the database.

Next, make sure your copy of Postgres is running locally on `postgres://localhost:5432`. This is the default location for local Postgres databases and is used by many Postgres tools.

In a terminal window, run `psql`. This is your most basic tool for querying your Postgres databse. By default `psql` will connect to `postgres://localhost:5432`. If you want to connect to another database, just pass that database as the first argument.

```bash
$ psql                                  # Connects to the default database at `postgres://localhost:5432`
$ psql postgres://localhost:5432/testdb # Connects to the `testdb` database at `postgres://localhost:5432`
$ psql postgres://somehost:2345/somedb  # connects to the `somedb` database at `postgres://somehost:2345`
```

> **Note:** Remember what URL you use with `psql`. You will use the same URL, or “connection string,” whenever you connect to Postgres. In fact you start PostGraphQL in a similar way:
>
> ```bash
> $ postgraphql                                     # Connects to the default database at `postgres://localhost:5432`
> $ postgraphql -c postgres://localhost:5432/testdb # Connects to the `testdb` database at `postgres://localhost:5432`
> $ postgraphql -c postgres://somehost:2345/somedb  # connects to the `somedb` database at `postgres://somehost:2345`
> ```
>
> Read the documentation on [Postgres connection strings](https://www.postgresql.org/docs/9.6/static/libpq-connect.html#LIBPQ-CONNSTRING) to learn more about alternative formats.

After running `psql` with your database URL, you should be in a SQL prompt:

```
psql (9.5.*)
Type "help" for help.

=#
```

Run the following query to make sure things are working smoothly:

```
=# select 1 + 1 as two;
 two
-----
   2
(1 row)

=#
```

Excellent, now we can go on to setting up our database schemas.

### Setting Up Your Schemas
All of our database objects will go into one or two custom Postgres schemas. A schema is essentially a namespace, it allows you to create tables like `forum_example.person` and `forum_example_2.person` without needing to worry about naming clashes.

You can name your schema anything, we recommend naming your schema after your app. This way if you are working on multiple apps in the same database (this might only realistically happen in development), you can easily query the databases of the different apps. We are going to create two schemas: `forum_example`, and `forum_example_private`. To create these schemas we use the [`CREATE SCHEMA`](https://www.postgresql.org/docs/9.6/static/sql-createschema.html) command.

```sql
create schema forum_example;
create schema forum_example_private;
```

You could create more, or less schemas. It is all up to you and how you want to structure your database. We decided to create two schemas. One of which, `forum_example`, is meant to be data users can see. Theoretically we could have a user log in directly to our Postgres database (as a user with less power than our superuser of course), and only be able to create, read, update, and delete data for their user with SQL. This is a mindshift from how we traditionally use a SQL database. Normally, we assume whoever is querying the database has full visibility into the system. In this tutorial, we want to restrict access at the database level. Don’t worry though! Postgres is very secure about this, users will have no more permissions then that which you explicitly grant.

Our `forum_example_private` schema is one we never want users to have access to. We will put emails, passwords, and some utility functions in this schema that the orginary user should not be able to access.

The reason we have two schemas instead of restricting access to users’ password hashes is twofold. The first reason is that it is much clearer to developers that they should protect data in the `forum_example_private` schema, a mental trick. Second is that we tell PostGraphQL which objects in the database to expose at the schema level. So we can tell PostGraphQL to expose `forum_example`, and therefore we do not expose the passwords we may store in `forum_example_private`.

## Person Table
Now we are going to create the tables in our database that will correspond to our users. We will do this by running the Postgres [`CREATE TABLE`](https://www.postgresql.org/docs/current/static/sql-createtable.html) command. Here is the definition for our person table, we will break it down afterwards:

```sql
create table forum_example.person (
  id               serial primary key,
  first_name       text not null check (char_length(first_name) < 80),
  last_name        text check (char_length(last_name) < 80),
  about            text,
  created_at       timestamp default now()
);
```

Now we have created a table with `id`, `first_name`, `last_name`, `about`, and `created_at` columns. We will add an `updated_at` column later in this tutorial. Let’s break down exactly what each line in this command does, we will only do this once. If you feel like you understand you can skip ahead.

1. `create table forum_example.person`: This tells Postgres that we are creating a table in the `forum_example` schema named `person`. This table will represent all of our forum’s users. :+1:
2. `id serial primary key`: This line establishes an auto-incrementing id field which is always guaranteed to be unique. The first person we create will have an id of 1, the second user will have an id of 2, and so on. The `primary key` bit is also very important. PostGraphQL will use the `primary key` of a table in many places to uniquely identify an object, including the globally unique id field.
3. `first_name text not null check (char_length(first_name) < 80)`: We want all of our users to enter their first name and last name seperately, this column definition will create a column named `first_name`, of type `text`, that is required (`not null`), and that must be less than 80 characters long (`check (char_length(first_name) < 80)`). [Constraints](https://www.postgresql.org/docs/9.6/static/ddl-constraints.html) like the `check` used here are a very powerful feature in Postgres for data validation.
4. `last_name text check (char_length(last_name) < 80)`: This is very similar to our column definition for `first_name`, except it is missing `not null`. This means that unlike the `first_name` column, `last_name` is not required.
5. `about text`: We want users to be able to express themselves! So they get to write a mini forum post which will go on their profile page. 😉
6. `created_at timestamp default now()`: This final column definition will provide us with some extra meta-information about their user. If not specified explicitly, the `created_at` timestamp will default to the time the row was created.

And that’s our person table! Pretty simple right 😉

The syntax and features of the Postgres [`CREATE TABLE`](https://www.postgresql.org/docs/current/static/sql-createtable.html) command are fairly easy to learn and understand. Creating tables is the easiest, but also the most fundamental part of your schema design.

> **Note:** We prefer singular identifers like `forum_example.person` over `forum_example.people` because when you create a table, it is like you are creating a class in a statically typed language. Table as a class is a better analogy than table as a collection because Postgres itself will internally call tables “classes.”

> **Note:** An alternative to the `serial` primary key we used above for our table is to use UUIDs. To use UUIDs you would just need to add the popular UUID extension, `uuid-ossp`, in your database setup, and specify a default in your table creation. Like so:
>
> ```sql
> create extension if not exists "uuid-ossp";
>
> create table forum_example.person (
>   id uuid primary key default uuid_generate_v1mc(),
>   ...
> );
> ```
>
> If you are going to use UUIDs as the primary key, it is recommended you use `uuid_generate_v1mc` to generate the ids. It is time based which means the ids will be mostly sequential. This is good for your primary key index.
>
> There are pros and cons to both approaches, choose what works best for your application!

### Table Documentation
Now that we have created our table, we want to document it in Postgres. By adding comments to our table and its columns using the Postgres [`COMMENT`](https://www.postgresql.org/docs/9.6/static/sql-comment.html) command, we will allow tools like PostGraphQL and others that introspect the Postgres schema to display rich domain specific documentation.

To add comments, just see the SQL below:

```sql
comment on table forum_example.person is 'A user of the forum.';
comment on column forum_example.person.id is 'The primary unique identifier for the person.';
comment on column forum_example.person.first_name is 'The person’s first name.';
comment on column forum_example.person.last_name is 'The person’s last name.';
comment on column forum_example.person.about is 'A short description about the user, written by the user.';
comment on column forum_example.person.created_at is 'The time this person was created.';
```

Incredibly simple, yet also incredibly powerful.

> **Note:** Feel free to write your comments in Markdown! Most tools, including GraphiQL which PostGraphQL uses, will render your comments with the appropriate styles.

With this we have completed our person table, we will move on to creating a table for our forum posts!

## Post Table
The users of our forum will want to be able to create posts. That’s the entire reason we have a forum after all! To create the post table we go through a very similar process as creating our person table with `forum_example.person`, with one difference. Before we create our post table, we want to create a type we will use with that table. See the SQL below:

```sql
create type forum_example.post_topic as enum (
  'discussion',
  'inspiration',
  'help',
  'showcase'
);
```

The Postgres [`CREATE TYPE`](https://www.postgresql.org/docs/current/static/sql-createtype.html) command will let you create a custom type in your database which will allow you to do some cool things! You can create a [composite type](https://www.postgresql.org/docs/9.6/static/rowtypes.html) which is basically a typed object in GraphQL terms. You can create a [range type](https://www.postgresql.org/docs/current/static/rangetypes.html) which represents exactly what you might think. You can also create an [enum type](https://www.postgresql.org/docs/current/static/datatype-enum.html), which is what we did here.

Enum types are a static set of values, you *must* use one of the string values that make up the enum in any column of the enum’s type. Having this type is useful for us, because we want our forum posts to have one, or none, topics so user’s may easily see what a post is about.

> **Note:** PostGraphQL implements custom handling for user-defined types. An enum type like that defined above will be turned into a GraphQL enum that looks like:
>
> ```graphql
> enum PostTopic {
>   DISCUSSION
>   INSPIRATION
>   HELP
>   SHOWCASE
> }
> ```
>
> You can also create custom composite types which will turn into GraphQL object types with PostGraphQL.
>
> ```sql
> create type my_schema.my_type as (
>   foo integer,
>   bar integer
> );
> ```
>
> Would become the following GraphQL type:
>
> ```graphql
> type MyType {
>   foo: Int
>   bar: Int
> }
> ```

Now it is time to actually create our post table! Since we went over the process in detail with `forum_example.person`, we will just give you the table here.

```sql
create table forum_example.post (
  id               serial primary key,
  author_id        integer not null references forum_example.person(id),
  headline         text not null check (char_length(headline) < 280),
  body             text,
  topic            forum_example.post_topic,
  created_at       timestamp default now()
);

comment on table forum_example.post is 'A forum post written by a user.';
comment on column forum_example.post.id is 'The primary key for the post.';
comment on column forum_example.post.headline is 'The title written by the user.';
comment on column forum_example.post.author_id is 'The id of the author user.';
comment on column forum_example.post.topic is 'The topic this has been posted in.';
comment on column forum_example.post.body is 'The main body text of our post.';
comment on column forum_example.post.created_at is 'The time this post was created.';
```

Ok, pretty basic. Our `headline` is twice as long as a tweet, and to use our `forum_example.post_topic` type we wrote it as the column type just as we may set a column type to `integer`. Aren’t Postgres user-defined types impressive! We also made sure to include comments this time around.

Now that we have nailed the basics, let’s explore Postgres functions and see how we can use them to extend the functionality of our database.

## Postgres Functions
The Postgres [`CREATE FUNCTION`](https://www.postgresql.org/docs/current/static/sql-createfunction.html) command is truly amazing. It allows us to write functions for our database in SQL, and other languages including JavaScript and Ruby!

The following is a basic Postgres function:

 ```sql
create function add(a int, b int) returns int as $$
  select a + b
$$ language sql stable;
```

Note the form. The double dollar signs (`$$`) open and close the function, and at the very end we have `language sql stable`. `language sql` means that the function is written in SQL, pretty obvious. If you wrote your function in Ruby it may be `language plruby`. The next word, `stable`, means that this function *does not* mutate the database. By default Postgres assumes all functions will mutate the database, you must mark your function with `stable` for Postgres, and PostGraphQL, to know your function is a query and not a mutation.

> **Note:** If you are interested by the idea of running JavaScript or Ruby in Postgres, check out [PL/V8](https://blog.heroku.com/javascript_in_your_postgres) and [PL/ruby](https://github.com/knu/postgresql-plruby) respectively. It is recommended that you use SQL and PL/pgSQL (which comes native with Postgres) wherever you can (even if they are a pain). There is plenty of documentation and you should need a scripting language very little anyway. However, there are alternatives if you so choose.

That function above isn’t so useful for us in our schema. Let’s write a function which will be useful to use, we are going to define three.

First, a function which will concatenate the users first and last name to return their full name:

```sql
create function forum_example.person_full_name(person forum_example.person) returns text as $$
  select person.first_name || ' ' || person.last_name
$$ language sql stable;

comment on function forum_example.person_full_name(forum_example.person) is 'A person’s full name which is a concatenation of their first and last name.';
```

Second, a function which will get a summary of a forum post:

```sql
create function forum_example.post_summary(
  post forum_example.post,
  length int default 50,
  omission text default '…'
) returns text as $$
  select case
    when post.body is null then null
    else substr(post.body, 0, length) || omission
  end
$$ language sql stable;

comment on function forum_example.post_summary(forum_example.post, int, text) is 'A truncated version of the body for summaries.';
```

Third, a function that will get the users most recent forum post.

```sql
create function forum_example.person_latest_post(person forum_example.person) returns forum_example.post as $$
  select post.*
  from forum_example.post as post
  where post.author_id = person.id
  order by created_at desc
  limit 1
$$ language sql stable;

comment on function forum_example.person_latest_post(forum_example.person) is 'Get’s the latest post written by the person.';
```

Don’t get too stuck on the function implementations. It is fairly easy to discover how to express what you want in SQL through a quick search of the Postgres documentation (which is excellent!). These functions are here to give you some examples of what functions in Postgres look like. Also note how we added comments to our functions as well, just like we add comments to our tables.

> **Note:** *All* of these functions would be treated as computed fields by PostGraphQL. Any function which complies with the following conditions:
>
> 1. The function has a table row as the *first* argument.
> 2. The function is in the same schema as the table of the first argument.
> 3. The function’s name is prefixed by the table first argument’s name.
>
> If these conditions are met, the function will be exposed directly on the type, like so:
>
> ```graphql
> type Person {
>   id: Int!
>   firstName: String!
>   lastName: String
>   ...
>   fullName: String
>   latestPost: Post
> }
> ```

### Set Returning Functions
Sometimes it is useful to not just return single values from your function, but perhaps *entire tables*. What returning a table from a function could mean is you could define a custom ordering, or you could hide rows that were archived perhaps. In our case, this Postgres feature makes it easy for us to implement search:

```sql
create function forum_example.search_posts(search text) returns setof forum_example.post as $$
  select post.*
  from forum_example.post as post
  where post.headline ilike ('%' || search || '%') or post.body ilike ('%' || search || '%')
$$ language sql stable;

comment on function forum_example.search_posts(text) is 'Returns posts containing a given search term.';
```

The difference with this function and the ones before is the return signature which reads `returns setof forum_example.post`. This function will therefore return many posts instead of just one. Allowing us to then return all posts that match our search condition, which in this case is a super basic [Postgres pattern matching](https://www.postgresql.org/docs/9.6/static/functions-matching.html) condition using case insensitive `ILIKE`. There are better ways to implement search in Postgres, this is just a simple example.

> **Note:** PostGraphQL will treat set returning functions as connections. This is what makes them so powerful for PostGraphQL users. The function above would be queryable like so:
>
> ```graphql
> {
>   searchPosts(search: "Hello, world!", first: 5) {
>     edges {
>       cursor
>       node {
>         headline
>         body
>       }
>     }
>   }
> }
> ```

> **Note:** Postgres has awesome text searching capabilities, the function above uses a basic `ILIKE` pattern matching function. If you want high quality production quality full text searching, look into the Postgres [Full Text Search](https://www.postgresql.org/docs/9.6/static/textsearch.html) feature. It is a great feature, but a bit much for our simple example.

> **Note:** Returning an array (`returns post[]`), and returning a set (`returns setof post`) are two very different things. When you return an array, every single value in the array will always be returned. However, when you return a set it is like returning a table. Users can paginate through a set using `limit` and `offset`, but not an array.

### Triggers
In Postgres you can use the functions you create to define triggers. Triggers in Postgres allow you to hook into events that are happening on your tables such as inserts, updates, or deletes. You define your triggers with the [`CREATE TRIGGER`](https://www.postgresql.org/docs/9.6/static/textsearch.html) command, and all trigger functions must return the special type `trigger`.

To demonstrate how triggers work, we will define a trigger that sets an `updated_at` column on our `forum_example.person` and `forum_example.post` tables whenever a row is updated. Before we can write the trigger, though, we need to make sure `forum_example.person` and `forum_example.post` have an `updated_at` column! When we created them we only gave them a `created_at` column. To add the columns we will use the [`ALTER TABLE`](https://www.postgresql.org/docs/9.6/static/sql-altertable.html) command.

```sql
alter table forum_example.person add column updated_at timestamp default now();
alter table forum_example.post add column updated_at timestamp default now();
```

Our `updated_at` column has now been added to our tables and looks exactly like our `created_at` column. It’s a timestamp which defaults to the time the row was created. Next, let us actually define our triggers:

```sql
create function forum_example_private.set_updated_at() returns trigger as $$
begin
  new.updated_at := current_timestamp;
  return new;
end;
$$ language plpgsql;

create trigger person_updated_at before update
  on forum_example.person
  for each row
  execute procedure forum_example_private.set_updated_at();

create trigger post_updated_at before update
  on forum_example.post
  for each row
  execute procedure forum_example_private.set_updated_at();
```

Ok, to define our trigger we ran three commands. First we created a function named `set_updated_at` in our `forum_example_private` schema (bet you were waiting for us to use that!). We put it in our `forum_example_private` schema because we want no one to have access, this is a utility function for our triggers. Note that `forum_example_private.set_updated_at` returns a `trigger`. This is required for any function we want to use as a trigger. Our function is also written in a new language, [PL/pgSQL](https://www.postgresql.org/docs/9.6/static/plpgsql.html). The PL/pgSQL allows you to perform block computations, such as this, in the database. There are alternatives to PL/pgSQL as we mentioned earlier.

After we define our `forum_example_private.set_updated_at` function, we can use it in the triggers we create! As we want to update the `updated_at` columns of two tables, we create two triggers. The triggers will run before a row is updated by the [`UPDATE`](https://www.postgresql.org/docs/9.6/static/sql-update.html) command and will execute the function on every row being updated.

> **Note:** If you want to do some intensive work in triggers, perhaps consider using Postgres’s pub/sub functionality by running the [`NOTIFY`](https://www.postgresql.org/docs/9.6/static/sql-notify.html) command in triggers and then use the [`LISTEN`](https://www.postgresql.org/docs/9.6/static/sql-listen.html) command in a worker service. If Node.js is your platform of choice, you could use the [`pg-pubsub`](https://www.npmjs.com/package/pg-pubsub) package to make listening easier.

* * *

That’s about it as far as Postgres functions go! They are a fun, interesting, and useful topic to understand when it comes to good Postgres schema design. Always remember, the Postgres documentation is your best friend as you try to write your own functions. Some important documentation articles we mentioned for your reference are as follows:

- [`CREATE FUNCTION`](https://www.postgresql.org/docs/current/static/sql-createfunction.html)
- [`CREATE TRIGGER`](https://www.postgresql.org/docs/9.6/static/sql-createtrigger.html)
- [`PL/pgSQL`](https://www.postgresql.org/docs/8.3/static/plpgsql.html)

Next up, we are going to learn about auth in Postgres and PostGraphQL!

## Authentication and Authorization
Authentication and authorization is incredibly important whenever you build an app. You want your users to be able to login and out of your service, and only edit the content your platform has given them permission to edit. Postgres already has great support for authentication and authorization using a secure role based system, and PostGraphQL bridges the gap between the Postgres role mechanisms and the common HTTP based authentication mechanisms we need to build our apps.

However, before we can dive into implementing authentication, we are missing some pretty important data in our schema! How are users supposed to even login? Not by guessing their first and last name one would hope.

### Emails and Passwords
We want our users to be able to login using their email and a password, so we need to store that data about a person. So, let us add a place to put emails and passwords in our schema. To do this we will create another table in the `forum_example_private` schema.

```sql
create table forum_example_private.person_account (
  person_id        integer primary key references forum_example.person(id),
  email            text not null unique check (email ~* '^.+@.+\..+$'),
  password_hash    text not null
);

comment on table forum_example_private.person_account is 'Private information about a person’s account.';
comment on column forum_example_private.person_account.person_id is 'The id of the person associated with this account.';
comment on column forum_example_private.person_account.email is 'The email address of the person.';
comment on column forum_example_private.person_account.password_hash is 'An opaque hash of the person’s password.';
```

> **Warning:** Never store passwords in plaintext! The `password_hash` column will contained the user’s password *after* it has gone through a secure hashing algorithm like [Bcrypt](https://codahale.com/how-to-safely-store-a-password/). Later in this tutorial we will show you how to securely hash a password in Postgres.

Why would we choose to create a new table in the `forum_example_private` schema instead of just adding columns to `forum_example.person`? There are a couple of answers to this question. The first and most fundamental is seperation of concerns. By moving `email` and `password_hash` to a second table we make it much harder to accidently select those values when reading `forum_example.person`. Also, users will not have the permission to directly query data from `forum_example_private` (as we will see) making this approach more secure. This approach is also good for PostGraphQL. Because the `forum_example_private` schema is never exposed in PostGraphQL, you will never accidently expose hashes in GraphQL.

Besides those arguments, moving the person’s account to a seperate table is also good database design in general. Say you have multiple types of users. Perhaps normal person users, and then ’brand‘ or ‘organization’ users. This pattern could easily allow you to go in that direction.

> **Note:** The `forum_example_private.person_account` shares its primary key with `forum_example.person`. This way there can only be one `forum_example_private.person_account` for every `forum_example.person`, a one-to-one relationship.

> **Note:** For an example of a much richer user profile/account/login schema, use [Membership.db](https://github.com/membership/membership.db/tree/master/postgres) as a reference.

### Registering Users
The first step in a user’s lifecycle with our service is the registration flow. Before a user can log in, they need to have an account in our database. To register a user we are going to implement a Postgres function in PL/pgSQL which will create two rows. The first row will be the user’s profile inserted into `forum_example.person`. The second will be a user’s account inserted into `forum_example_private.person_account`.

Before we define the function, we also want to accept plaintext passwords into this function, but hash them before inserting into `forum_example_private.person_account`. To do this we will need the Postgres [`pgcrypto` extension](https://www.postgresql.org/docs/9.6/static/pgcrypto.html). We will create it like so:

```sql
create extension if not exists "pgcrypto";
```

The `pgcrypto` module should come with your Postgres distribution and gives us access to hashing functions like `crypt` and `gen_salt` which were specifically designed for hashing passwords.

Now that we have added `pgcrypto` to our database, let us define our function:

```sql
create function forum_example.register_person(
  first_name text,
  last_name text,
  email text,
  password text
) returns forum_example.person as $$
declare
  row forum_example.person;
begin
  insert into forum_example.person (first_name, last_name) values
    (first_name, last_name)
    returning * into row;

  insert into forum_example_private.person_account (person_id, email, pass_hash) values
    (row.id, email, crypt(password, gen_salt('bf')));

  return row;
end;
$$ language plpgsql strict security definer;

comment on function forum_example.register_person(text, text, text, text) is 'Registers a single user and creates an account in our forum.';
```

If you do not understand going on here, *do not worry*. Writing PL/pgSQL requires some trial and error along with some StackOverflow searching. What’s new here that might throw you off is that we have a new block, `declare`, above our function implementation which starts with `begin`. In that block we just declare that we will be using a variable called `row` of type `forum_example.person`. Then, in our first insert statement, the row we insert will be saved into that `row` variable.

We use the `pgcrypto` extension in the code `crypt(password, gen_salt('bf'))`. When we run this code on `password` it means we are storing a hash of the password and not the password in plain text. Read the documentation for `pgcrypto` on [Password Hashing Functions](https://www.postgresql.org/docs/9.6/static/pgcrypto.html#AEN178870) to learn more about these functions and their characteristics.

> **Warning:** Be very careful with logging, while we encrypt our passwords here it may be possible that in a query or server log the password may be recorded in plain text! Be careful to configure your Postgres logs so this isn’t the case, a slow query log could catch and log the password. PostGraphQL will never log the value of any variables the client gives it, however if you add a password string literal in your query it will be logged. Be very careful with your logs and passwords, this is true in any system but especially this one.
>
> For an overview of passwords in Postgres past the `pgcrypto` documentation, see the answer to the StackOverflow question “[How can I hash passwords in Postgres?](http://stackoverflow.com/a/18687445/1568890).”

At the end of the implementation you will see `language plpgsql strict security definer`. `language plpgsql` we already understand, but the other words are new. The word `strict` just means that this function will not accept null input. That is `password` cannot be null or `first_name` cannot be null. The words `security definer` mean that this function is executed with the privileges of the Postgres user who created it. Remember how we said users would never be able to insert into `forum_example_private.person_account`? Well then this function would fail unless we executed the function with our admin user’s privileges.

> **Warning:** Make sure that when you set a function with `security definer` there are no ‘holes’ a user could use to see or mutate more data than they are allowed to. Since the above is a simple function, we are fine. If you don’t need `security definer`, try not to use it.

This function will create a user and their account, but how will we log the user in? Before we define a function which allows users to login, sign-in, authenticate, whatever you want to call it. Let us go over how auth works at a high level in PostGraphQL. While this article is trying to be somewhat PostGraphQL agnostic, the next two sections will be specific to PostGraphQL, but useful to anyone wanting to learn just a little bit more about Postgres.

### Roles
When a user logs in, we want them to make their queries using a specific PostGraphQL role. Using that role we can define rules that restrict what data the user may access. So what roles do we need to define for our forum example? Remember when we were connecting to Postgres and we used a URL like `postgres://localhost:5432/mydb`? Well, when you use a connection string like that, you are logging into Postgres using your computer account’s username and no password. Say your computer account username is `buddy`, then connecting with the URL `postgres://localhost:5432/mydb`, would be the same as connecting with the URL `postgres://buddy@localhost:5432/mydb`. If you wanted to connect to your Postgres database with a password it would look like `postgres://buddy:password@localhost:5432/mydb`. When you run Postgres locally, this account will probably be the superuser. So when you run `postgraphql -c postgres://localhost:5432/mydb`, you are running PostGraphQL with superuser privileges. Let’s change that, we will create a role that PostGraphQL can use to connect to our database:

```sql
create role forum_example_postgraphql login password 'password';
```

We create this `forum_example_postgraphql` role with the [`CREATE ROLE`](https://www.postgresql.org/docs/current/static/sql-createrole.html) command. We want to make sure our PostGraphQL role can login so we specify that with the `login` option and we give the user a password of ‘xyz’ with the `password` option. Now we will start PostGraphQL as such:

```bash
postgraphql -c postgres://forum_example_postgraphql:password@localhost:5432/mydb
```

When a user who does not have a JWT token makes a request to Postgres, we do not want that user to have the privileges we will give to the `forum_example_postgraphql` role, so instead we will create another role.

```sql
create role forum_example_anonymous;
grant forum_example_anonymous to forum_example_postgraphql;
```

Here we use [`CREATE ROLE`](https://www.postgresql.org/docs/current/static/sql-createrole.html) again. This role cannot login so it does not have the `login` option, or a password. We also use the [`GRANT`](https://www.postgresql.org/docs/9.6/static/sql-grant.html) command to grant access to the `forum_example_anonymous` role to the `forum_example_postgraphql` role. Now, the `forum_example_postgraphql` role can control and become the `forum_example_anonymous` role. If we did not use that grant, we could not change into the `forum_example_anonymous` role in PostGraphQL. Now we will start our server like so:

```bash
postgraphql -c postgres://forum_example_postgraphql:password@localhost:5432/mydb --default-role forum_example_anonymous
```

There is one more role we want to create. When a user logs in we don’t want them to use the `forum_example_postgraphql` role, or the basic `forum_example_anonymous` role. So instead we will create a role that all of our basic users will be allowed to use. We will call it `forum_example_person` and similarly grant it to the `forum_example_postgraphql` role.

```sql
create role forum_example_person;
grant forum_example_person to forum_example_postgraphql;
```

> **Warning:** The `forum_example_postgraphql` role will have all of the permissions of the roles granted to it. So it can do everything `forum_example_anonymous` can do, and everything `forum_example_person` can do. This is why having a default role is important. We would not want an anonymous user to have admin access level because we have granted an admin role to `forum_example_postgraphql`.

Ok, so now we have three roles. `forum_example_postgraphql`, `forum_example_anonymous`, and `forum_example_person`. We know how `forum_example_postgraphql` and `forum_example_anonymous` get used, but how do we know when a user is logged in and should be using `forum_example_person`? The answer is a JSON Web Token.

### JSON Web Tokens (JWTs)
PostGraphQL uses [JSON Web Tokens (JWTs)](https://jwt.io/) for authorization. A JWT is just a JSON object that has been hashed and cryptographically signed to confirm the identity of its contents. So an object like:

```json
{
  "a": 1,
  "b": 2,
  "c": 3
}
```

Would turn into a token that looks like:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoxLCJiIjoyLCJjIjozfQ.hxhGCCCmGV9nT1slief1WgEsOsfdnlVizNrODxfh1M8
```

> **Warning:** The information in a JWT can be read by anyone, so do not put secure information in a JWT. What makes JWTs secure is that unless they were signed by our secret, we can not accept the information as truth.

This allows PostGraphQL to securely make claims about who a user is. Attackers would not be able to fake a claim unless they had access to the private ‘secret’ you define when you start PostGraphQL like so:

```bash
postgraphql --secret keyboard-cat
```

> **Note:** If you end up changing your secret whether its because an attacker learned your secret or you just lost it, all user sessions will be immeadiately invalidated and users will efectively be ’logged out.‘

When PostGraphQL gets a JWT from an HTTP request’s `Authorization` header, like so:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoxLCJiIjoyLCJjIjozfQ.hxhGCCCmGV9nT1slief1WgEsOsfdnlVizNrODxfh1M8
```

It will verify the token using the secret, and then it will serialize the claims in the token to the database. So for our token above PostGraphQL would effectively run:

 ```sql
set local jwt.claims.a to 1
set local jwt.claims.b to 2
set local jwt.claims.c to 3
```

This way your JWT is accessible in your database rules. To get these values back out in SQL, just run the following function:

 ```sql
select current_setting('jwt.claims.a');
```

All of the ‘claims’ or properties on the JWT are set in this way, with one exception. If you have a `role` property in your JWT, PostGraphQL will also set the Postgres role of the local transaction. So say you had a `role` of `forum_example_person`. PostGraphQL would run:

 ```sql
set local role to 'forum_example_person'
set local jwt.claims.role to 'forum_example_person'
```

Now, the user would have the permissions of the `forum_example_person` role.

> **Warning:** Unless explicitly set, JWTs never expire. Once they have been issued they may never be invalidated. This is both good and bad, good in that JWTs are *fast* as they don’t require a database lookup. Bad in that if an attacker gets their hands on a JWT you can’t stop them from using it until the token expires.
>
> A solution to this is to use very short expiration times on your tokens and to use refresh tokens. A refresh token you would use whenever your JWT expires to get a new JWT without prompting the user for their password again. Refresh tokens would be stored in the database so you could easily invalidate refresh tokens.

We now know how PostGraphQL uses JWTs to authorize the user, but how does PostGraphQL create JWTs? Stay tuned 😉

### Logging In
You can pass an option to PostGraphQL, called `--token <identifier>` in the CLI, which takes a composite type identifier. PostGraphQL will turn this type into a JWT wherever you see it in the GraphQL output. So let’s define the type we will use for our JWTs:

```sql
create type forum_example.jwt_token as (
  role text,
  person_id integer
);

comment on type forum_example.jwt_token is 'The JWT which will identify users in our database.';
comment on column forum_example.jwt_token.role is 'The Postgres role that the user identified by this token may use.';
comment on column forum_example.jwt_token.person_id is 'The person who is identified by this JWT.';
```

That’s it! We are using the [`CREATE TYPE`](https://www.postgresql.org/docs/current/static/sql-createtype.html) command again as we did before to create an enum type. This time we are creating a composite type. The definition for a composite type looks very much like the definition of a table type, except a composite type cannot store rows i.e. you can’t `INSERT`, `SELECT`, `UPDATE`, or `DELETE` from a composite type. However, PostGraphQL can turn a composite type into a JWT! Now that we’ve defined this type we will want to start PostGraphQL with the `--token` flag like so:

```bash
postgraphql --token forum_example.jwt_token
```

Next we need to create the function which will actually return the token:

```sql
create function forum_example.authenticate(
  email text,
  password text
) returns forum_example.jwt_token as $$
declare
  account forum_example_private.person_account;
begin
  select a.* into account
  from forum_example_private.person_account as a
  where a.email = $1;

  if account.password_hash = crypt(password, account.password_hash) then
    return ('forum_example_person', account.person_id)::forum_example.jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;

comment on function forum_example.authenticate(text, text) is 'Creates a JWT token that will securely identify a person and give them certain permissions.';
```

This looks very similar to all of our previous functions, but let’s go over how it works anyway. This function will return null if the user failed to authenticate. Either their password was incorrect, a user with their email doesn’t exist, or the client forgot to pass `email` and `password` arguments! If a user with the provided email *does* exist, and the provided password checks out with `password_hash` in `forum_example_private.person_account` then we return an instance of `forum_example.jwt_token` which will then be converted into an actual JWT by PostGraphQL.

There are two main parts to our function body. The first is:

```plpgsql
select a.* into account
from forum_example_private.person_account as a
where a.email = $1;
```

This code will select a single account from `forum_example_private.person_account` using the email. The `$1` here is just another way to write the `email` argument. If we had wrote `email = email` or even `a.email = email`, Postgres would not have known which email we were referring to! So instead, we just used the `email` argument’s placement in the variable `$1`. If we succesfully find a person with that email, we store it in the `account` variable. If we do not find anything, `account` will be null. The second part of our function is:

```plpgsql
if account.password_hash = crypt(password, account.password_hash) then
  return ('forum_example_person', account.person_id)::forum_example.jwt_token;
else
  return null;
end if;
```

This is an if/else statement that checks to see if the plaintext `password` argument we were provided matches the `password_hash` that was stored in our `forum_example_private.person_account`’s `password_hash` table. This check is done in the code `account.password_hash = crypt(password, account.password_hash)`. To better understand how this works, read the documentation for `pgcrypto` on [Password Hashing Functions](https://www.postgresql.org/docs/9.6/static/pgcrypto.html#AEN178870).

If the `password` does match the `password_hash` then we return a `forum_example.jwt_token`, otherwise we return null. In order to construct a `forum_example.jwt_token` we use the Postgres [composite value input](https://www.postgresql.org/docs/9.6/static/rowtypes.html#AEN8046) syntax which looks like `('forum_example_person', account.person_id)`. Then we cast that composite value with `::forum_example.jwt_token`. The order in which the values go is the order in which they were originally defined. Since we defined `role` first and `person_id` second, this JWT will have a `role` of `forum_example_person` and a `person_id` of `account.person_id`.

> **Warning:** Passwords will be in plaintext from the browser from the database to this function as well. This isn’t bad, just make sure to be careful of logging so you aren’t accidently logging users’ passwords.

Now that we know how to get JWTs for our users, let’s use our authorized user, and see what permissions we can give them.

### Using the Authorized User
Before we define permissions for our user, let’s utilize the fact that they are logged in by defining a quick Postgres function.

```sql
create function forum_example.current_person() returns forum_example.person as $$
  select *
  from forum_example.person
  where id = current_setting('jwt.claims.person_id')::integer
$$ language sql stable;

comment on function forum_example.current_person() is 'Gets the person who was identified by our JWT.';
```

This is a simple function that we can use in PostGraphQL, or our database to get the person who is currently executing the query. The one new concept here is `current_setting('jwt.claims.person_id')::integer`. As we discussed before, PostGraphQL will serialize your JWT to the database in the form of transaction local settings. Using the `current_setting` function is how we access those settings. Also note that we cast the value to an integer with `::integer`. This is because the Postgres `current_setting` function will always return a string. If you need another data type, you will likely need to cast to that data type.

That was a simple example, let’s get on to the fun stuff about auth, permissions.

### Grants
The highest level of permissions can be given to roles using the Postgres [`GRANT`](https://www.postgresql.org/docs/9.6/static/sql-grant.html) command. The access privileges defined by `GRANT` works on no smaller level than the table level. As you can allow a role to select an value from a table, or delete any value in a table. We will look at how to restrict access on a row level next, but first we need to define some grants:

```sql
grant usage on schema forum_example to forum_example_anonymous, forum_example_person;

grant select on table forum_example.person to forum_example_anonymous, forum_example_person;
grant update, delete on table forum_example.person to forum_example_person;

grant select on table forum_example.post to forum_example_anonymous, forum_example_person;
grant insert, update, delete on table forum_example.post to forum_example_person;
grant usage on sequence forum_example.post_id_seq to forum_example_person;

grant execute on function forum_example.person_full_name(forum_example.person) to forum_example_anonymous, forum_example_person;
grant execute on function forum_example.post_summary(forum_example.post, integer, text) to forum_example_anonymous, forum_example_person;
grant execute on function forum_example.person_latest_post(forum_example.person) to forum_example_anonymous, forum_example_person;
grant execute on function forum_example.search_posts(text) to forum_example_anonymous, forum_example_person;
grant execute on function forum_example.authenticate(text, text) to forum_example_anonymous, forum_example_person;
grant execute on function forum_example.current_person() to forum_example_anonymous, forum_example_person;

grant execute on function forum_example.register_person(text, text, text, text) to forum_example_anonymous;
```

See how we had to grant permissions on every single Postgres object we have defined so far? Postgres permissions work as a whitelist and not a blacklist, so therefore no one has more access then you explicitly give them. Let’s walk through the grants:

1. `grant usage on schema forum_example to forum_example_anonymous, forum_example_person`: First we say that anonymous users (`forum_example_anonymous`) and logged in users (`forum_example_person`) may use the objects in the `forum_example` schema. This does not mean that those roles can use anything they want in the schema, it just allows the roles to know the schema even exists in the first place. Also note that we did not grant usage permissions for the `forum_example_private` schema.
2. `grant select on table forum_example.person to forum_example_anonymous, forum_example_person`: Next we give anonymous users and logged in users the ability to read all of the rows in the `forum_example.person` table.
3. `grant update, delete on table forum_example.person to forum_example_person`: Here we give *only* logged in users the ability to update and delete rows from the `forum_example.person` table. This means that anonymous users can never update or delete a person. However, also note that users can update and delete all rows in the table with just a grant. We will fix this later.
4. `grant select ...` and `grant insert, update, delete ...`: We do the same thing with these two grants as we did with the grants above. The only difference here is that we also give signed in users the ability to `insert` into `forum_example.post`. We do not allow anyone to insert directly into `forum_example.person`, instead users should use the `forum_example.register_person` function.
5. `grant usage on sequence forum_example.post_id_seq to forum_example_person`: When a user creates a new `forum_example.post` because we use the `serial` data type for the `id` column, they will also need to get the next value in the `forum_example.post_id_seq`. Therefore, we must grant them permission to use the sequence as well. A sequence also exists for our person table (`forum_example.person_id_seq`), but since we are only creating people through `forum_example.register_person` and that function specifies `security definer`, we don’t need to grant access to the person id sequence.
6. `grant execute ...`: We have to give the anonymous user and logged in users access to all of the Postgres functions we define. All of the functions are executable by both types of users, except `forum_example.register_person` which we only let anonymous users execute. There’s no need for logged in users to register a new user!

This provides basic permissions for all of our Postgres objects, but as we mentioned before users can update and delete all and any persons or posts. For obvious reasons we don’t want this, so let’s define row level security next.

### Row Level Security
In Postgres 9.5 (released January 2016) [Row Level Security (RLS)](https://www.postgresql.org/docs/9.6/static/ddl-rowsecurity.html) was introduced. RLS allows us to specify access to the data in our Postgres databases on a row level instead of a table level like the [`GRANT`](https://www.postgresql.org/docs/9.6/static/sql-grant.html) command. In order to enable row level security on our tables we first need to run the following:

```sql
alter table forum_example.person enable row level security;
alter table forum_example.post enable row level security;
```

Before running these commands, the `forum_example_person` and `forum_example_anonymous` roles could see every row in the table with a `select * from forum_example.person` query. Now they can’t. By enabling row level security, our roles don’t have any access to read or write to a table that you don’t explicitly give. So how do we give permission to select rows? With the [`CREATE POLICY`](https://www.postgresql.org/docs/9.6/static/sql-createpolicy.html) command. To allow users to read all of the rows in our tables again, we create the following policies:

```sql
create policy select_person on forum_example.person for select
  using (true);

create policy select_post on forum_example.post for select
  using (true);
```

Now both anonymous users and logged in users can see all of our `forum_example.person` rows and `forum_example.post` rows again. Next we want signed in users to be able to update and delete their row in `forum_example.person`.

```sql
create policy update_person on forum_example.person for update to forum_example_person
  using (id = current_setting('jwt.claims.person_id')::integer);

create policy delete_person on forum_example.person for delete to forum_example_person
  using (id = current_setting('jwt.claims.person_id')::integer);
```

We use the current `person_id` from our JWT and only allow updates and deletes on rows with the same id. Also note how we added `to forum_example_person` where in the policies above we did not include such a line. This is because we only want these policies to apply for the `forum_example_person` role. Even though `forum_example_anonymous` was not granted access to update or delete the `forum_example.person` table it does not hurt to be specific.

That’s all we need to define for our person table. Now let’s define three policies for our posts table. One for `INSERT`, `UPDATE`, and `DELETE`.

```sql
create policy insert_post on forum_example.post for insert to forum_example_person
  with check (author_id = current_setting('jwt.claims.person_id')::integer);

create policy update_post on forum_example.post for update to forum_example_person
  using (author_id = current_setting('jwt.claims.person_id')::integer);

create policy delete_post on forum_example.post for delete to forum_example_person
  using (author_id = current_setting('jwt.claims.person_id')::integer);
```

These policies are very similar to the ones before, except that the `insert_post` policy uses `with check` instead of `using` like our other policies. The difference between `with check` and `using` is roughly that `using` is applied *before* any operation occurs to the table’s rows. So in the case of updating a post, one could not update a row that does not have the appropriate `author_id` in the first place. `with check` is run *after* an operation is applied. If the `with check` fails the operation will be rejected. So in the case of an update, Postgres sets all of the columns as specified and then compares against `with check` on the new row. You must use `with check` with `INSERT` commands because there are no rows to compare against before insertion, and you must use `using` with `DELETE` commands because a delete changes no rows only removes current ones.

* * *

## Conclusion

That’s it! We have succesfully creating a Postgres schema with our business logic embedded within. When we use this schema with PostGraphQL we will also get a well designed GraphQL API that we can use in our frontend. Now you should be equipped with the knowledge to go out and design your own Postgres schema.

If you have any questions, encounter a bug, or just want to say thank you, don’t hesitate to [open an issue](https://github.com/calebmer/postgraphql/issues). We’d love to hear from you. The PostGraphQL community wants to invest in making you a productive developer so that you can invest back, this is what make the best open source projects.

<!-- TODO: More next steps and calls to action -->

The final argument list for starting a PostGraphQL server with this schema would be as follows:

```bash
postgraphql \
  --connection postgres://forum_example_postgraphql:password@localhost:5432 \
  --schema forum_example \
  --default-role forum_example_anonymous \
  --secret keyboard_kiten \
  --token forum_example.jwt_token
```
