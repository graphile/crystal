#!/usr/bin/env bash
set -e -x

rm -rf builds/
mkdir builds/

yarn clean
yarn workspaces-build-release

pack_pkg() {
  local repoDir="$1"
  local outputBasename="$2"
  local repoRoot="$(pwd)"

  # sub-shell means no need to `cd -`
  (
    cd "${repoDir}/release" || return 1
    rm package.tgz
    yarn pack -o package.tgz
    mv package.tgz "${repoRoot}/builds/${outputBasename}.tgz"
  )
}

pack_pkg utils/lru graphile__lru
pack_pkg utils/tamedevil tamedevil
pack_pkg utils/graphile-config graphile-config
pack_pkg grafast/grafast
pack_pkg grafast/ruru-types ruru-types
pack_pkg grafast/ruru-components ruru-components
pack_pkg grafast/ruru ruru
pack_pkg grafast/grafserv grafserv
pack_pkg grafast/dataplan-json dataplan__json
pack_pkg utils/eslint-plugin-graphile-export eslint-plugin-graphile-export
pack_pkg utils/graphile-export graphile-export
pack_pkg utils/jest-serializer-graphql-schema jest-serializer-graphql-schema
pack_pkg utils/jest-serializer-simple jest-serializer-simple
pack_pkg graphile-build/graphile-build graphile-build
pack_pkg utils/pg-introspection pg-introspection
pack_pkg utils/pg-sql2 pg-sql2
pack_pkg grafast/dataplan-pg dataplan__pg
pack_pkg graphile-build/graphile-build-pg/ graphile-build-pg
pack_pkg graphile-build/graphile-utils graphile-utils
pack_pkg postgraphile/postgraphile/ postgraphile
pack_pkg postgraphile/pgl/ pgl
pack_pkg graphile-build/graphile-simplify-inflection graphile__simplify-inflection
pack_pkg grafast/grafserv-persisted grafserv__persisted
pack_pkg utils/graphile graphile
pack_pkg grafast/codegen-plugin graphql-codegen-grafast

echo "All packages packed into 'builds/'"
echo "Now publish them with './publish.sh'"
