/**
 * @internal
 */
const graphileEnv =
  typeof process !== "undefined" ? process.env.GRAPHILE_ENV : undefined;
const nodeEnv =
  typeof process !== "undefined" ? process.env.NODE_ENV : undefined;
const mode = graphileEnv !== undefined ? graphileEnv : nodeEnv;
/**
 * @internal
 */
export const isDev = mode === "development" || mode === "test";
export const isTest = mode === "test";
export function noop(): void {}

if (
  typeof process !== "undefined" &&
  typeof graphileEnv === "undefined" &&
  typeof nodeEnv === "undefined"
) {
  console.warn(
    `The GRAPHILE_ENV environmental variable is not set; Grafast will run in production mode. In your development environments, it's recommended that you set \`GRAPHILE_ENV=development\` to opt in to additional checks that will provide guidance and help you to catch issues in your code earlier, and other changes such as formatting to improve your development experience.`,
  );
} else if (isDev && !isTest) {
  console.warn(
    `Grafast is running in development mode due to \`${
      graphileEnv !== undefined
        ? `GRAPHILE_ENV=${graphileEnv}`
        : `NODE_ENV=${nodeEnv}`
    }\`; this is recommended for development environments (and strongly discouraged in production), but will impact on performance - in particular, planning will be significantly more expensive.`,
  );
}
