import swallowError from "../swallowError";

/**
 * This plugin changes the default handling for "recoverable" errors from
 * throwing the error to instead logging it and carrying on.  We do not
 * recommend the use of this plugin in production, however it is useful when
 * evaluating the tool in development as it allows you to continue using other
 * parts of your schema even if conflicts occur that result in sections of
 * your GraphQL schema being omitted.
 *
 * We've registered the `dontSwallowErrors` option in case you want to opt out
 * of this without changing your plugin list.
 */
export const SwallowErrorsPlugin: GraphileEngine.Plugin =
  function SwallowErrorsPlugin(builder, { dontSwallowErrors = false }) {
    if (dontSwallowErrors !== true) {
      builder.hook(
        "build",
        (build) => {
          // Explicitly overwrite the error handler
          build.handleRecoverableError = swallowError;
          return build;
        },
        ["SwallowErrors"],
      );
    }
  };
