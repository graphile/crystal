#!/usr/bin/env bash
set -e
set -x

# This script is designed to run on Benjie's machine and it's only temporary
# whilst we're publishing the docs to a single Heroku server. In future, we'll
# use GitHub pages... somehow. Once we figure out how to publish 4 separate
# websites from there...

(cd grafast/website && yarn build)
rm -rf ../../benjie/crystal-docs/grafast
cp -a grafast/website/build ../../benjie/crystal-docs/grafast

(cd postgraphile/website && yarn build)
rm -rf ../../benjie/crystal-docs/postgraphile
cp -a postgraphile/website/build ../../benjie/crystal-docs/postgraphile

(cd graphile-build/website && yarn build)
rm -rf ../../benjie/crystal-docs/graphile-build
cp -a graphile-build/website/build ../../benjie/crystal-docs/graphile-build

(cd utils/website && yarn build)
rm -rf ../../benjie/crystal-docs/star
cp -a utils/website/build ../../benjie/crystal-docs/star

cd ../../benjie/crystal-docs
git add grafast postgraphile graphile-build star
git commit -m"Update websites"
git push

