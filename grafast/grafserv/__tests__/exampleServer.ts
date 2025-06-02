import { createServer } from "node:http";
import type { AddressInfo } from "node:net";

import { constant, error, makeGrafastSchema } from "grafast";
import { resolvePreset } from "graphile-config";

import { grafserv as grafservNode } from "../src/servers/node/index.js";
import { grafserv as grafservWhatwg } from "../src/servers/whatwg-node__server/v0/index.js";

export async function makeExampleServer(
  preset: GraphileConfig.Preset = {
    grafserv: {
      graphqlOverGET: true,
      graphqlPath: "/graphql",
      dangerouslyAllowAllCORSRequests: true,
    },
  },
  type?: "node" | "whatwg",
) {
  const resolvedPreset = resolvePreset(preset);
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String!
        throwAnError: String
      }
    `,
    plans: {
      Query: {
        hello() {
          return constant("world");
        },
        throwAnError() {
          return error(new Error("You asked for an error... Here it is."));
        },
      },
    },
  });

  const serv =
    type === "whatwg"
      ? grafservWhatwg({ schema, preset })
      : grafservNode({ schema, preset });
  const server = createServer();
  serv.addTo(server);
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
  }:${info.port}${resolvedPreset.grafserv!.graphqlPath}`;

  const release = () => {
    serv.release();
    server.close();
    server.closeAllConnections();
  };
  return { url, release };
}

if (require.main === module) {
  const type = process.argv[2];
  if (type !== undefined && type !== "node" && type !== "whatwg") {
    throw new Error(`Unsupported type ${type}`);
  }
  if (type === "whatwg") {
    console.log("Running whatwg");
  }
  const serverPromise = makeExampleServer(undefined, type);
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
