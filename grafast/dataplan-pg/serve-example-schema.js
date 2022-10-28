const { makeExampleSchema } = require("./dist/examples/exampleSchema");
const { grafserv } = require("grafserv");
const { createServer } = require("node:http");

const schema = makeExampleSchema();
const instance = grafserv({}, { schema });
const server = createServer(instance.handler);
server.listen(5555);
console.log("Listening on http://localhost:5555/");
