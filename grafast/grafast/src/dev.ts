/**
 * @internal
 */
export const isDev =
  typeof process !== "undefined" && process.env.GRAPHILE_ENV === "development";
export function noop(): void {}
