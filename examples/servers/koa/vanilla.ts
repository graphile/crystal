#!/usr/bin/env -S npx ts-node
import koa = require('koa');
import { createServer } from 'http';
import { postgraphile } from /*'postgraphile'*/ '../../../';
import { database, schemas, options, port } from '../common';

const middleware = postgraphile(database, schemas, options);

const app = new koa();
app.use(middleware);

const server = createServer(app.callback());
server.listen(port, () => {
  const address = server.address();
  if (typeof address !== 'string') {
    const href = `http://localhost:${address.port}${options.graphiqlRoute || '/graphiql'}`;
    console.log(`PostGraphiQL available at ${href} 🚀`);
  } else {
    console.log(`PostGraphile listening on ${address} 🚀`);
  }
});
