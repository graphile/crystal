import { writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

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

function backtickEscape(string: string) {
  return string.replace(/([`\\]|\$\{)/g, `\\$&`);
}

class OutputDataToSrcPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.emit.tap("OutputDataToSrcPlugin", (compilation) => {
      const output: string[] = [];
      output.push("/* eslint-disable */");
      output.push("export const bundleData = {");
      const entries = Object.entries(compilation.assets);
      entries.sort((a, z) => (a[0] < z[0] ? -1 : a[0] > z[0] ? 1 : 0));
      for (const [filename, asset] of entries) {
        const source = asset.source();
        if (/\.([mc]?[jt]sx?|json|css|svg)$/.test(filename)) {
          const content = backtickEscape(source.toString("utf8").trim());
          output.push(`  ${JSON.stringify(filename)}: \`\n${content}\`,`);
        } else {
          const buf = Buffer.isBuffer(source)
            ? source
            : Buffer.from(source as string);
          const base64 = buf.toString("base64");
          output.push(`  ${filename}: Buffer.from("${base64}", "base64"),`);
        }
      }
      output.push("};");
      writeFileSync(`${__dirname}/src/bundleData.ts`, output.join("\n") + "\n");
    });
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
    path: `${__dirname}/bundle`,
    filename: "[name].js",
    module: true,
    chunkFormat: "module",
    chunkLoading: "import",
  },
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
        use: ["file-loader"],
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
