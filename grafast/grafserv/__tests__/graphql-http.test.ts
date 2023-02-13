import { fetch } from "@whatwg-node/fetch";
import { makeGrafastSchema } from "grafast";
import { serverAudits } from "graphql-http";
import type { Server } from "node:http";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";

// eslint-disable-next-line import/extensions -- TODO: other problems when adding extension
import { grafserv } from "../src/servers/node";

let server: Server | null = null;

beforeAll(() => {
  const schema = makeGrafastSchema({
    typeDefs: `
    type Query {
      hello: String!
    }
  `,
    plans: {
      Query: {
        hello() {
          return "world";
        },
      },
    },
  });

  const serv = grafserv({
    schema,
    preset: {
      server: {
        graphqlOverGET: true,
      },
    },
  });
  server = createServer(serv.createHandler());
  server.listen();
});

afterAll(() => {
  server?.close();
});

for (const audit of serverAudits({
  url: () =>
    `http://localhost:${(server!.address() as AddressInfo).port}/graphql`,
  fetchFn: fetch,
})) {
  it(audit.name, async () => {
    const result = await audit.fn();
    expect({
      ...result,
      response: "<omitted for brevity>",
    }).toEqual(
      expect.objectContaining({
        status: "ok",
      }),
    );
  });
}
