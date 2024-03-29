// Extracted from https://github.com/chalk/ansi-regex MIT license
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// Copyright (c) Benjie (https://twitter.com/benjie)
export const ANSI_REGEXP =
  // eslint-disable-next-line no-control-regex, no-useless-escape
  /[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g;
export function stripAnsi(str: string): string {
  return str.replace(ANSI_REGEXP, "");
}
