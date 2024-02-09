/**
 * @internal
 */
export const graphileEnv =
  typeof process !== "undefined" ? process.env.GRAPHILE_ENV : undefined;
/**
 * @internal
 */
export const isDev = graphileEnv === "development";
export function noop(): void {}

if (typeof process !== "undefined" && typeof graphileEnv === "undefined") {
  console.warn(
    `The GRAPHILE_ENV environmental variable is not set; we will run in production mode. In your development environments, it's recommended that you set \`GRAPHILE_ENV=development\` to opt in to additional checks that will provide guidance and help you to catch issues in your code earlier.`,
  );
}
