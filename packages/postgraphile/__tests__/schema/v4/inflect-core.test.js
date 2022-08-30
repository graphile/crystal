const core = require("./core");
const { makeAddInflectorsPlugin } = require("graphile-utils");

test(
  "prints a schema with the core types inflected",
  core.test(__filename, ["a", "b", "c"], {
    appendPlugins: [
      makeAddInflectorsPlugin(
        ({ builtin, inputType }) => ({
          builtin(name) {
            if (name === "Query") return "Q";
            if (name === "Mutation") return "M";
            if (name === "Subscription") return "S";
            if (name === "Node") return "N";
            if (name === "PageInfo") return "PI";

            if (name === "Interval") return "I";
            if (name === "Point") return "P";
            return builtin.call(this, name);
          },
          inputType(name) {
            if (name === "I") return "II";
            if (name === "P") return "PP";
            return inputType.call(this, name);
          },
        }),
        true
      ),
    ],
  })
);
