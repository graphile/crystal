import "../global";

export default (function SwallowErrorsPlugin(
  builder,
  { dontSwallowErrors = false },
) {
  builder.hook(
    "build",
    (build) => {
      if (dontSwallowErrors) {
        // This plugin is a bit of a misnomer - to better maintain backwards
        // compatibility, `swallowError` still exists on `makeNewBuild`; and
        // thus this plugin is really `dontSwallowErrors`.
        return Object.assign(build, {
          swallowError(e: Error) {
            e["recoverable"] = true;
            throw e;
          },
        });
      } else {
        return build;
      }
    },
    ["SwallowErrors"],
  );
} as GraphileEngine.Plugin);
