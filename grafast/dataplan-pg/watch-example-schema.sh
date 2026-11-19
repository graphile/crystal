GRAPHILE_ENV=development yarn nodemon --watch ../../grafast/grafast/dist --watch dist --watch examples --ext js,mjs,mts,json -x "node --enable-source-maps $1 serve-example-schema.mts"
