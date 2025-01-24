---
title: Evaluating PostGraphile
---

# Does PostGraphile Fit Your Project?

Hopefully you’ve been convinced that PostGraphile serves an awesome GraphQL API,
but now let’s take a more critical look at whether or not you should adopt
PostGraphile for your project.

PostGraphile’s audience is for people who want to prioritize their product.
PostGraphile allows you to define your content model in the database as you
normally would, however instead of building the bindings to the database (your
API) PostGraphile takes care of it.

This takes a huge maintenance burden off your shoulders. Now you don’t have to
worry about optimizing the API and the database, instead you can focus on just
optimizing your database. Scaling a database is well-understood — and you can
combine techniques — scaling vertically with larger database servers (more RAM,
faster storage), or horizontally with read replicas.

### No Lock-In

PostGraphile does not lock you into using PostGraphile forever — in fact most of
the work you do implementing a PostGraphile API is in your database, which you
can take with you if you chose to move to a different system, so no work is
lost. If you feel comfortable with the cost of building your API, PostGraphile
is simple to switch with a custom solution — you can even export the GraphQL SDL
PostGraphile builds for you so you just need to implement your own resolvers.
And thanks to `graphile-export`, if your plugins support it, you can export
your GraphQL schema as executable code including the Gra*fast* plan resolvers.

PostGraphile does not ask you to do anything too divergent with your PostgreSQL
schema, allowing you to take your schema (and all your data) to whatever
solution you build next, and being confident that it was well designed — hand
rolled by you! GraphQL itself provides a simple and clear deprecation path if
you want to start using different fields. And of course with Graphile Build
plugins you can extend (or remove) functionality as you wish.

Further, you can migrate away from PostGraphile bit by bit by placing a GraphQL
proxy in front of it and redirecting certain resolvers to your new solution.
This enables you to move away from PostGraphile with zero downtime.

Ideally PostGraphile will scale with your company (get in touch if you're
facing scaling issues — we can almost certainly help!), however there is a
simple exit path even years into the business. We welcome your contributions to
help PostGraphile scale and meet your needs, and are very open to sponsored
improvements to the software.

### Schema Driven APIs

If you fundamentally disagree with "one-to-one mapping of a SQL schema to an
API" (GraphQL or otherwise) this section is for you.

First of all, PostGraphile's out of the box behavior is not necessarily meant
to be the be-all and end-all of your API. PostGraphile was created to allow you
to focus on your product and not the API. If you need to integrate external
systems, there are easy to use ways to extend your schema (e.g.
[`makeExtendSchemaPlugin`](./make-extend-schema-plugin)). If you want to
exclude things from your schema, we have a powerful [behavior
system](./behavior) you can use to accomplish that using global preferences and
local overrides, or you can simply [remove things from the
schema](./extending-raw#removing-things-from-the-schema). If you want a custom
manually written API there is a simple transition path (read [no lock
in](#no-lock-in)).

If you still can’t get over the auto-generated nature of PostGraphile consider
the following arguments why putting your business logic in PostgreSQL is a good
idea:

1.  PostgreSQL already has a powerful [user management system][user-management]
    with fine grained [row level security][row-level-security]. A custom API
    would mean you have to build your own user management and security, and
    having to guarantee that every possible route to your database data is
    vetted by the same permissions logic (which PostgreSQL RLS does for you).
2.  PostgreSQL allows you to hide implementation details with [views][pg-views]
    of your data. Simple views can even be [auto-updatable][pg-udpatable-views].
    This provides you with the same freedom and flexibility as you might want
    from a custom API except more performant.
3.  PostgreSQL gives you automatic relations with the `REFERENCES` constraint
    and PostGraphile [automatically detects them](./relations). With a custom
    API, you’d need to hardcode these relationships, which can become quite a
    chore!
4.  For what it’s worth, you can write in your favorite scripting language in
    PostgreSQL, including [JavaScript][js-in-pg] and [Ruby][ruby-in-pg].
5.  If you don’t want to write your code inside PostgreSQL, you could also use
    PostgreSQL’s [`NOTIFY`][pg-notify] feature to fire events to a listening
    Ruby or [JavaScript][node-pg-notify] microservice (this could include email
    transactions and event reporting), implement a job queue ([Graphile
    Worker](https://github.com/graphile/worker) is one approach to this), or
    add a Graphile Build plugin to wrap or replace a PostGraphile plan
    resolver.
6.  Well implemented[^1] logic in the database can be hundreds or even thousands
    of times faster than implementing the same logic in the application layer
    via an ORM or similar abstraction; this performance improvement can
    eliminate the need for caching and the dreaded cache invalidation problem,
    at least for a while. In the database, all the data is _right there_ -
    there's no need for expensive round-trips over the network, and the
    serialization/deserialization and data transfer costs are eliminated since
    no data is transferred to remote clients.

Still worried about a certain aspect of a schema driven API? Open an issue,
we're confident we can convince you otherwise 😉

[^1]:
    "Well implemented" because it's easy to write code that performs really
    badly in the database (just as it is in the application layer) if you use the
    wrong approach. The procedural patterns you may have learned in your
    programming language of choice are likely not the patterns that you should
    employ in the database — databases (and SQL) use a more declarative approach to
    programming, when you use procedural patterns you can introduce huge
    performance issues. For example: looping in the database is expensive, instead
    you should use single statements to process all your data at once in a way that
    can be highly optimized. Function calls are also expensive in PostgreSQL,
    instead of calling a function as part of every row (especially when there could
    be hundreds of millions of rows!) you should try and call a function once for
    the entire set. We have some documentation on this in [Understanding function
    performance](./functions#understanding-function-performance) and [Writing
    performant RLS policies](./required-knowledge#writing-performant-rls-policies).

[user-management]: http://www.postgresql.org/docs/current/static/user-manag.html
[row-level-security]: http://www.postgresql.org/docs/current/static/ddl-rowsecurity.html
[pg-views]: http://www.postgresql.org/docs/current/static/sql-createview.html
[pg-udpatable-views]: http://www.postgresql.org/docs/current/static/sql-createview.html#SQL-CREATEVIEW-UPDATABLE-VIEWS
[js-in-pg]: https://blog.heroku.com/archives/2013/6/5/javascript_in_your_postgres
[ruby-in-pg]: https://github.com/knu/postgresql-plruby
[pg-notify]: http://www.postgresql.org/docs/current/static/sql-notify.html
[node-pg-notify]: https://www.npmjs.com/package/pg-pubsub

_This article was originally written by
[Caleb Meredith](https://twitter.com/calebmer)._
