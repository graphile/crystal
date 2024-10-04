const { makeExampleSchema } = require("./dist/examples/exampleSchema");
const { grafserv } = require("grafserv/node");
const { createServer } = require("node:http");
const { createWithPgClient } = require("./dist/adaptors/pg");

const schema = makeExampleSchema();
const withPgClient = createWithPgClient({
  connectionString:
    process.env.TEST_DATABASE_URL || "postgres:///graphile_crystal",
});
const serv = grafserv({
  preset: { grafast: { context: { withPgClient }, explain: true } },
  schema,
});
const server = createServer();
serv.addTo(server);
server.listen(5555);
console.log("Listening on http://localhost:5555/");
