import { IncomingMessage, ServerResponse } from "http";
import { GrafservBase } from "../../core/base";
import { GrafservConfig } from "../../interfaces";

export class NodeGrafserv extends GrafservBase {
  createHandler(): (req: IncomingMessage, res: ServerResponse) => void {
    return (req, res) => {
      res.writeHead(503);
      res.end("TODO");
    };
  }
}

export default function grafserv(config: GrafservConfig) {
  return new NodeGrafserv(config);
}
