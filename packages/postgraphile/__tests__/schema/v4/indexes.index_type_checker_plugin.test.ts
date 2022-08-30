const core = require("./core");

const IndexTypeCheckerPlugin = builder => {
  builder.hook("build", build => {
    const { pgIntrospectionResultsByKind } = build;
    if (
      !pgIntrospectionResultsByKind.index.every(idx => idx.indexType != null)
    ) {
      throw new Error("indexType missing");
    }
    return build;
  });
};

test(
  "index types are present on introspection",
  core.test(__filename, ["index_expressions"], {
    appendPlugins: [IndexTypeCheckerPlugin],
  })
);
