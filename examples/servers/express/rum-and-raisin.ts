#!/usr/bin/env -S npx ts-node
import express = require('express');
import { postgraphile } from /*'postgraphile'*/ '../../../';
import { database, schemas, options, port } from '../common';

const middleware = postgraphile(database, schemas, options);

const app = express();

/******************************************************************************/
// These middlewares aren't needed; we just add them to make sure that
// PostGraphile still works correctly with them in place.

import expressCompression = require('compression');
app.use(expressCompression({ threshold: 0 }));

import helmet = require('helmet');
app.use(helmet());

import morgan = require('morgan');
app.use(morgan('tiny'));

import bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'application/graphql' }));

/******************************************************************************/

app.use(middleware);

const server = app.listen(port, () => {
  const address = server.address();
  if (typeof address !== 'string') {
    const href = `http://localhost:${address.port}${options.graphiqlRoute || '/graphiql'}`;
    console.log(`PostGraphiQL available at ${href} 🚀`);
  } else {
    console.log(`PostGraphile listening on ${address} 🚀`);
  }
});
