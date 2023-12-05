---
layout: page
path: /postgraphile/community-plugins/
title: PostGraphile community plugins
---

Community members can write plugins for PostGraphile that extends its
functionality; this page lists some of them. Issues with these plugins should be
directed to the plugin authors, not to this project. This page is maintained by
the community and is not an endorsement by the project.

If you have written a PostGraphile plugin (or have found one that is not listed
here), then please feel free to add it, you can use the "edit this page" link
to do so.

See [the configuration docs](./config/) for how to load
plugins.

Schema extension plugins for PostGraphile:

- [postgraphile-plugin-connection-filter](https://github.com/graphile-contrib/postgraphile-plugin-connection-filter) -
  adds a `filter:` arg to connections that offers a more powerful alternative to
  the built in filtering operations :white_check_mark:
- [@graphile/pg-aggregates](https://github.com/graphile/pg-aggregates) - aggregate support on connections :white_check_mark:
- [@graphile/simplify-inflection](https://github.com/graphile/crystal/tree/main/graphile-build/graphile-simplify-inflection) -
  simplifies field names by automatically removing `ByFooIdAndBarId`-style
  suffixes. :white_check_mark:
- [@graphile-contrib/pg-omit-archived](https://github.com/graphile-contrib/pg-omit-archived) -
  allows soft-deletes and automatic hiding of records with a particular flag :white_check_mark:
- [@graphile-contrib/pg-many-to-many](https://github.com/graphile-contrib/pg-many-to-many) -
  adds connection fields for many-to-many relations. :white_check_mark:
- [postgraphile-plugin-connection-filter-polymorphic](https://github.com/hansololai/postgraphile-connection-filter-polymorphic) -
  adds association filter on top of connection filter for polymorphic
  associations. :question:_(Not yet ported to V5)_
- [postgraphile-polymorphic-relation-plugin](https://www.npmjs.com/package/postgraphile-polymorphic-relation-plugin) -
  create associations (forward and backward) between models via polymorphic
  associations. (same concept as
  postgraphile-plugin-connection-filter-polymorphic). :question:_(Not yet ported to V5)_
- [postgraphile-index-to-unique-constraint-plugin](https://github.com/hansololai/postgraphile-index-to-unique-constraint-plugin) -
  extends PostGraphile's unique constraint detection to unique indexes also. :question:_(Not yet ported to V5)_
- [postgraphile-table-extension-plugin](https://github.com/hansololai/postgraphile-table-extension-plugin) -
  extend a table's fields (non-association) to another table via unique foreign
  key constraint. Useful for vertical partitioned tables. :question:_(Not yet ported to V5)_
- [postgraphile-plugin-custom-filter](https://github.com/RoadRunnerEngineering/postgraphile-plugin-custom-filter) -
  adds a `customFilter:` arg to connections that offers user defined filters on
  any conditions, as long as they can be fit into a `where` :question:_(Not yet ported to V5)_
- [postgraphile-plugin-atomic-mutations](https://github.com/EmperorRXF/postgraphile-plugin-atomic-mutations) -
  enables mutation atomicity with GraphQL requests containing multiple mutations :question:_(Not yet ported to V5)_
- [postgraphile-plugin-nested-mutations](https://github.com/mlipscombe/postgraphile-plugin-nested-mutations) -
  enables a single mutation to create/update many related records :question:_(Not yet ported to V5)_
- [graphile-upsert-plugin](https://github.com/einarjegorov/graphile-upsert-plugin/blob/master/index.js) -
  adds upsert mutations :question:_(Not yet ported to V5)_
- [@fullstackio/postgraphile-upsert-plugin](https://github.com/jashmenn/postgraphile-upsert-plugin) -
  another upsert mutations plugin - adds upsert `where` conditions :question:_(Not yet ported to V5)_
- [@graphile-contrib/pg-order-by-related](https://github.com/graphile-contrib/pg-order-by-related) -
  enables ordering by related table columns. :question:_(Not yet ported to V5)_
- [@graphile-contrib/pg-order-by-multi-column-index](https://github.com/graphile-contrib/pg-order-by-multi-column-index) -
  enables ordering by multi-column indexes when using `ignoreIndexes: false`. :question:_(Not yet ported to V5)_
- [postgraphile-plugin-derived-field](https://github.com/mattbretl/postgraphile-plugin-derived-field) -
  provides an interface for adding derived fields :question:_(Not yet ported to V5)_
- [postgraphile-plugin-upload-field](https://github.com/mattbretl/postgraphile-plugin-upload-field) -
  enables file uploads (see `postgraphile-upload-example` below) :question:_(Not yet ported to V5)_
- [postgraphile-plugin-connection-multi-tenant](https://github.com/deden/postgraphile-plugin-connection-multi-tenant) -
  "Filtering Connections in PostGraphile by Tenants" :question:_(Not yet ported to V5)_
- [graphile-build-postgis](https://github.com/singingwolfboy/graphile-build-postgis) -
  PostGIS support (WIP) :question:_(Not yet ported to V5)_
- [postgraphile-pm2-status](https://github.com/stlbucket/philede/blob/master/api/src/graphile-extensions/pm2Status.js) -
  expose pm2 process status thru a query :question:_(Not yet ported to V5)_
- [PassportLoginPlugin](https://github.com/graphile/examples/blob/master/shared/plugins/PassportLoginPlugin.js) -
  example plugin to add a username/password `login` and `register` mutations
  using Passport.js :question:_(Not yet ported to V5)_
- [postgraphile-plugin-fulltext-filter](https://github.com/mlipscombe/postgraphile-plugin-fulltext-filter) -
  adds support for `tsvector` full text search fields to
  postgraphile-plugin-connection-filter :question:_(Not yet ported to V5)_
- [postgraphile-plugin-zombodb](https://github.com/mlipscombe/postgraphile-plugin-zombodb) -
  adds advanced search capabilities using
  [ZomboDB](https://github.com/zombodb/zombodb) and ElasticSearch :question:_(Not yet ported to V5)_
- [postgraphile-plugin-many-create-update-delete](https://github.com/tjmoses/postgraphile-plugin-many-create-update-delete) -
  generates batch create, update, & delete mutations :question:_(Not yet ported to V5)_
- [graphile-column-privileges-mutations](https://github.com/pyramation/graphile-column-privileges-mutations) -
  generates mutations safe to use with column-level select grants :question:_(Not yet ported to V5; but not needed?)_
- [postgraphile-remove-foreign-key-fields-plugin](https://github.com/jarvisuser90/postgraphile-remove-foreign-key-fields-plugin) -
  Removes all foreign key fields from the GraphQL schema while still allowing
  foreign relationships to be created. :question:_(Not yet ported to V5, but use the "relay" preset instead?)_
- [postgraphile-plugin-timestamp-format](https://github.com/RedShift1/postgraphile-plugin-timestamp-format) -
  Format timestamps with PostgreSQL's to*char function. Supports timezones too :question:*(Not yet ported to V5)\_

Examples of using these plugins:

- [postgraphile-upload-example](https://github.com/mattbretl/postgraphile-upload-example) -
  demonstrates how to add file upload support to PostGraphile using the GraphQL
  Multipart Request Spec. :question:_(Not yet ported to V5)_

These extensions extend PostGraphile in different ways:

- [@grafserv/persisted](https://github.com/benjie/crystal/blob/main/grafast/grafserv-persisted) -
  adds support for persisted operations to Grafserv (and thus PostGraphile)
- [hapi-postgraphile](https://github.com/mshick/hapi-postgraphile) - add
  PostGraphile to your HAPI application :question:_(Not yet ported to V5)_
