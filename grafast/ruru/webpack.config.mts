import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { brotliCompress as brotliCompressCb, constants } from "node:zlib";

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { Compiler, Configuration, Resolver } from "webpack";
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const brotliCompress = promisify(brotliCompressCb);

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

function isDevAsset(filename: string) {
  return filename.endsWith(".map") || filename.endsWith(".ts");
}

const intro = [
  "/* eslint-disable */",
  "/** IMPORTANT: these buffers are compressed with brotli */",
  "export const bundleData: Record<string, { etag: string, buffer: Buffer }> = {",
];
const outro = ["};", ""];

class OutputDataToSrcPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.emit.tapPromise(
      "OutputDataToSrcPlugin",
      async (compilation) => {
        const code: string[] = [...intro];
        const meta: string[] = [...intro];
        const entries = Object.entries(compilation.assets);
        entries.sort((a, z) => (a[0] < z[0] ? -1 : a[0] > z[0] ? 1 : 0));
        const toAdd = await Promise.all(
          entries.map(async ([filename, asset]) => {
            const source = asset.source();
            const buf = Buffer.isBuffer(source) ? source : Buffer.from(source);
            const compressed = await brotliCompress(buf, {
              params: {
                [constants.BROTLI_PARAM_QUALITY]:
                  compiler.options.mode === "production" ? 11 : 1, // max compression for prod, min for dev
              },
            });
            const hash = createHash("sha256")
              .update(compressed)
              .digest("base64url");
            const etag = `"sha256-${hash}"`; // quoted per HTTP spec
            const base64 = compressed.toString("base64");
            const sourceLine = `\
  ${JSON.stringify(filename)}: {
    etag: ${JSON.stringify(etag)},
    buffer: Buffer.from(${JSON.stringify(base64)}, "base64"),
  },`;
            return [isDevAsset(filename) ? meta : code, sourceLine] as const;
          }),
        );
        // To ensure they're added in order
        for (const [target, line] of toAdd) {
          target.push(line);
        }
        code.push(...outro);
        meta.push(...outro);
        await Promise.all([
          writeFile(`${__dirname}/src/bundleCode.ts`, code.join("\n")),
          writeFile(`${__dirname}/src/bundleMeta.ts`, meta.join("\n")),
        ]);
      },
    );
  }
}

const config: Configuration = {
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
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        sideEffects: true,
      },
      {
        test: /\.svg$/,
        use: [{ loader: "svg-inline-loader" }],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "[hash][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json", ".jsx", ".css", ".mjs"],
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: "ruru.css",
    }),
    new OutputDataToSrcPlugin(),
  ],
  //stats: "detailed",
};

export default config;
