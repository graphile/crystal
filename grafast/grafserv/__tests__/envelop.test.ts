import { envelop, useLogger, useMaskedErrors } from "@envelop/core";
import { fetch } from "@whatwg-node/fetch";

import { GrafservEnvelopPreset } from "../src/envelop/index.js";
import { makeExampleServer } from "./exampleServer.js";

let server: Awaited<ReturnType<typeof makeExampleServer>> | null = null;

afterEach(() => {
  server?.release();
});

const sharedConfig: GraphileConfig.Preset = {
  grafserv: {
    graphqlOverGET: true,
    graphqlPath: "/graphql",
    dangerouslyAllowAllCORSRequests: true,
  },
  grafast: {
    context: () => {
      return {
        fromGrafastContext: true,
      };
    },
  },
};

test("envelop plugin is used", async () => {
  const logFn = jest.fn((_eventName, _args) => {});
  const getEnveloped = envelop({
    plugins: [useLogger({ logFn }), useMaskedErrors()],
  });
  server = await makeExampleServer({
    extends: [sharedConfig, GrafservEnvelopPreset],
    grafserv: {
      getEnveloped,
    },
  });
  const res = await fetch(server.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/graphql-response+json",
    },
    body: JSON.stringify({ query: "{ __typename }" }),
  });
  const responseBody = await res.json();
  expect(responseBody.data).toEqual({
    __typename: "Query",
  });
  expect(logFn).toHaveBeenCalledTimes(2);
  expect(logFn.mock.calls[0][0]).toEqual("execute-start");
  expect(logFn.mock.calls[1][0]).toEqual("execute-end");
});

test("envelop masked errors works", async () => {
  const getEnveloped = envelop({
    plugins: [useMaskedErrors()],
  });
  server = await makeExampleServer({
    extends: [sharedConfig, GrafservEnvelopPreset],
    grafserv: {
      getEnveloped,
    },
  });
  const res = await fetch(server.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/graphql-response+json",
    },
    body: JSON.stringify({ query: "{ throwAnError }" }),
  });
  const responseBody = await res.json();
  expect(responseBody.errors).toBeTruthy();
  expect(responseBody.errors[0].message).toEqual("Unexpected error.");
});
