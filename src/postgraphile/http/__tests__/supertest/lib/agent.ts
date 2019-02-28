// tslint:disable
/**
 * Module dependencies.
 */

import { agent as Agent } from 'superagent';
import * as http from 'http';
import Test from './test';

const methods = http.METHODS.map(m => m.toLowerCase());

/**
 * Initialize a new `TestAgent`.
 *
 * @param {Function|Server} app
 * @param {Object} options
 * @api public
 */

function TestAgent(app: any, options: any) {
  // @ts-ignore
  if (!(this instanceof TestAgent)) return new TestAgent(app, options);
  if (typeof app === 'function') app = http.createServer(app); // eslint-disable-line no-param-reassign
  if (options) {
    this._ca = options.ca;
    this._key = options.key;
    this._cert = options.cert;
  }
  Agent.call(this);
  this.app = app;
}

/**
 * Inherits from `Agent.prototype`.
 */

Object.setPrototypeOf(TestAgent.prototype, Agent.prototype);

// set a host name
TestAgent.prototype.host = function(host: any) {
  this._host = host;
  return this;
};

// override HTTP verb methods
methods.forEach(method => {
  TestAgent.prototype[method] = function(url: any, _fn: any) {
    // eslint-disable-line no-unused-vars
    var req = new Test(this.app, method.toUpperCase(), url, this._host);
    req.ca(this._ca);
    req.cert(this._cert);
    req.key(this._key);

    req.on('response', this._saveCookies.bind(this));
    req.on('redirect', this._saveCookies.bind(this));
    req.on('redirect', this._attachCookies.bind(this, req));
    this._attachCookies(req);

    return req;
  };
});

TestAgent.prototype.del = TestAgent.prototype.delete;

export default TestAgent;
