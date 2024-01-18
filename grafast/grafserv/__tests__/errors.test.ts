import { fetch } from "@whatwg-node/fetch";

import { makeExampleServer } from "./exampleServer.js";

let server: Awaited<ReturnType<typeof makeExampleServer>> | null = null;

afterAll(() => {
  server?.release();
});

test("response body contains expected error object when function provided as grafast context option throws an error", async () => {
  const maskError = jest.fn((error) => error);
  server = await makeExampleServer({
    grafserv: {
      graphqlOverGET: true,
      graphqlPath: "/graphql",
      dangerouslyAllowAllCORSRequests: true,
      maskError,
    },
    grafast: {
      context: () => {
        throw new Error("a particular error");
      },
    },
  });
  const res = await fetch(server!.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/graphql-response+json",
    },
    body: JSON.stringify({ query: "{ __typename }" }),
  });
  const responseBody = await res.json();
  expect(responseBody).toHaveProperty(
    "errors[0].message",
    "a particular error",
  );
  expect(maskError).toHaveBeenCalledTimes(1);
});
