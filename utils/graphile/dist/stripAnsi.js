"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANSI_REGEXP = void 0;
exports.stripAnsi = stripAnsi;
// Extracted from https://github.com/chalk/ansi-regex MIT license
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// Copyright (c) Benjie (https://twitter.com/benjie)
exports.ANSI_REGEXP = 
// eslint-disable-next-line no-control-regex, no-useless-escape
/[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g;
function stripAnsi(str) {
    return str.replace(exports.ANSI_REGEXP, "");
}
//# sourceMappingURL=stripAnsi.js.map