import { fetch } from "@whatwg-node/fetch";

import { makeExampleServer } from "./exampleServer.ts";

let server: Awaited<ReturnType<typeof makeExampleServer>> | null = null;

afterEach(() => {
  server?.release();
});

test("grafserv middleware can mutate GraphQL request body", async () => {
  const MiddlewarePlugin: GraphileConfig.Plugin = {
    name: "TestGrafservMiddleware",
    grafserv: {
      middleware: {
        processGraphQLRequestBody(next, event) {
          event.body.query = "{ __typename }";
          return next();
        },
      },
    },
  };

  server = await makeExampleServer({
    plugins: [MiddlewarePlugin],
    grafserv: {
      graphqlOverGET: true,
      graphqlPath: "/graphql",
      dangerouslyAllowAllCORSRequests: true,
    },
  });

  const res = await fetch(server!.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/graphql-response+json",
    },
    body: JSON.stringify({ query: "{ hello }" }),
  });
  const responseBody = await res.json();
  expect(responseBody).toHaveProperty("data.__typename", "Query");
  expect(responseBody).not.toHaveProperty("data.hello");
});
