import { IncomingMessage, ServerResponse } from "http";
import { GrafservBase } from "../../core/base";
import {
  GrafservConfig,
  SendResult,
  SendError,
  RequestDigest,
} from "../../interfaces";
import { OptionsFromConfig } from "../../options";

export function getBodyFromRequest(
  req: IncomingMessage,
  maxLength: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    req.setEncoding("utf8");
    let data = "";
    const handleData = (chunk: Buffer) => {
      data += chunk;
      if (data.length > maxLength) {
        req.off("end", done);
        req.off("error", reject);
        req.off("data", handleData);
        // FIXME: validate this approach
        reject(new Error("Too much data"));
      }
    };
    const done = () => {
      resolve(data);
    };
    req.on("end", done);
    req.on("error", reject);
    req.on("data", handleData);
  });
}

function processHeaders(
  headers: IncomingMessage["headers"],
): Record<string, string> {
  const headerDigest: Record<string, string> = Object.create(null);
  for (const key in headers) {
    const val = headers[key];
    if (val == null) {
      continue;
    }
    if (typeof val === "string") {
      headerDigest[key] = val;
    } else {
      headerDigest[key] = val.join("\n");
    }
  }
  return headerDigest;
}

function getDigest(
  dynamicOptions: OptionsFromConfig,
  req: IncomingMessage,
): RequestDigest {
  return {
    method: req.method!,
    path: req.url!,
    headers: processHeaders(req.headers),
    getBody() {
      return getBodyFromRequest(req, dynamicOptions.maxRequestLength);
    },
  };
}

export class NodeGrafserv extends GrafservBase {
  constructor(config: GrafservConfig) {
    super(config);
  }

  public createHandler(): (
    req: IncomingMessage,
    res: ServerResponse,
    next?: (err?: Error) => void,
  ) => void {
    return (req, res, next) => {
      try {
        const request = getDigest(this.dynamicOptions, req);
        const sendResult = this.makeSendResult(req, res, next);
        const sendError = this.makeSendError(req, res, next);
        this.processRequest({
          request,
          sendResult,
          sendError,
        });
      } catch (e) {
        console.error("Unexpected error occurred:");
        console.error(e);
        if (typeof next === "function") {
          next(e);
        } else {
          const text = "Unknown error occurred";
          res.writeHead(500, {
            "Content-Type": "text/plain",
            "Content-Length": text.length,
          });
          res.end(text);
        }
      }
    };
  }

  private makeSendResult(
    _req: IncomingMessage,
    res: ServerResponse,
    _next?: (err?: Error) => void,
  ): SendResult {
    return (result) => {
      res.writeHead(503);
      res.end("TODO");
    };
  }

  private makeSendError(
    _req: IncomingMessage,
    res: ServerResponse,
    next?: (err?: Error) => void,
  ): SendError {
    if (typeof next === "function") {
      return next;
    }
    return (error) => {
      res.writeHead(500);
      res.end("TODO");
    };
  }
}

export default function grafserv(config: GrafservConfig) {
  return new NodeGrafserv(config);
}
