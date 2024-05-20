import type { AsyncHooks, PluginHook } from "graphile-config";

export const NULL_PRESET: GraphileConfig.ResolvedPreset = Object.freeze(
  Object.create(null),
);

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type GraphileConfigModule = typeof import("graphile-config");

type PromiseOrValue<T> = T | Promise<T>;

let graphileConfig: undefined | PromiseOrValue<null | GraphileConfigModule> =
  undefined;
let graphileConfigLoaded = false;

export function withGraphileConfig<T>(
  callback: (graphileConfig: GraphileConfigModule | null) => PromiseOrValue<T>,
): PromiseOrValue<T> {
  if (graphileConfig === undefined) {
    // ESM:
    // This should be
    //     graphileConfig = import("graphile-config").then(
    // but that causes a segfault in jest/node when testing third party
    // modules. So we had to convert everything to CommonJS.
    graphileConfig = new Promise<any>((resolve, reject) => {
      try {
        resolve(require("graphile-config"));
      } catch (e) {
        if (e.code === "ERR_REQUIRE_ESM") {
          return import("graphile-config").then(resolve, reject);
        } else {
          reject(e);
        }
      }
    }).then(
      (GC) => {
        graphileConfig = GC;
        graphileConfigLoaded = true;
        return GC;
      },
      () => {
        graphileConfig = null;
        graphileConfigLoaded = true;
        return null;
      },
    );
  }

  if (graphileConfigLoaded) {
    return callback(graphileConfig as GraphileConfigModule | null);
  } else {
    return (graphileConfig as Promise<any>).then(callback);
  }
}

const $$skipHooks = Symbol("skipHooks");
const $$hooksForPreset = Symbol("grafastHooks");

declare global {
  namespace GraphileConfig {
    interface ResolvedPreset {
      [$$hooksForPreset]?: null | AsyncHooks<GraphileConfig.GrafastHooks>;
      [$$skipHooks]?: Record<string, boolean>;
    }
  }
}

function withHooks<TResult>(
  resolvedPreset: GraphileConfig.ResolvedPreset,
  callback: (
    hooks: AsyncHooks<GraphileConfig.GrafastHooks> | null,
  ) => PromiseOrValue<TResult>,
) {
  const existing = resolvedPreset[$$hooksForPreset];
  if (existing !== undefined) {
    return callback(existing);
  }
  if (!resolvedPreset.plugins || resolvedPreset.plugins.length === 0) {
    resolvedPreset[$$hooksForPreset] = null;
    return callback(null);
  }
  const plugins = resolvedPreset.plugins;
  return withGraphileConfig((gc) => {
    if (gc !== null) {
      const hooks = new gc.AsyncHooks<GraphileConfig.GrafastHooks>();
      gc.orderedApply(
        plugins,
        (p) => p.grafast?.hooks,
        (name, fn, _plugin) => {
          hooks.hook(name, fn);
        },
      );
      resolvedPreset[$$hooksForPreset] = hooks;
      return callback(hooks);
    } else {
      resolvedPreset[$$hooksForPreset] = null;
      return callback(null);
    }
  });
}

export function hook<THookName extends keyof GraphileConfig.GrafastHooks>(
  resolvedPreset: GraphileConfig.ResolvedPreset,
  hookName: THookName,
  ...args: Parameters<
    GraphileConfig.GrafastHooks[THookName] extends PluginHook<infer U>
      ? U
      : never
  >
): PromiseOrValue<void> {
  if (resolvedPreset[$$skipHooks]?.[hookName]) {
    return;
  }
  return withHooks(resolvedPreset, (hooks) => {
    if (hooks !== null) {
      if (hooks.callbacks[hookName] !== undefined) {
        return hooks.process(hookName, ...args);
      } else {
        if (!resolvedPreset[$$skipHooks]) {
          resolvedPreset[$$skipHooks] = Object.create(null);
        }
        resolvedPreset[$$skipHooks]![hookName] = true;
        return;
      }
    } else {
      if (!resolvedPreset[$$skipHooks]) {
        resolvedPreset[$$skipHooks] = Object.create(null);
      }
      resolvedPreset[$$skipHooks]![hookName] = true;
      return;
    }
  });
}
