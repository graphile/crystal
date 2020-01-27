import { Plugin } from "graphile-build";

export default function makePluginByCombiningPlugins(
  ...plugins: Array<Plugin>
): Plugin {
  return async (builder, options) => {
    for (const plugin of plugins) {
      await plugin(builder, options);
    }
  };
}
