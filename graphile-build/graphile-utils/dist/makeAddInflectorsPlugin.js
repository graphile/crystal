"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAddInflectorsPlugin = makeAddInflectorsPlugin;
/** @deprecated Build a plugin directly */
function makeAddInflectorsPlugin() {
    throw new Error(`makeAddInflectorsPlugin is no longer supported; the new plugin system makes it a little easier to write it yourself:

\`\`\`
// Import types for TypeScript
import "graphile-config";
import "graphile-build";
import "graphile-build-pg";

export const MyInflectorPlugin: GraphileConfig.Plugin = {
  // Unique name for your plugin:
  name: 'MyInflectorPlugin',
  version: '0.0.0',

  inflection: {
    replace: {
      builtin(
        // The previous version of this inflector, the one you're replacing
        previous,

        // The resolved configuration
        preset,

        // Everything else is the arguments to this inflector
        ...args
      ) {
        if (name === "Query") return "RootQuery";
        return previous(...args);
      }
    }
  }
}
\`\`\`

`);
}
//# sourceMappingURL=makeAddInflectorsPlugin.js.map