import { envelop, useLogger } from "@envelop/core";
import { fetch } from "@whatwg-node/fetch";

import { GrafservEnvelopPlugin } from "../src/plugins/envelop/index.js";
import { makeExampleServer } from "./exampleServer.js";

let server: Awaited<ReturnType<typeof makeExampleServer>> | null = null;

beforeAll(async () => {});

afterAll(() => {
  server?.release();
});

const sharedConfig: GraphileConfig.Preset = {
  grafserv: {
    graphqlOverGET: true,
    graphqlPath: "/graphql",
    dangerouslyAllowAllCORSRequests: true,
    maskError: (e) => e,
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
    plugins: [useLogger({ logFn })],
  });
  server = await makeExampleServer({
    extends: [sharedConfig],
    plugins: [GrafservEnvelopPlugin],
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
