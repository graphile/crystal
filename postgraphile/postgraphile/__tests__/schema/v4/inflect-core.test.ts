import * as core from "./core.js";

const OverrideInflectionPlugin: GraphileConfig.Plugin = {
  name: "OverrideInflectionPlugin",
  version: "0.0.0",
  inflection: {
    replace: {
      builtin(previous, preset, name) {
        if (name === "Query") return "Q";
        if (name === "Mutation") return "M";
        if (name === "Subscription") return "S";
        if (name === "Node") return "N";
        if (name === "PageInfo") return "PI";

        if (name === "Interval") return "I";
        if (name === "Point") return "P";
        return previous!(name);
      },
      inputType(previous, preset, name) {
        if (name === "I") return "II";
        if (name === "P") return "PP";
        return previous!(name);
      },
    },
  },
};

test(
  "prints a schema with the core types inflected",
  core.test(__filename, ["a", "b", "c"], {
    appendPlugins: [OverrideInflectionPlugin],
  }),
);
