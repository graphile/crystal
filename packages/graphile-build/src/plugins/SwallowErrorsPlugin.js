// @flow
import type { Plugin, Build } from "../SchemaBuilder";

export default (function SwallowErrorsPlugin(
  builder,
  { dontSwallowErrors = false }
) {
  builder.hook(
    "build",
    (build: Build): Build => {
      if (dontSwallowErrors) {
        // This plugin is a bit of a misnomer - to better maintain backwards
        // compatibility, `swallowError` still exists on `makeNewBuild`; and
        // thus this plugin is really `dontSwallowErrors`.
        // $FlowFixMe
        return Object.assign(build, {
          swallowError(e) {
            // $FlowFixMe
            e.recoverable = true;
            throw e;
          },
        });
      } else {
        return build;
      }
    },
    ["SwallowErrors"]
  );
}: Plugin);
