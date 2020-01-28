// @ts-ignore
import * as MockReq from "mock-req";
// @ts-ignore
import * as MockRes from "mock-res";
import { HttpRequestHandler } from "postgraphile";
import * as pg from "pg";
import { ServerResponse, ClientRequest } from "http";

function sanitise<TInput>(json: TInput): TInput {
  if (Array.isArray(json)) {
    return json.map(
      <TEntry>(el: TEntry): TEntry => sanitise<TEntry>(el)
    ) as any;
  } else if (json && typeof json === "object") {
    const result: any = {};
    for (const k in json) {
      if (k === "nodeId") {
        result[k] = "[nodeId]";
      } else if (
        k === "id" ||
        (k.endsWith("Id") && typeof json[k] === "number")
      ) {
        result[k] = "[id]";
      } else if (
        (k.endsWith("At") || k === "datetime") &&
        typeof json[k] === "string"
      ) {
        result[k] = "[timestamp]";
      } else if (
        k.match(/^deleted[A-Za-z0-9]+Id$/) &&
        typeof json[k] === "string"
      ) {
        result[k] = "[nodeId]";
      } else {
        result[k] = sanitise(json[k]);
      }
    }
    return result as TInput;
  } else {
    return json;
  }
}
export interface TestCtx {
  middleware: HttpRequestHandler;
  pgPool: pg.Pool;
  release: () => Promise<void>;
}

export const runQuery = function runGraphQLQuery(
  ctx: TestCtx,
  query: string,
  variables: any,
  reqOptions: any,
  checker = (json: any, _req: ClientRequest, res: ServerResponse) => {
    expect(sanitise(json)).toMatchSnapshot();
    expect(res.statusCode).toBe(200);
  }
) {
  return new Promise((resolve, reject) => {
    const body = {
      query,
      variables,
    };
    const req = new MockReq({
      url: "/graphql",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      _body: body,
      body,
      ...reqOptions,
    });
    req.end();
    const res = new MockRes();
    res.setHeader = () => {};
    res.on("error", (e: Error) => {
      reject(e);
    });
    res.on("finish", () => {
      resolve(
        new Promise((innerResolve, innerReject) => {
          try {
            const json = res._getJSON();
            const checkResult = Promise.resolve().then(() =>
              checker(json, req, res)
            );
            checkResult.then(() => innerResolve(), innerReject);
          } catch (e) {
            innerReject(e);
          }
        })
      );
    });
    ctx.middleware(req, res, err => {
      reject(err);
    });
  });
};
