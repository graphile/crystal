/* eslint-disable graphile-export/export-methods, graphile-export/export-plans */
import type { ServerType } from "@hono/node-server";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { error } from "console";
import { constant, makeGrafastSchema } from "grafast";
import { serverAudits } from "graphql-http";
import { createClient } from "graphql-ws";
import { Hono } from "hono";
import { WebSocket } from "ws";

import type { GrafservConfig } from "../src/interfaces.ts";
import { grafserv } from "../src/servers/hono/v4/index.ts";

const PORT = 7777;

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      hello: String!
      throwAnError: String
    }

    type Subscription {
      subscriptionTest: String!
    }
  `,
  objects: {
    Query: {
      plans: {
        hello() {
          return constant("world");
        },
        throwAnError() {
          return error(new Error("You asked for an error... Here it is."));
        },
      },
    },
    Subscription: {
      plans: {
        subscriptionTest: {
          subscribe: async function* () {
            yield { subscriptionTest: "test1" };
            yield { subscriptionTest: "test2" };
          },
        },
      },
    },
  },
});

describe("Hono Adapter", () => {
  let server: ServerType | null = null;
  beforeEach(() => {
    // setup test server
    const app = new Hono();
    const config: GrafservConfig = {
      schema, // Mock schema for testing
      preset: {
        grafserv: {
          graphqlOverGET: true,
          graphqlPath: "/graphql",
          dangerouslyAllowAllCORSRequests: true,
        },
      },
    };
    const honoGrafserv = grafserv(config);
    honoGrafserv.addTo(app);

    server = serve({
      fetch: app.fetch,
      port: PORT,
    });
  });

  afterEach(() => {
    server?.close();
    server = null;
  });

  const url = `http://0.0.0.0:${PORT}/graphql`;

  it("SHOULD work for a simple request", async () => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: "{ __typename }" }),
    });

    const responseBody = await res.json();
    expect(responseBody.data).toEqual({
      __typename: "Query",
    });
  });

  // run standard audits
  const audits = serverAudits({
    url,
    fetchFn: fetch,
  });
  for (const audit of audits) {
    it(audit.name, async () => {
      const result = await audit.fn();
      if (audit.name.startsWith("MUST") || result.status === "ok") {
        expect({
          ...result,
          response: "<omitted for brevity>",
        }).toEqual(
          expect.objectContaining({
            status: "ok",
          }),
        );
      } else {
        console.warn(`Allowing failed test: ${audit.name}`);
      }
    });
  }
});

describe("Hono Adapter with websockets", () => {
  let server: ServerType | null = null;
  let app!: Hono;
  beforeEach(() => {
    // setup test server
    app = new Hono();
    const config: GrafservConfig = {
      schema, // Mock schema for testing
      preset: {
        grafserv: {
          graphqlOverGET: true,
          websockets: true,
        },
      },
    };
    const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

    const honoGrafserv = grafserv(config, upgradeWebSocket);
    honoGrafserv.addTo(app);

    server = serve({
      fetch: app.fetch,
      port: PORT,
    });
    injectWebSocket(server);
  });

  afterEach(() => {
    server?.close();
    server = null;
  });

  const url = `ws://0.0.0.0:${PORT}/graphql`;

  it("SHOULD work for a simple subscription", async () => {
    // make a graphql subscription
    const client = createClient({
      url,
      webSocketImpl: WebSocket,
    });

    const query = client.iterate({
      query: "subscription { subscriptionTest }",
    });

    const { value } = await query.next();
    expect(value).toEqual({ data: { subscriptionTest: "test1" } });
    const { value: value2 } = await query.next();
    expect(value2).toEqual({ data: { subscriptionTest: "test2" } });
  });

  it("SHOULD throw an error is websocket is enabled but no upgradeWebSocket was provided", async () => {
    const config: GrafservConfig = {
      schema, // Mock schema for testing
      preset: {
        grafserv: {
          websockets: true,
        },
      },
    };
    const honoGrafserv = grafserv(config);
    expect(async () => {
      await honoGrafserv.addTo(app);
    }).rejects.toThrow();
  });
});
