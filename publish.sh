#!/usr/bin/env bash
set -e -x

BUILD_DIR=postgraphile-private/builds

cd ..
tar tzf $BUILD_DIR/graphile__lru.tgz
tar tzf $BUILD_DIR/tamedevil.tgz
tar tzf $BUILD_DIR/graphile-config.tgz
tar tzf $BUILD_DIR/ruru-components.tgz
tar tzf $BUILD_DIR/ruru.tgz
tar tzf $BUILD_DIR/grafast.tgz
tar tzf $BUILD_DIR/grafserv.tgz
tar tzf $BUILD_DIR/dataplan__json.tgz
tar tzf $BUILD_DIR/eslint-plugin-graphile-export.tgz
tar tzf $BUILD_DIR/graphile-utils.tgz
tar tzf $BUILD_DIR/graphile-export.tgz
tar tzf $BUILD_DIR/jest-serializer-graphql-schema.tgz
tar tzf $BUILD_DIR/jest-serializer-simple.tgz
tar tzf $BUILD_DIR/graphile-build.tgz
tar tzf $BUILD_DIR/pg-introspection.tgz
tar tzf $BUILD_DIR/pg-sql2.tgz
tar tzf $BUILD_DIR/dataplan__pg.tgz
tar tzf $BUILD_DIR/graphile-build-pg.tgz
tar tzf $BUILD_DIR/postgraphile.tgz
tar tzf $BUILD_DIR/graphile__simplify-inflection.tgz
tar tzf $BUILD_DIR/grafserv__persisted.tgz
tar tzf $BUILD_DIR/graphile.tgz

read -n1 -p "Publish? [y,n]" doit
case $doit in
  y|Y)
    npm publish --access=public --tag=prealpha $BUILD_DIR/graphile__lru.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/tamedevil.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/graphile-config.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/ruru-components.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/ruru.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/grafast.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/grafserv.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/dataplan__json.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/eslint-plugin-graphile-export.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/graphile-utils.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/graphile-export.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/jest-serializer-graphql-schema.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/jest-serializer-simple.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/graphile-build.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/pg-introspection.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/pg-sql2.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/dataplan__pg.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/graphile-build-pg.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/postgraphile.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/graphile__simplify-inflection.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/grafserv__persisted.tgz
    npm publish --access=public --tag=prealpha $BUILD_DIR/graphile.tgz
    ;;
  *) echo 'Not publishing' ;;
esac
