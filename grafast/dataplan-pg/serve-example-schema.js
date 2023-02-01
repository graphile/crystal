const { makeExampleSchema } = require("./dist/examples/exampleSchema");
const { grafserv } = require("grafserv/node");
const { createServer } = require("node:http");
const { createWithPgClient } = require("./dist/adaptors/node-postgres");

const schema = makeExampleSchema();
const withPgClient = createWithPgClient({
  connectionString: process.env.TEST_DATABASE_URL || "graphile_grafast",
});
const serv = grafserv({
  preset: { grafast: { context: { withPgClient }, explain: true } },
  schema,
});
const server = createServer(serv.createHandler());
server.listen(5555);
console.log("Listening on http://localhost:5555/");
