/*
 * This file exists so that `yarn changeset` auto-commits, but
 * `yarn changeset version` does not - we want you to run
 * `yarn changeset:version` instead (which will commit).
 */
const commit = require("@changesets/cli/commit");

Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddMessage = commit.default.getAddMessage;
exports.default = {
  getAddMessage: exports.getAddMessage,
};
