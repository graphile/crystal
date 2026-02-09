import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";

import { chromium } from "playwright";

const examples = [
  "example-node.mjs",
  "example-express.mjs",
  "example-koa.mjs",
  "example-fastify.mjs",
  "example-hono.mjs",
];

const baseDir = new URL("../examples/", import.meta.url);

function spawnExample(example, port) {
  const child = spawn(
    process.execPath,
    [new URL(example, baseDir).pathname],
    {
      env: {
        ...process.env,
        GRAFSERV_PORT: String(port),
      },
      stdio: ["ignore", "inherit", "inherit"],
    },
  );
  return child;
}

async function getAvailablePort() {
  return await new Promise((resolve, reject) => {
    const server = createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => {
        if (address && typeof address === "object") {
          resolve(address.port);
        } else {
          reject(new Error("Failed to acquire a port"));
        }
      });
    });
  });
}

async function waitForServer(url, timeoutMs = 20_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return;
      }
    } catch {
      // ignore and retry
    }
    await delay(200);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function stopProcess(child) {
  if (child.exitCode != null) return;
  child.kill("SIGTERM");
  for (let i = 0; i < 20; i++) {
    if (child.exitCode != null) return;
    await delay(100);
  }
  child.kill("SIGKILL");
}

async function run() {
  const browser = await chromium.launch();
  try {
    for (const example of examples) {
      const port = await getAvailablePort();
      const url = `http://127.0.0.1:${port}/graphql`;
      const child = spawnExample(example, port);
      try {
        await waitForServer(url);
        const page = await browser.newPage();
        try {
          await page.goto(
            `${url}?query=${encodeURIComponent("{ __typename }")}`,
            { waitUntil: "domcontentloaded" },
          );
          await page.waitForSelector("#ruru-root", { timeout: 10_000 });
          const response = await page.evaluate(async () => {
            const res = await fetch("/graphql", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ query: "{ __typename }" }),
            });
            return res.json();
          });
          if (response?.data?.__typename !== "Query") {
            throw new Error(
              `Unexpected response from ${example}: ${JSON.stringify(
                response,
              )}`,
            );
          }
        } finally {
          await page.close();
        }
      } finally {
        await stopProcess(child);
      }
    }
  } finally {
    await browser.close();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
