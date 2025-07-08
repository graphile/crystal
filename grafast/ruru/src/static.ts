import type { IncomingMessage, ServerResponse } from "node:http";
import { isPromise } from "node:util/types";
import { inflateSync } from "node:zlib";

function getBaseHeaders(filename: string): Record<string, string> {
  const i = filename.lastIndexOf(".");
  if (i < 0) throw new Error(`${filename} has no extension`);
  const ext = filename.substring(i + 1);
  switch (ext) {
    case "txt":
      return { "content-type": "text/plain; charset=utf-8" };
    case "js":
      return { "content-type": "text/javascript; charset=utf-8" };
    case "ttf":
      return {
        "Access-Control-Allow-Origin": "*",
        "content-type": "font/ttf",
      };
    case "map":
      return { "content-type": "application/json" };
    default:
      throw new Error(`Unknown extension ${ext}`);
  }
}

type PromiseOrDirect<T> = T | Promise<T>;

export interface StaticFile {
  content: Buffer;
  headers: Record<string, string>;
}

export interface StaticFiles {
  [filename: string]: StaticFile;
}

let _files: PromiseOrDirect<StaticFiles> | null = null;
/**
 * Returns an object containing all of the static files needed by Ruru; calling
 * this will increase memory consumption by ~4MB
 */
function getStaticFiles(): PromiseOrDirect<StaticFiles> {
  if (_files === null) {
    _files = (async () => {
      const { bundleData } = await import("./bundleData.js");
      const files: StaticFiles = Object.create(null);
      for (const filename of Object.keys(bundleData)) {
        const content = bundleData[filename];
        files[filename] = {
          content,
          headers: {
            ...getBaseHeaders(filename),
            "content-encoding": "deflate",
            "content-length": String(content.length),
          },
        };
      }
      _files = files;
      return files;
    })();
    _files.catch((e) => {
      console.error(`Failed to load static files: ${e}`);
      _files = null;
    });
  }
  return _files;
}

let _maps: PromiseOrDirect<StaticFiles> | null = null;
/**
 * Returns an object containing all of the source maps for ruru source; calling
 * this will increase memory consumption by ~10MB
 */
function getStaticMaps(): PromiseOrDirect<StaticFiles> {
  if (_maps === null) {
    _maps = (async () => {
      const { bundleData } = await import("./bundleMaps.js");
      const files: StaticFiles = Object.create(null);
      for (const filename of Object.keys(bundleData)) {
        const content = bundleData[filename];
        files[filename] = {
          content,
          headers: {
            ...getBaseHeaders(filename),
            "content-encoding": "deflate",
            "content-length": String(content.length),
          },
        };
      }
      _maps = files;
      return files;
    })();
    _maps.catch((e) => {
      console.error(`Failed to load static files: ${e}`);
      _maps = null;
    });
  }
  return _maps;
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
export function getStaticFile(options: {
  staticPath: string;
  urlPath: string;
  acceptEncoding?: string;
  // Source maps take up a lot more space in memory and aren't essential.
  disallowSourceMaps?: boolean;
}): PromiseOrDirect<StaticFile | null> {
  const { staticPath, urlPath, acceptEncoding, disallowSourceMaps } = options;
  const i = urlPath.indexOf("?", staticPath.length);
  const path = urlPath.substring(staticPath.length, i >= 0 ? i : undefined);
  const files =
    path.endsWith(".map") && !disallowSourceMaps
      ? getStaticMaps()
      : getStaticFiles();
  return isPromise(files)
    ? files.then((files) => getStaticFileInner(files, path, acceptEncoding))
    : getStaticFileInner(files, path, acceptEncoding);
}

const DEFLATE_REGEXP = /\bdeflate\b/i;
function hasDeflate(acceptEncoding?: string): boolean {
  return typeof acceptEncoding === "string"
    ? DEFLATE_REGEXP.test(acceptEncoding)
    : false;
}

function getStaticFileInner(
  files: StaticFiles,
  path: string,
  acceptEncoding: string | undefined,
) {
  const file = files[path];
  if (!file) return null;
  if (hasDeflate(acceptEncoding)) {
    // Already deflated
    return file;
  } else {
    const {
      content: deflatedContent,
      headers: { "content-encoding": _delete, ...otherHeaders },
    } = file;
    const content = inflateSync(deflatedContent);
    return {
      content,
      headers: {
        ...otherHeaders,
        "content-length": String(content.length),
      },
    };
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
          // As per RFC9112 Section 4.2, a client SHOULD ignore the
          // reason-phrase; it's even phased out in HTTP/2+
          res.writeHead(200, "LGTM", file.headers);
          res.end(file.content);
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
