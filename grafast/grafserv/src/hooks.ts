import { applyHooks, AsyncHooks } from "graphile-config";

export function getGrafservHooks(
  resolvedPreset: GraphileConfig.ResolvedPreset,
) {
  const hooks = new AsyncHooks<GraphileConfig.GrafservHooks>();
  applyHooks(
    resolvedPreset.plugins,
    (p) => p.grafserv?.hooks,
    (name, fn, _plugin) => {
      const context = {
        resolvedPreset,
      };

      (hooks.hook as any)(
        name as any,
        ((...args: any[]) => (fn as any)(context, ...args)) as any,
      );
    },
  );
  return hooks;
}
