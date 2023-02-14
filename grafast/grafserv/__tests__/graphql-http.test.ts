import { fetch } from "@whatwg-node/fetch";
import { serverAudits } from "graphql-http";

import { makeExampleServer } from "./exampleServer.js";

let server: Awaited<ReturnType<typeof makeExampleServer>> | null = null;

beforeAll(async () => {
  server = await makeExampleServer();
});

afterAll(() => {
  server?.release();
});

const audits = serverAudits({
  url: () => server!.url,
  fetchFn: fetch,
});
for (const audit of audits) {
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
