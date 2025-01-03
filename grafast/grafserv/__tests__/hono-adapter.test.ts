import { serve } from "@hono/node-server";
import { error } from "console";
import { constant, makeGrafastSchema } from "grafast";
import { serverAudits } from "graphql-http";
import { Hono } from "hono";
import { AddressInfo } from "net";

import type { GrafservConfig } from "../src/interfaces.js";
import { grafserv } from "../src/servers/hono/index.js";

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
