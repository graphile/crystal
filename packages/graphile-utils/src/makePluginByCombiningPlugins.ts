export default function makePluginByCombiningPlugins(
  ...plugins: Array<GraphileEngine.Plugin>
): GraphileEngine.Plugin {
  return async (builder, options) => {
    for (const plugin of plugins) {
      await plugin(builder, options);
    }
  };
}
