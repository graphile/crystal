import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { setTimeout as sleep } from "node:timers/promises";

import { type Browser, chromium, type Page } from "playwright";

const EXAMPLES = [
  "example-express.mts",
  "example-fastify.mts",
  "example-hono.mts",
  "example-koa.extra.mts",
  "example-koa.mts",
  "example-node.mts",
] as const;
type Example = (typeof EXAMPLES)[number];

const baseDir = new URL("../examples/", import.meta.url);

function spawnExample(example: Example, port: number) {
  const child = spawn(
    process.execPath,
    ["--experimental-strip-types", new URL(example, baseDir).pathname],
    {
      env: {
        ...process.env,
        NODE_ENV: "production",
        GRAPHILE_ENV: "production",
        PORT: String(port),
      },
      stdio: ["ignore", "inherit", "inherit"],
    },
  );
  let exited = false;
  child.once("exit", () => {
    exited = true;
  });
  async function stopProcess() {
    if (exited) return;
    child.kill("SIGTERM");
    for (let i = 0; i < 20; i++) {
      if (exited) return;
      await sleep(100);
    }
    child.kill("SIGKILL");
    console.error(`Had to SIGKILL ${child.pid}`);
  }
  return { pid: child.pid, stop: stopProcess };
}

function getAvailablePort() {
  return new Promise<number>((resolve, reject) => {
    const server = createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => {
        if (typeof address === "object" && address !== null) {
          resolve(address.port);
        } else {
          reject(new Error("Failed to acquire a port"));
        }
      });
    });
  });
}

async function waitForServer(url: string, timeoutMs = 20_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return;
      } else if (
        res.status === 503 ||
        res.status === 502 ||
        res.status === 504
      ) {
        // Maybe still starting?
      } else {
        console.warn(`Continuing on an HTTP ${res.status}`);
        return;
      }
    } catch {
      // ignore and retry
    }
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function withBrowser<T>(
  cb: (browser: Browser) => Promise<T>,
): Promise<T> {
  const browser = await chromium.launch();
  try {
    return await cb(browser);
  } finally {
    await browser.close();
  }
}

async function withExample<T>(
  example: Example,
  cb: (url: string) => Promise<T>,
): Promise<T> {
  const port = await getAvailablePort();
  const url = `http://127.0.0.1:${port}`;
  const { pid, stop } = spawnExample(example, port);
  console.info(`Spawned (pid=${pid}) at ${url}`);
  try {
    await waitForServer(url);
    return await cb(url);
  } finally {
    await stop();
  }
}

async function withPage<T>(
  browser: Browser,
  cb: (page: Page) => Promise<T>,
): Promise<T> {
  const page = await browser.newPage();
  try {
    return await cb(page);
  } finally {
    await page.close();
  }
}

const QUERY = /* GraphQL */ `
  {
    add(a: 42, b: 25)
  }
`;

async function run(browser: Browser) {
  for (const example of EXAMPLES) {
    console.log();
    console.log();
    console.log(`Starting ${example}...`);
    console.time(example);
    await withExample(example, (url) =>
      withPage(browser, async (page) => {
        await page.goto(`${url}/#query=${encodeURIComponent(QUERY)}`, {
          waitUntil: "domcontentloaded",
        });
        await page.waitForSelector(".graphiql-execute-button", {
          timeout: 2_000,
        });
        const response = await page.evaluate(
          async ({ QUERY }) => {
            const res = await fetch("/graphql", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ query: QUERY }),
            });
            return res.json();
          },
          { QUERY },
        );
        if (response?.data?.add !== 67) {
          throw new Error(
            `Unexpected response from ${example}: ${JSON.stringify(response)}`,
          );
        }
        console.log("All good!");
      }),
    );
    console.timeEnd(example);
  }
}

withBrowser(run).catch((e) => {
  console.error(e);
  process.exit(1);
});
