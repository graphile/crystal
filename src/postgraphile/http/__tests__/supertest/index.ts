// tslint:disable no-any
import * as http from 'http';
import Test from './lib/test';
import agent from './lib/agent';

const methods = http.METHODS.map(m => m.toLowerCase());

/**
 * Test against the given `app`,
 * returning a new `Test`.
 *
 * @param {Function|Server} app
 * @return {Test}
 * @api public
 */
export default (app: any) => {
  const obj: any = {};

  if (typeof app === 'function') {
    app = http.createServer(app); // eslint-disable-line no-param-reassign
  }

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
