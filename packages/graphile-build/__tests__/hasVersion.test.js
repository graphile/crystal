const { buildSchema, defaultPlugins } = require("../");

function EarlyPlugin(builder) {
  builder.hook("build", build => {
    build.versions["early-plugin"] = "2.5.0";
    return build;
  });
}

function BetaPlugin(builder) {
  builder.hook("build", build => {
    build.versions["beta-plugin"] = "3.4.0-beta.1";
    return build;
  });
}

function IncompatiblePlugin(builder) {
  builder.hook("build", build => {
    build.versions["incompatible-plugin"] = "1.9.0";
    return build;
  });
}

function FooPlugin(builder) {
  builder.hook("build", build => {
    if (!build.hasVersion("early-plugin", "^2.0.0")) {
      throw new Error("early-plugin should be loaded at this point");
    }
    if (!build.hasVersion("beta-plugin", "^3.0.0")) {
      throw new Error("beta-plugin should satisfy range");
    }
    if (build.hasVersion("incompatible-plugin", "^2.0.0")) {
      throw new Error("incompatible-plugin should have failed");
    }
    if (build.hasVersion("late-plugin", "^2.0.0")) {
      throw new Error("late-plugin should not be loaded at this point");
    }
    if (build.hasVersion("missing-plugin", "^1.0.0")) {
      throw new Error("missing-plugin should have failed");
    }
    build.versions["foo-plugin"] = "1.0.0";
    return build;
  });
}

function LatePlugin(builder) {
  builder.hook("build", build => {
    build.versions["late-plugin"] = "2.5.0";
    return build;
  });
}

test("generated schema", async () => {
  const schema = await buildSchema([
    ...defaultPlugins,
    EarlyPlugin,
    BetaPlugin,
    IncompatiblePlugin,
    FooPlugin,
    LatePlugin,
  ]);
  expect(schema).toBeTruthy();
});
