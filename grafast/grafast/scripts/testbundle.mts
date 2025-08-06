/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
/* eslint-disable @typescript-eslint/no-unused-vars */
import path from "node:path";

import { createFsFromVolume, Volume } from "memfs";
import webpack from "webpack";

const bundleFilename = "bundle.js";

const compiler = webpack({
  mode: "production",
  entry: path.resolve("./scripts/testbundle-entry.js"),
  output: {
    filename: bundleFilename,
    path: "/dist", // virtual path for memfs
    publicPath: "",
    chunkLoading: false,
    library: {
      type: "commonjs2",
    },
  },
  target: ["web"],
  resolve: {
    fallback: {
      process: false,
      fs: false,
      path: false,
      os: false,
      util: false,
      crypto: false,
    },
  },
  externals: [],
});

const memfs = createFsFromVolume(new Volume());
(memfs as any).join = path.join; // Required by Webpack
// Use memfs as the output filesystem
compiler.outputFileSystem = memfs;

await new Promise<void>((resolve, reject) => {
  compiler.run((err, stats) => {
    if (err || stats?.hasErrors()) {
      console.error(stats?.toString({ colors: true }));
      reject(err || new Error("Webpack build failed"));
    } else {
      resolve();
    }
  });
});

const source = memfs.readFileSync(`/dist/${bundleFilename}`, "utf8") as string;

// Shadow globals (like `process`) and eval
const module = await (async () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const global = undefined;
  const process = undefined;
  const require = undefined;
  const self = Object.create(null);
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const exports: Record<string, any> = {};
  const module = { exports };

  eval(source);

  return module;
})();

const graphqlModule = module.exports.graphql as typeof import("graphql");
const grafastModule = module.exports
  .grafast as typeof import("../dist/index.js");
const { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLInt } =
  graphqlModule;
const { grafast, loadMany } = grafastModule;

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      hello: {
        type: new GraphQLList(GraphQLInt),
        extensions: {
          grafast: {
            plan() {
              return loadMany(null, (v) => v.map(() => [1, 2, 3]));
            },
          },
        },
      },
    },
  }),
});

const response = await grafast({
  schema,
  source: "{ hello }",
  variableValues: {},
  contextValue: {},
});

if (!("data" in response) && !("errors" in response)) {
  throw new Error(`Expected ExecutionResult`);
}
const { data, errors } = response;

if (errors || !data) {
  console.error("❌ Test failed with errors", errors);
  process.exit(2);
}

if (
  Array.isArray(data.hello) &&
  data.hello.length === 3 &&
  data.hello.every((v, i) => v === i + 1)
) {
  console.log("✅ Test passed");
} else {
  console.error("❌ Test failed", data);
  process.exit(1);
}
