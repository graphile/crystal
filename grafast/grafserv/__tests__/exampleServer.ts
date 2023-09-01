import { createServer } from "node:http";
import type { AddressInfo } from "node:net";

import { constant, makeGrafastSchema } from "grafast";

import { grafserv } from "../src/servers/node/index.js";

export async function makeExampleServer() {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String!
      }
    `,
    plans: {
      Query: {
        hello() {
          return constant("world");
        },
      },
    },
  });

  const preset = {
    grafserv: {
      graphqlOverGET: true,
      graphqlPath: "/graphql",
      dangerouslyAllowAllCORSRequests: true,
    },
  }; /*satisfies GraphileConfig.Preset*/
  const serv = grafserv({ schema, preset });
  const server = createServer(serv.createHandler());
  const promise = new Promise<void>((resolve, reject) => {
    server.on("listening", () => {
      server.off("error", reject);
      resolve();
    });
    server.on("error", reject);
  });
  server.listen();
  await promise;
  const info = server.address() as AddressInfo;
  const url = `http://${
    info.family === "IPv6"
      ? `[${info.address === "::" ? "::1" : info.address}]`
      : info.address
  }:${info.port}${preset.grafserv.graphqlPath}`;

  const release = () => server.close();
  return { url, release };
}

if (require.main === module) {
  const serverPromise = makeExampleServer();
  serverPromise.then(
    (server) => {
      console.log(server.url);
    },
    (e) => {
      console.error(e);
      process.exit(1);
    },
  );
}
