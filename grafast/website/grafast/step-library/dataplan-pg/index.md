---
sidebar_position: 10
---

# @dataplan/pg

This collection of steps gives incredible performance when dealing with
Postgres directly.

To operate, `@dataplan/pg` requires an understanding of your database. To do
so, it uses the concepts of [codecs](./codecs.md) (which represent the types in
your database - both scalar and composite), [resources](./resources.md) (which
represent the sources of data inside your database - tables, views, functions,
etc), and [relations](./relations.md) (which represent links between codecs and
the resources they relate to). These three things together combine into the
[registry](./registry.md).

Once you have your registry, you can utilise it to fetch rows from tables/views
(via `resource.get()` (one) or `resource.find()` (many)), call database
functions (via `resource.execute()`), or perform mutations (via
`pgInsertSingle()`, `pgUpdateSingle()` or `pgDeleteSingle()`).

Thanks to Gra*fast*'s planning system and `@dataplan/pg`'s understanding of
your database, as you use the methods on the steps that represent your
tables to access their attributes, traverse their relations, set their
columns, etc; `@dataplan/pg` can look at the actions you're taking and compile
the most efficient SQL query or queries in order fulfill your requirements with
minimal database effort. This all happens behind the scenes without you having
to think about it (though should you wish to dig deeper, for example to deal
with a performance edge-case, we do give you the tools to influence it).

`@dataplan/pg` was designed to be easy to work with; although it isn't an ORM
(dealing with "steps" that represent the nodes in a Gra*fast* plan diagram,
rather than dealing with the concrete runtime data) it has helpers for all
the most common actions you'll need, plus APIs to allow you to add your own
SQL expressions and sources should you need to.

Lets get started by looking at building the registry.
