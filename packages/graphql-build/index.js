// @flow

// This script detects if you're running on Node v8 or above; if so it runs the
// code directly, otherwise it falls back to the babel-compiled version

/*::
// Trick flow into exporting the types
export type * from './node8plus';
*/

const isNode8Plus = process.versions.node.match(/^([89]|[1-9][0-9]+)\./);
// $FlowFixMe: ignore
module.exports = isNode8Plus ? require("./node8plus") : require("./node7minus");
