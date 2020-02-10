// tslint:disable no-any
import * as http from "http";
import Test from "./lib/test";
import agent from "./lib/agent";

const methods = http.METHODS.map(m => m.toLowerCase());

/**
 * Test against the given `app`,
 * returning a new `Test`.
 */
export default (appOrCallback: http.Server | http.RequestListener): Test => {
  const obj: any = {};

  const app =
    typeof appOrCallback === "function"
      ? http.createServer(appOrCallback)
      : appOrCallback;

  methods.forEach(method => {
    obj[method] = (url: string) => {
      return new Test(app, method, url);
    };
  });

  // Support previous use of del
  obj.del = obj.delete;

  return obj;
};

export { Test, agent };
