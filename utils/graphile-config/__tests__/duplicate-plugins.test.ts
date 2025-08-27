import { expect } from "chai";
import { it } from "mocha";

import { resolvePreset } from "../dist/index.js";

const SAME_NAME = "PluginWithSameName";

const SomePluginA: GraphileConfig.Plugin = {
  name: SAME_NAME,
  version: "0.0.0",
};
const SomePluginB: GraphileConfig.Plugin = {
  name: SAME_NAME,
  version: "0.0.1",
};

it("allows the same plugin to be referenced multiple times", () => {
  const p = resolvePreset({
    extends: [
      { plugins: [SomePluginA] },
      { extends: [{ plugins: [SomePluginA] }] },
    ],
    plugins: [SomePluginA],
  });
  expect(p.plugins).to.have.length(1);
  expect(p.plugins[0]).to.equal(SomePluginA);
});

it("throws an error if two different plugins with the same name are loaded", () => {
  let error: Error | undefined;
  try {
    resolvePreset({
      extends: [
        { plugins: [SomePluginA] },
        { extends: [{ plugins: [SomePluginB] }] },
      ],
      plugins: [SomePluginA],
    });
  } catch (e) {
    error = e;
  }
  expect(error).to.exist;
  expect(error!.message).to.match(
    /different plugins.*same name.*PluginWithSameName/,
  );
});
