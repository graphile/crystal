import type { GraphQLOutputType } from "graphql";

let debug = false;
export function setDebug(newDebug: boolean): void {
  debug = newDebug;
}
export function getDebug(): boolean {
  return debug;
}
