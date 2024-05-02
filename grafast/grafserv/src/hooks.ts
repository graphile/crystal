import { applyHooks, AsyncHooks } from "graphile-config";

// We could use a global WeakMap, but storing directly onto the resolvedPreset
// should use more traditional garbage collection.
const $$hooks = Symbol("hooks");

export function getGrafservHooks(
  resolvedPreset: GraphileConfig.ResolvedPreset & {
    [$$hooks]?: AsyncHooks<GraphileConfig.GrafservHooks>;
  },
) {
  if (resolvedPreset[$$hooks]) {
    return resolvedPreset[$$hooks];
  }
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
  try {
    resolvedPreset[$$hooks] = hooks;
  } catch {
    // Ignore - preset must be readonly
  }
  return hooks;
}
