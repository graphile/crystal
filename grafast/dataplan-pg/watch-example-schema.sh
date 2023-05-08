GRAPHILE_ENV=development yarn nodemon --watch ../../grafast/grafast/dist --watch dist -x "node --enable-source-maps $1 serve-example-schema.js"
