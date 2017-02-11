# Welcome to the PostGraphQL Source Code
Hello, world! Welcome to the PostGraphQL source code. In this document we’ll try to help you understand the high level architecture of the code so you can be a valuable contributor instantly. Or if you’re still evaluating PostGraphQL we want to help you better understand the dependency you may or may not be bringing in.

As you navigate through the source code directory structure, you’ll see a number of `README`s explaining the code. This is the root.

## Running/Contributing

If you want to run this code locally, you should read the [contributing](../CONTRIBUTING.md) document for instructions.

## Top Level Modules
The PostGraphQL source code is made up of three parts, represented by the three modules: `postgres`, `graphql`, and `interface`. Both `postgres` and `graphql` depend on `interface`, but code from the `postgres` folder *will never* touch code from the `graphql` folder. Currently these three modules are all part of PostGraphQL, but in the future we would like to make each of these module’s their own independent Node.js module.

So how do these modules work together? Simply enough the `interface` module defines an abstract data interface. It has no knowledge of what a PostgreSQL system may look like, and no knowledge that it may be used to create a GraphQL API. The `postgres` module, however, does know about PostgreSQL and will turn the schema from a PostgreSQL database into the abstract data definition in `interface`. The `graphql` module will then consume the data definitions from `interface` to create a GraphQL API. So in a diagram:

PostgreSQL → Interface → GraphQL

We chose this model so that in the future we may be able to swap parts out. So the above diagram might instead look like:

MySQL → Interface → GraphQL

…or even:

PostgreSQL → Interface → REST

This flexibility gives PostGraphQL a very exciting future. However, it is also important to address that by choosing to make an abstracted data definition layer in the `interface` module, we are not choosing to only support the lowest common denominator of databases. The data definitions in `interface` are intended to be flexible enough to allow for any data model to fit nicely within. Also, we want to focus on the PostgreSQL to GraphQL bridge for now. We’ve built PostGraphQL this way because we are excited about what it could become, but in the short term we really only care to make users of PostGraphQL happy and very efficient.
