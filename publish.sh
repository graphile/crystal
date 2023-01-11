#!/usr/bin/env bash
set -e -x
tar tzf builds/graphile-config.tgz
tar tzf builds/ruru.tgz
tar tzf builds/graphile__lru.tgz
tar tzf builds/grafast.tgz
tar tzf builds/grafserv.tgz
tar tzf builds/dataplan__json.tgz
tar tzf builds/eslint-plugin-graphile-export.tgz
tar tzf builds/graphile-utils.tgz
tar tzf builds/graphile-export.tgz
tar tzf builds/jest-serializer-graphql-schema.tgz
tar tzf builds/jest-serializer-simple.tgz
tar tzf builds/graphile-build.tgz
tar tzf builds/pg-introspection.tgz
tar tzf builds/pg-sql2.tgz
tar tzf builds/dataplan__pg.tgz
tar tzf builds/graphile-build-pg.tgz
tar tzf builds/postgraphile.tgz

read -n1 -p "Publish? [y,n]" doit
case $doit in
  y|Y)
    npm publish --access=public --tag=prealpha builds/graphile-config.tgz
    npm publish --access=public --tag=prealpha builds/ruru.tgz
    npm publish --access=public --tag=prealpha builds/graphile__lru.tgz
    npm publish --access=public --tag=prealpha builds/grafast.tgz
    npm publish --access=public --tag=prealpha builds/grafserv.tgz
    npm publish --access=public --tag=prealpha builds/dataplan__json.tgz
    npm publish --access=public --tag=prealpha builds/eslint-plugin-graphile-export.tgz
    npm publish --access=public --tag=prealpha builds/graphile-utils.tgz
    npm publish --access=public --tag=prealpha builds/graphile-export.tgz
    npm publish --access=public --tag=prealpha builds/jest-serializer-graphql-schema.tgz
    npm publish --access=public --tag=prealpha builds/jest-serializer-simple.tgz
    npm publish --access=public --tag=prealpha builds/graphile-build.tgz
    npm publish --access=public --tag=prealpha builds/pg-introspection.tgz
    npm publish --access=public --tag=prealpha builds/pg-sql2.tgz
    npm publish --access=public --tag=prealpha builds/dataplan__pg.tgz
    npm publish --access=public --tag=prealpha builds/graphile-build-pg.tgz
    npm publish --access=public --tag=prealpha builds/postgraphile.tgz
    ;;
  *) echo 'Not publishing' ;;
esac
