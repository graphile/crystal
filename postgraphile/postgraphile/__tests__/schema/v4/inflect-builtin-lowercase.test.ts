import * as core from "./core.js";

const LowerCaseBuiltinsPlugin: GraphileConfig.Plugin = {
  name: "LowerCaseBuiltinsPlugin",
  version: "0.0.0",
  inflection: {
    replace: {
      builtin(previous, preset, name) {
        return name.toLowerCase();
      },
    },
  },
};

test(
  "prints a schema with lowercase built-in type names",
  core.test(__filename, ["a", "b", "c"], {
    appendPlugins: [LowerCaseBuiltinsPlugin],
  }),
);
