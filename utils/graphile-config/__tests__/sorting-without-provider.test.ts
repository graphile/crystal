import { expect } from "chai";
import { it } from "mocha";

import { sortedPlugins } from "../dist/index.js";

const PLUGINS: GraphileConfig.Plugin[] = [
  {
    name: "Plugin2",
    version: "0.0.0",
    after: ["Plugin1"],
    provides: ["things"],
  },
  { name: "Plugin4", version: "0.0.0", after: ["stuff"] },
  { name: "Plugin3", version: "0.0.0", before: ["stuff"], after: ["things"] },
  { name: "Plugin1", version: "0.0.0", before: ["Plugin3"] },
];

it("sorts plugins correctly", () => {
  const plugins = sortedPlugins(PLUGINS);
  expect(plugins.map((p) => p.name)).to.deep.equal([
    "Plugin1",
    "Plugin2",
    "Plugin3",
    "Plugin4",
  ]);
});
