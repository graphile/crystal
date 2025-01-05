import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { error } from "console";
import { constant, makeGrafastSchema } from "grafast";
import { serverAudits } from "graphql-http";
import { createClient } from "graphql-ws";
import { Hono } from "hono";
import { WebSocket } from "ws";

import type { GrafservConfig } from "../src/interfaces.js";
import { grafserv } from "../src/servers/hono/v4/index.js";

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
  plans: {
    Query: {
      hello() {
        return constant("world");
      },
      throwAnError() {
        return error(new Error("You asked for an error... Here it is."));
      },
    },
    Subscription: {
      subscriptionTest: {
        // eslint-disable-next-line graphile-export/export-methods
        subscribe: async function* () {
          yield { subscriptionTest: "test1" };
          yield { subscriptionTest: "test2" };
        },
      },
    },
  },
});

describe("Hono Adapter", () => {
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

  const server = serve({
    fetch: app.fetch,
    port: 7777,
  });
  const url = `http://0.0.0.0:7777/graphql`;

  it("SHOULD work for a simple request", async () => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
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
  // setup test server
  const app = new Hono();
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

  const server = serve({
    fetch: app.fetch,
    port: 7778,
  });
  injectWebSocket(server);

  const url = `ws://0.0.0.0:7778/graphql`;

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
          graphqlOverGET: true,
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
