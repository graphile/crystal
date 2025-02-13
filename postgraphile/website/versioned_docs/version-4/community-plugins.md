---
title: Community Plugins
---

# PostGraphile Community Plugins

Community members can write plugins for PostGraphile that extends its
functionality; this page lists some of them. Issues with these plugins should be
directed to the plugin authors, not to this project. This page is maintained by
the community and is not an endorsement by the project.

If you have written a PostGraphile plugin (or have found one that is not listed
here), then please feel free to add it, you can
the “edit this page” link below to do so.

See the [CLI](./usage-cli) or [library](./usage-library) docs for how to load
plugins.

Schema extension plugins for PostGraphile:

- [postgraphile-plugin-connection-filter](https://github.com/graphile-contrib/postgraphile-plugin-connection-filter) -
  adds a `filter:` arg to connections that offers a more powerful alternative to
  the built in filtering operations
- [postgraphile-plugin-connection-filter-polymorphic](https://github.com/hansololai/postgraphile-connection-filter-polymorphic) -
  adds association filter on top of connection filter for polymorphic
  associations.
- [postgraphile-polymorphic-relation_plugin](https://www.npmjs.com/package/postgraphile-polymorphic-relation-plugin) -
  create associations (forward and backward) between models via polymorphic
  associations. (same concept as
  postgraphile-plugin-connection-filter-polymorphic).
- [postgraphile-index-to-unique-constraint-plugin](https://github.com/hansololai/postgraphile-index-to-unique-constraint-plugin) -
  extends PostGraphile's unique constraint detection to unique indexes also.
- [postgraphile-table-extension-plugin](https://github.com/hansololai/postgraphile-table-extension-plugin) -
  extend a table's fields (non-association) to another table via unique foreign
  key constraint. Useful for vertical partitioned tables.
- [postgraphile-plugin-custom-filter](https://github.com/RoadRunnerEngineering/postgraphile-plugin-custom-filter) -
  adds a `customFilter:` arg to connections that offers user defined filters on
  any conditions, as long as they can be fit into a `where`
- [postgraphile-plugin-atomic-mutations](https://github.com/EmperorRXF/postgraphile-plugin-atomic-mutations) -
  enables mutation atomicity with GraphQL requests containing multiple mutations
- [postgraphile-plugin-nested-mutations](https://github.com/mlipscombe/postgraphile-plugin-nested-mutations) -
  enables a single mutation to create/update many related records
- [graphile-upsert-plugin](https://github.com/einarjegorov/graphile-upsert-plugin/blob/master/index.js) -
  adds upsert mutations
- [@fullstackio/postgraphile-upsert-plugin](https://github.com/jashmenn/postgraphile-upsert-plugin) -
  another upsert mutations plugin - adds upsert `where` conditions
- [@graphile-contrib/pg-simplify-inflector](https://github.com/graphile-contrib/pg-simplify-inflector) -
  simplifies field names by automatically removing `ByFooIdAndBarId`-style
  suffixes.
- [@graphile-contrib/pg-omit-archived](https://github.com/graphile-contrib/pg-omit-archived) -
  allows soft-deletes and automatic hiding of records with a particular flag
- [@graphile-contrib/pg-many-to-many](https://github.com/graphile-contrib/pg-many-to-many) -
  adds connection fields for many-to-many relations.
- [@graphile-contrib/pg-order-by-related](https://github.com/graphile-contrib/pg-order-by-related) -
  enables ordering by related table columns.
- [@graphile-contrib/pg-order-by-multi-column-index](https://github.com/graphile-contrib/pg-order-by-multi-column-index) -
  enables ordering by multi-column indexes when using `ignoreIndexes: false`.
- [postgraphile-plugin-derived-field](https://github.com/mattbretl/postgraphile-plugin-derived-field) -
  provides an interface for adding derived fields
- [postgraphile-plugin-upload-field](https://github.com/mattbretl/postgraphile-plugin-upload-field) -
  enables file uploads (see `postgraphile-upload-example` below)
- [postgraphile-plugin-connection-multi-tenant](https://github.com/deden/postgraphile-plugin-connection-multi-tenant) -
  "Filtering Connections in PostGraphile by Tenants"
- [graphile-build-postgis](https://github.com/singingwolfboy/graphile-build-postgis) -
  PostGIS support (WIP)
- [postgraphile-pm2-status](https://github.com/stlbucket/philede/blob/master/api/src/graphile-extensions/pm2Status.js) -
  expose pm2 process status thru a query
- [PassportLoginPlugin](https://github.com/graphile/examples/blob/master/shared/plugins/PassportLoginPlugin.js) -
  example plugin to add a username/password `login` and `register` mutations
  using Passport.js
- [postgraphile-plugin-fulltext-filter](https://github.com/mlipscombe/postgraphile-plugin-fulltext-filter) -
  adds support for `tsvector` full text search fields to
  postgraphile-plugin-connection-filter
- [postgraphile-plugin-zombodb](https://github.com/mlipscombe/postgraphile-plugin-zombodb) -
  adds advanced search capabilities using
  [ZomboDB](https://github.com/zombodb/zombodb) and ElasticSearch
- [postgraphile-plugin-many-create-update-delete](https://github.com/tjmoses/postgraphile-plugin-many-create-update-delete) -
  generates batch create, update, & delete mutations
- [graphile-column-privileges-mutations](https://github.com/pyramation/graphile-column-privileges-mutations) -
  generates mutations safe to use with column-level select grants
- [postgraphile-remove-foreign-key-fields-plugin](https://github.com/jarvisuser90/postgraphile-remove-foreign-key-fields-plugin) -
  Removes all foreign key fields from the GraphQL schema while still allowing
  foreign relationships to be created.
- [postgraphile-plugin-timestamp-format](https://github.com/RedShift1/postgraphile-plugin-timestamp-format) -
  Format timestamps with PostgreSQL's to_char function. Supports timezones too

Examples of using these plugins:

- [postgraphile-upload-example](https://github.com/mattbretl/postgraphile-upload-example) -
  demonstrates how to add file upload support to PostGraphile using the GraphQL
  Multipart Request Spec.

These extensions extend PostGraphile in different ways:

- [hapi-postgraphile](https://github.com/mshick/hapi-postgraphile) - add
  PostGraphile to your HAPI application
