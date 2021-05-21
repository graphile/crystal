/**
 * Module dependencies.
 */

import * as assert from "assert";
import * as http from "http";
import * as https from "https";
import type { AddressInfo } from "net";
import * as request from "superagent";
import * as util from "util";

// @ts-ignore
const Request: any = request.Request;

/**
 * Return an `Error` with `msg` and results properties.
 */

type CustomError = Error & {
  expected: any;
  actual: any;
  showDiff: boolean;
};

function error(msg: string, expected: any, actual: any): CustomError {
  return Object.assign(new Error(msg), {
    expected,
    actual,
    showDiff: true,
  });
}

/**
 * Initialize a new `Test` with the given `app`,
 * request `method` and `path`.
 */

class Test extends Request {
  constructor(app: http.Server, method: string, path: string, host?: string) {
    super(method.toUpperCase(), path);
    this._enableHttp2 = app["_http2"];
    this.redirects(0);
    this.buffer();
    this.app = app;
    this._asserts = [];
    this.url =
      typeof app === "string"
        ? app + path
        : this.serverAddress(app, path, host);

    // Make awaiting work
    const oldThen = this.then;
    const donePromise = new Promise((resolve) => {
      this.completeCallback = resolve;
    });
    let promise: Promise<any> | null = null;
    this.then = (cb: any, ecb: any) => {
      if (!promise) {
        promise = oldThen.call(
          this,
          () => donePromise,
          (e: any) => {
            if (
              this.expectedStatus >= 400 &&
              e.status === this.expectedStatus
            ) {
              return donePromise;
            } else {
              console.error(e);
              return Promise.reject(e);
            }
          },
        );
      }
      return promise!.then(cb, ecb);
    };
  }
  /**
   * Returns a URL, extracted from a server.
   */

  serverAddress(app: http.Server, path: string, host?: string): string {
    let addr = app.address();
    let port;
    let protocol;

    if (!addr) this._server = app.listen(0);
    port = (app.address() as AddressInfo).port;
    protocol = app instanceof https.Server ? "https" : "http";
    return protocol + "://" + (host || "127.0.0.1") + ":" + port + path;
  }

  /**
   * Expectations:
   *
   *   .expect(200)
   *   .expect(200, fn)
   *   .expect(200, body)
   *   .expect('Some body')
   *   .expect('Some body', fn)
   *   .expect('Content-Type', 'application/json')
   *   .expect('Content-Type', 'application/json', fn)
   *   .expect(fn)
   */

  expect(this: Test, a: any, b: any, c: any) {
    // callback
    if (typeof a === "function") {
      this._asserts.push(a);
      return this;
    }
    if (typeof b === "function") this.end(b);
    if (typeof c === "function") this.end(c);

    // status
    if (typeof a === "number") {
      this.expectedStatus = a;
      this._asserts.push(this._assertStatus.bind(this, a));
      // body
      if (typeof b !== "function" && arguments.length > 1) {
        this._asserts.push(this._assertBody.bind(this, b));
      }
      return this;
    }

    // header field
    if (typeof b === "string" || typeof b === "number" || b instanceof RegExp) {
      this._asserts.push(
        this._assertHeader.bind(this, {
          name: String(a),
          value: typeof b === "number" ? String(b) : b,
        }),
      );
      return this;
    }

    // body
    this._asserts.push(this._assertBody.bind(this, a));

    return this;
  }

  /**
   * Defer invoking superagent's `.end()` until
   * the server is listening.
   */

  end(fn: Function) {
    let server = this._server;
    let end = Request.prototype.end;

    end.call(this, (err: any, res: any) => {
      const localAssert = () => {
        this.assert(err, res, fn);
      };

      if (server && server._handle) return server.close(localAssert);

      localAssert();
    });

    return this;
  }

  /**
   * Perform assertions and invoke `fn(err, res)`.
   */

  assert(resError: Error | null, res: request.Response, fn: Function) {
    this.completeCallback(res);
    let error;
    let i;

    // check for unexpected network errors or server not running/reachable errors
    // when there is no response and superagent sends back a System Error
    // do not check further for other asserts, if any, in such case
    // https://nodejs.org/api/errors.html#errors_common_system_errors
    let sysErrors = {
      ECONNREFUSED: "Connection refused",
      ECONNRESET: "Connection reset by peer",
      EPIPE: "Broken pipe",
      ETIMEDOUT: "Operation timed out",
    };

    if (!res && resError) {
      if (
        resError instanceof Error &&
        resError["syscall"] === "connect" &&
        Object.getOwnPropertyNames(sysErrors).indexOf(resError["code"]) >= 0
      ) {
        error = new Error(
          resError["code"] + ": " + sysErrors[resError["code"]],
        );
      } else {
        error = resError;
      }
    }

    // asserts
    for (i = 0; i < this._asserts.length && !error; i += 1) {
      error = this._assertFunction(this._asserts[i], res);
    }

    // set unexpected superagent error if no other error has occurred.
    if (
      !error &&
      resError instanceof Error &&
      (!res || resError["status"] !== res.status)
    ) {
      error = resError;
    }

    fn.call(this, error || null, res);
  }

  /**
   * Perform assertions on a response body and return an Error upon failure.
   */

  _assertBody(body: any, res: request.Response): Error | null {
    let isregexp = body instanceof RegExp;
    let a;
    let b;

    // parsed
    if (typeof body === "object" && !isregexp) {
      try {
        assert.deepStrictEqual(body, res.body);
      } catch (err) {
        a = util.inspect(body);
        b = util.inspect(res.body);
        return error(
          "expected " + a + " response body, got " + b,
          body,
          res.body,
        );
      }
    } else if (body !== res.text) {
      // string
      a = util.inspect(body);
      b = util.inspect(res.text);

      // regexp
      if (isregexp) {
        if (!body.test(res.text)) {
          return error(
            "expected body " + b + " to match " + body,
            body,
            res.body,
          );
        }
      } else {
        return error(
          "expected " + a + " response body, got " + b,
          body,
          res.body,
        );
      }
    }
    return null;
  }

  /**
   * Perform assertions on a response header and return an Error upon failure.
   */

  _assertHeader(
    this: Test,
    header: { name: string; value: string | RegExp },
    res: request.Response,
  ): Error | null {
    let field = header.name;
    let actual = res.header[field.toLowerCase()];
    let fieldExpected = header.value;

    if (typeof actual === "undefined")
      return new Error('expected "' + field + '" header field');
    // This check handles header values that may be a String or single element Array
    if (
      (Array.isArray(actual) && actual.toString() === fieldExpected) ||
      fieldExpected === actual
    ) {
      return null;
    } else if (fieldExpected instanceof RegExp) {
      if (!fieldExpected.test(actual)) {
        return new Error(
          'expected "' +
            field +
            '" matching ' +
            fieldExpected +
            ', got "' +
            actual +
            '"',
        );
      }
    } else {
      return new Error(
        'expected "' +
          field +
          '" of "' +
          fieldExpected +
          '", got "' +
          actual +
          '"',
      );
    }
    return null;
  }

  /**
   * Perform assertions on the response status and return an Error upon failure.
   */

  _assertStatus(status: number, res: request.Response): Error | null {
    let a;
    let b;
    if (res.status !== status) {
      a = http.STATUS_CODES[status];
      b = http.STATUS_CODES[res.status];
      return new Error(
        "expected " +
          status +
          ' "' +
          a +
          '", got ' +
          res.status +
          ' "' +
          b +
          '"',
      );
    }
    return null;
  }

  /**
   * Performs an assertion by calling a function and return an Error upon failure.
   */
  _assertFunction(fn: Function, res: request.Response): Error | null {
    let err: Error | null = null;
    try {
      err = fn(res);
    } catch (e) {
      err = e;
    }
    return err instanceof Error ? err : null;
  }
}
export default Test;
