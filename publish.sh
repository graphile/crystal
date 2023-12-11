#!/usr/bin/env bash
set -e -x

BUILD_DIR=crystal/builds
TAG=beta

PACKAGES=(
  #"$BUILD_DIR/graphile__lru.tgz"
  #"$BUILD_DIR/tamedevil.tgz"
  #"$BUILD_DIR/graphile-config.tgz"
  #"$BUILD_DIR/ruru-components.tgz"
  #"$BUILD_DIR/ruru.tgz"
  #"$BUILD_DIR/grafast.tgz"
  #"$BUILD_DIR/grafserv.tgz"
  #"$BUILD_DIR/dataplan__json.tgz"
  #"$BUILD_DIR/eslint-plugin-graphile-export.tgz"
  #"$BUILD_DIR/graphile-export.tgz"
  #"$BUILD_DIR/jest-serializer-graphql-schema.tgz"
  #"$BUILD_DIR/jest-serializer-simple.tgz"
  #"$BUILD_DIR/graphile-build.tgz"
  #"$BUILD_DIR/pg-introspection.tgz"
  #"$BUILD_DIR/pg-sql2.tgz"
  #"$BUILD_DIR/dataplan__pg.tgz"
  #"$BUILD_DIR/graphile-build-pg.tgz"
  #"$BUILD_DIR/graphile-utils.tgz"
  #"$BUILD_DIR/postgraphile.tgz"
  #"$BUILD_DIR/pgl.tgz"
  #"$BUILD_DIR/graphile__simplify-inflection.tgz"
  #"$BUILD_DIR/grafserv__persisted.tgz"
  #"$BUILD_DIR/graphile.tgz"
)


cd ..
for I in ${PACKAGES[*]}; do
  tar tzf "$I"
done

read -n1 -p "Publish? [y,n]" doit
case $doit in
  y|Y)
    for I in ${PACKAGES[*]}; do
      npm publish --access=public --tag="$TAG" "$I"
    done
    ;;
  *) echo 'Not publishing' ;;
esac
