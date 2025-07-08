import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

import type { Compiler, Configuration, Resolver } from "webpack";
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JSX_REGEXP = /\.jsx?$/;
const NODE_MODULES_REGEXP = /[/\\]node_modules(?:[/\\]|$)/;

/**
 * Support for resolving `.js` / `.jsx` paths to `.ts` / `.tsx` files,
 * @see {@link https://github.com/TypeStrong/ts-loader/issues/1110#issuecomment-631018701}
 */
class TsResolvePlugin {
  apply(resolver: Resolver): void {
    const file = resolver.ensureHook("file");
    // Look for matching extension, giving preference to `.ts` over `.tsx`
    for (const ext of [".ts", ".tsx"]) {
      resolver
        .getHook("raw-file")
        .tapAsync("TsResolvePlugin", (req, ctx, cb) => {
          // If it's in node_modules, abort
          if (!req.path || NODE_MODULES_REGEXP.test(req.path)) {
            return cb();
          }

          // Generate new path by replacing extension
          const newPath = req.path.replace(JSX_REGEXP, ext);

          // If unchanged, abort
          if (newPath === req.path) {
            return cb();
          }

          // Hand over to resolver with new path
          resolver.doResolve(
            file,
            // Replace the request with our tweaked path
            {
              ...req,
              path: newPath,
              relativePath: req.relativePath?.replace(JSX_REGEXP, ext),
            },
            `trying '${newPath}'`,
            ctx,
            cb,
          );
        });
    }
  }
}

const intro = [
  "/* eslint-disable */",
  "/** IMPORTANT: these buffers are deflated */",
  "export const bundleData: Record<string, { etag: string, buffer: Buffer }> = {",
];
const outro = ["};"];
class OutputDataToSrcPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.emit.tap("OutputDataToSrcPlugin", (compilation) => {
      const data: string[] = [...intro];
      const maps: string[] = [...intro];
      const entries = Object.entries(compilation.assets);
      entries.sort((a, z) => (a[0] < z[0] ? -1 : a[0] > z[0] ? 1 : 0));
      for (const [filename, asset] of entries) {
        const source = asset.source();
        const key = JSON.stringify(filename);
        const buf = Buffer.isBuffer(source)
          ? source
          : Buffer.from(source as string);
        const deflated = deflateSync(buf);
        const hash = createHash("sha256").update(deflated).digest("base64url");
        const etag = `"sha256-${hash}"`; // quoted per HTTP spec
        const base64 = deflated.toString("base64");
        const sourceLine = `  ${key}: { etag: ${JSON.stringify(etag)}, buffer: Buffer.from("${base64}", "base64") },`;
        (filename.endsWith(".map") ? maps : data).push(sourceLine);
      }
      data.push(...outro);
      maps.push(...outro);
      writeFileSync(`${__dirname}/src/bundleData.ts`, data.join("\n") + "\n");
      writeFileSync(`${__dirname}/src/bundleMaps.ts`, maps.join("\n") + "\n");
    });
  }
}

const config: Configuration = {
  mode: "production",
  entry: {
    ruru: "./src/bundle.mtsx",
    jsonWorker: "monaco-editor/esm/vs/language/json/json.worker.js",
    graphqlWorker: "monaco-graphql/esm/graphql.worker.js",
    editorWorker: "monaco-editor/esm/vs/editor/editor.worker.js",
  },
  output: {
    path: `${__dirname}/static`,
    filename: "[name].js",
    module: true,
    chunkFormat: "module",
    chunkLoading: "import",
    library: {
      type: "module",
    },
  },
  devtool: "source-map",
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: "tsconfig.build.json",
        },
        resolve: { plugins: [new TsResolvePlugin()] },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        sideEffects: true,
      },
      {
        test: /\.svg$/,
        use: [{ loader: "svg-inline-loader" }],
        sideEffects: true,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "[hash][ext]",
        },
        sideEffects: true,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json", ".jsx", ".css", ".mjs"],
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new OutputDataToSrcPlugin(),
  ],
  //stats: "detailed",
};

export default config;
