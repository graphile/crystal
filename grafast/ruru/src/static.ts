import type { IncomingMessage, ServerResponse } from "node:http";
import { promisify } from "node:util";
import { isPromise } from "node:util/types";
import { inflate as inflateCb } from "node:zlib";

const inflate = promisify(inflateCb);

type PromiseOrDirect<T> = T | Promise<T>;

export interface StaticFile {
  content: Buffer;
  headers: Record<string, string>;
}

export interface StaticFiles {
  [filename: string]: StaticFile;
}

/** A single entry read from 'bundleData.ts' or 'bundleMaps.ts' */
interface BundleEntry {
  etag: string;
  buffer: Buffer;
}

const MIME_TYPES: Record<string, string | undefined> = {
  txt: "text/plain; charset=utf-8",
  ts: "text/plain; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  ttf: "font/ttf",
  map: "application/json",
  css: "text/css; charset=utf-8",
};

function makeStaticFile(filename: string, entry: BundleEntry): StaticFile {
  const { buffer: content, etag } = entry;
  const i = filename.lastIndexOf(".");
  if (i < 0) throw new Error(`${filename} has no extension`);
  const ext = filename.substring(i + 1);
  const contentType = MIME_TYPES[ext];
  if (!contentType) {
    throw new Error(`Unknown extension ${ext}`);
  }
  return {
    content,
    headers: {
      "content-type": contentType,
      "content-encoding": "deflate",
      "content-length": String(content.length),
      etag,
    },
  };
}

function createStaticFileLoader(
  loadFile: () => Promise<{ bundleData: Record<string, BundleEntry> }>,
) {
  let cache: PromiseOrDirect<StaticFiles> | null = null;
  return () => {
    if (cache === null) {
      cache = (async () => {
        const { bundleData } = await loadFile();
        const files: StaticFiles = Object.create(null);
        for (const filename of Object.keys(bundleData)) {
          const content = bundleData[filename];
          files[filename] = makeStaticFile(filename, content);
        }
        cache = files;
        return files;
      })();
      cache.catch((e) => {
        console.error(`Failed to load static files: ${e}`);
        cache = null;
      });
    }
    return cache;
  };
}

/**
 * Returns an object containing all of the static files needed by Ruru; calling
 * this will increase memory consumption by ~4MB
 */
const getStaticFiles = createStaticFileLoader(() => import("./bundleData.js"));

/**
 * Returns an object containing all of the source maps for ruru source; calling
 * this will increase memory consumption by ~10MB
 */
const getStaticMaps = createStaticFileLoader(() => import("./bundleMaps.js"));

export interface GetStaticFileContext {
  /**
   * The URL path to the root of the folder from which static files are being
   * served; must start and end with a slash.
   */
  staticPath: string;

  /**
   * The URL path that the user has requested; if it's within the `staticPath`
   * then we'll look for a matching file.
   */
  urlPath: string;

  /**
   * The content of the `Accept-Encoding` header supplied by the client, if
   * any. Hopefully this includes 'deflate'. If it does not include 'deflate'
   * then we will need to inflate the content before returning it to you, which
   * is more expensive.
   */
  acceptEncoding: ReadonlyArray<string> | string | undefined;

  /**
   * Source maps take up a lot more space in memory and aren't essential; by
   * setting this to `true` we will not attempt to load source maps into memory
   * and will instead return `null`.
   */
  disallowDevAssets?: boolean;
}

/**
 * Given the `staticPath` (which must end in a `/`) from which Ruru's static
 * assets are served over HTTP, and the `urlPath` that the user has requested,
 * return the file and its associated headers to be served in response, or null
 * if not found.
 *
 * IMPORTANT: `staticPath` is the URL path, not the filesystem path. It will be
 * pruned from the beginning of `urlPath` before looking up the file.
 */
export function getStaticFile({
  staticPath,
  urlPath,
  acceptEncoding,
  disallowDevAssets,
}: GetStaticFileContext): PromiseOrDirect<StaticFile | null> {
  const i = urlPath.indexOf("?", staticPath.length);
  const path = urlPath.substring(staticPath.length, i >= 0 ? i : undefined);
  const files =
    path.endsWith(".map") && !disallowDevAssets
      ? getStaticMaps()
      : getStaticFiles();
  return isPromise(files)
    ? files.then((files) => getStaticFileInner(files, path, acceptEncoding))
    : getStaticFileInner(files, path, acceptEncoding);
}

const DEFLATE_REGEXP = /\bdeflate\b/i;
function hasDeflate(
  acceptEncoding: ReadonlyArray<string> | string | undefined,
): boolean {
  return typeof acceptEncoding === "string"
    ? DEFLATE_REGEXP.test(acceptEncoding)
    : false;
}

function getStaticFileInner(
  files: StaticFiles,
  path: string,
  acceptEncoding: ReadonlyArray<string> | string | undefined,
) {
  const file = files[path];
  if (!file) return null;
  if (hasDeflate(acceptEncoding)) {
    // Already deflated
    return file;
  } else {
    // We need to inflate for the client
    const {
      content: deflatedContent,
      headers: { "content-encoding": _delete, ...otherHeaders },
    } = file;
    return inflate(deflatedContent).then((content) => ({
      content,
      headers: {
        ...otherHeaders,
        "content-length": String(content.length),
      },
    }));
  }
}

/**
 * Returns a middleware compatible with Node, Connect, Express and similar that
 * will serve Ruru's static files after trimming off the initial `staticPath`
 * (which represents the URL path under which static assets are served, and
 * _must_ end in a slash).
 */
export function serveStatic(staticPath: string) {
  return (
    req: IncomingMessage,
    res: ServerResponse,
    next?: (e?: Error) => void,
  ) => void staticMiddleware(req, res, next);
  async function staticMiddleware(
    req: IncomingMessage,
    res: ServerResponse,
    next?: (e?: Error) => void,
  ) {
    try {
      if (req.url?.startsWith(staticPath)) {
        const file = await getStaticFile({
          staticPath,
          urlPath: req.url,
          acceptEncoding: req.headers["accept-encoding"],
        });
        if (file) {
          const etag = file.headers.etag;
          const reqEtag = req.headers["if-none-match"];
          if (reqEtag === etag) {
            res.writeHead(304, "Not Modified", { etag });
            res.end();
          } else {
            // As per RFC9112 Section 4.2, a client SHOULD ignore the
            // reason-phrase; it's even phased out in HTTP/2+
            res.writeHead(200, "LGTM", file.headers);
            res.end(file.content);
          }
          return;
        }
      }
      // Not found
      if (typeof next === "function") {
        return next();
      } else {
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("Not found");
      }
    } catch (e) {
      if (typeof next === "function") {
        return next(e);
      } else {
        res.writeHead(500);
        res.end("Failed to setup static middleware");
        return;
      }
    }
  }
}
