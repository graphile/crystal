import * as core from "./core.ts";

const LowerCaseBuiltinsPlugin: GraphileConfig.Plugin = {
  name: "LowerCaseBuiltinsPlugin",
  description:
    "Forces all builtin names to lowercase to ensure that we're always referencing the builtin inflector when we need to",
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
