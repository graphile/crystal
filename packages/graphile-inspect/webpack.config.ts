import webpack, { Resolver } from "webpack";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const JSX_REGEXP = /\.jsx?$/;
const NODE_MODULES_REGEXP = /[\/\\]node_modules(?:[\/\\]|$)/;

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

export default {
  entry: "./src/bundle.tsx",
  output: {
    // @ts-ignore
    path: `${path.dirname(fileURLToPath(import.meta.url))}/bundle`,
    filename: "graphile-inspect.min.js",
    library: "GraphileInspectBundle",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
        resolve: { plugins: [new TsResolvePlugin()] },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};
