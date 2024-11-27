import { expect } from "chai";
import { it } from "mocha";

import { resolvePreset } from "../dist/index.js";

const SomePreset: GraphileConfig.Preset = {};

const SomePlugin: GraphileConfig.Plugin = {
  name: "SomePlugin",
  version: "0.0.0",
};
const PluginWithPlugins: GraphileConfig.Plugin = {
  name: "PluginWithPlugins",
  // @ts-ignore
  plugins: [SomePlugin],
};
const PluginWithDisablePlugins: GraphileConfig.Plugin = {
  name: "PluginWithDisablePlugins",
  // @ts-ignore
  disablePlugins: ["SomePlugin"],
};
const PluginWithExtends: GraphileConfig.Plugin = {
  name: "PluginWithExtends",
  // @ts-ignore
  extends: [SomePreset],
};

it("is fine with reasonable looking plugin", () => {
  let error: Error | undefined;
  try {
    resolvePreset({
      plugins: [SomePlugin],
    });
  } catch (e) {
    error = e;
  }
  expect(error).not.to.exist;
});

it("throws an error if a plugin looks like a preset (has plugins)", () => {
  let error: Error | undefined;
  try {
    resolvePreset({
      plugins: [PluginWithPlugins],
    });
  } catch (e) {
    error = e;
  }
  expect(error).to.exist;
  expect(error!.message).to.match(/'plugins'/);
});

it("throws an error if a plugin looks like a preset (has disablePlugins)", () => {
  let error: Error | undefined;
  try {
    resolvePreset({
      plugins: [PluginWithDisablePlugins],
    });
  } catch (e) {
    error = e;
  }
  expect(error).to.exist;
  expect(error!.message).to.match(/'disablePlugins'/);
});

it("throws an error if a plugin looks like a preset (has extends)", () => {
  let error: Error | undefined;
  try {
    resolvePreset({
      plugins: [PluginWithExtends],
    });
  } catch (e) {
    error = e;
  }
  expect(error).to.exist;
  expect(error!.message).to.match(/'extends'/);
});
