#!/usr/bin/env bash
set -e -x

cd ..
tar tzf postgraphile-private/builds/graphile-config.tgz
tar tzf postgraphile-private/builds/ruru.tgz
tar tzf postgraphile-private/builds/graphile__lru.tgz
tar tzf postgraphile-private/builds/grafast.tgz
tar tzf postgraphile-private/builds/grafserv.tgz
tar tzf postgraphile-private/builds/dataplan__json.tgz
tar tzf postgraphile-private/builds/eslint-plugin-graphile-export.tgz
tar tzf postgraphile-private/builds/graphile-utils.tgz
tar tzf postgraphile-private/builds/graphile-export.tgz
tar tzf postgraphile-private/builds/jest-serializer-graphql-schema.tgz
tar tzf postgraphile-private/builds/jest-serializer-simple.tgz
tar tzf postgraphile-private/builds/graphile-build.tgz
tar tzf postgraphile-private/builds/pg-introspection.tgz
tar tzf postgraphile-private/builds/pg-sql2.tgz
tar tzf postgraphile-private/builds/dataplan__pg.tgz
tar tzf postgraphile-private/builds/graphile-build-pg.tgz
tar tzf postgraphile-private/builds/postgraphile.tgz

read -n1 -p "Publish? [y,n]" doit
case $doit in
  y|Y)
    npm publish --access=public --tag=prealpha postgraphile-private/builds/graphile-config.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/ruru.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/graphile__lru.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/grafast.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/grafserv.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/dataplan__json.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/eslint-plugin-graphile-export.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/graphile-utils.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/graphile-export.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/jest-serializer-graphql-schema.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/jest-serializer-simple.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/graphile-build.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/pg-introspection.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/pg-sql2.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/dataplan__pg.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/graphile-build-pg.tgz
    npm publish --access=public --tag=prealpha postgraphile-private/builds/postgraphile.tgz
    ;;
  *) echo 'Not publishing' ;;
esac
