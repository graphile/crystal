/** @deprecated Build a plugin directly */
export function makeAddInflectorsPlugin(): never {
  throw new Error(`makeAddInflectorsPlugin is no longer supported; the new plugin system makes it a little easier to write it yourself:

\`\`\`
// Import types for TypeScript
import type {} from "graphile-config";
import type {} from "graphile-build";
import type {} from "graphile-build-pg";

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
        return previous.call(this, ...args);
      }
    }
  }
}
\`\`\`

`);
}
