import { expect } from "chai";
import { it } from "mocha";
import { resolvePresets } from "../dist/index.js";

const SomePlugin: GraphileConfig.Plugin = {
  name: "SomePlugin",
  version: "0.0.0",
};
const SomePreset: GraphileConfig.Preset = {
  plugins: [SomePlugin],
};

const PresetWithName: GraphileConfig.Preset = {
  plugins: [SomePlugin],
  // @ts-ignore
  name: "PresetWithName",
};
const PresetWithProvides: GraphileConfig.Preset = {
  plugins: [SomePlugin],
  // @ts-ignore
  provides: ["something"],
};
const PresetWithBefore: GraphileConfig.Preset = {
  plugins: [SomePlugin],
  // @ts-ignore
  before: ["something"],
};
const PresetWithAfter: GraphileConfig.Preset = {
  plugins: [SomePlugin],
  // @ts-ignore
  after: ["something"],
};

it("is fine with reasonable looking preset", () => {
  let error: Error | undefined;
  try {
    resolvePresets([
      {
        extends: [SomePreset],
      },
    ]);
  } catch (e) {
    error = e;
  }
  expect(error).not.to.exist;
});

it("throws an error if a preset looks like a plugin (has name)", () => {
  let error: Error | undefined;
  try {
    resolvePresets([
      {
        extends: [PresetWithName],
      },
    ]);
  } catch (e) {
    error = e;
  }
  expect(error).to.exist;
  expect(error!.message).to.match(/'name'/);
});

it("throws an error if a preset looks like a plugin (has provides)", () => {
  let error: Error | undefined;
  try {
    resolvePresets([
      {
        extends: [PresetWithProvides],
      },
    ]);
  } catch (e) {
    error = e;
  }
  expect(error).to.exist;
  expect(error!.message).to.match(/'provides'/);
});

it("throws an error if a preset looks like a plugin (has before)", () => {
  let error: Error | undefined;
  try {
    resolvePresets([
      {
        extends: [PresetWithBefore],
      },
    ]);
  } catch (e) {
    error = e;
  }
  expect(error).to.exist;
  expect(error!.message).to.match(/'before'/);
});

it("throws an error if a preset looks like a plugin (has after)", () => {
  let error: Error | undefined;
  try {
    resolvePresets([
      {
        extends: [PresetWithAfter],
      },
    ]);
  } catch (e) {
    error = e;
  }
  expect(error).to.exist;
  expect(error!.message).to.match(/'after'/);
});
