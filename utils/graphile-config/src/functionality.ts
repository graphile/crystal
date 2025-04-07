import type {
  AnyCallback,
  CallbackDescriptor,
  CallbackOrDescriptor,
  FunctionalityObject,
  UnwrapCallback,
} from "./interfaces.js";
import { sortWithBeforeAfterProvides } from "./sort.js";

// TypeScript nonsense
const isCallbackDescriptor = <T extends AnyCallback>(
  v: CallbackOrDescriptor<T>,
): v is CallbackDescriptor<T> => typeof v !== "function";
const isCallback = <T extends AnyCallback>(
  v: CallbackOrDescriptor<T>,
): v is T => typeof v === "function";
function isArray(
  arg:
    | CallbackOrDescriptor<AnyCallback>
    | readonly CallbackDescriptor<AnyCallback>[],
): arg is readonly CallbackDescriptor<AnyCallback>[] {
  return Array.isArray(arg);
}

export function orderedApply<
  TFunctionality extends FunctionalityObject<TFunctionality>,
>(
  plugins: readonly GraphileConfig.Plugin[] | undefined,
  functionalityRetriever: (
    plugin: GraphileConfig.Plugin,
  ) => Partial<TFunctionality> | undefined,
  applyCallback: <TFunctionalityName extends keyof TFunctionality>(
    functionalityName: TFunctionalityName,
    hookFn: TFunctionality[TFunctionalityName] extends CallbackOrDescriptor<
      infer U
    >
      ? U
      : TFunctionality[TFunctionalityName] extends ReadonlyArray<
            CallbackDescriptor<infer U>
          >
        ? U
        : never,
    plugin: GraphileConfig.Plugin,
  ) => void,
): void {
  type FullFunctionalitySpec = {
    id: string;
    plugin: GraphileConfig.Plugin;
    provides: (keyof GraphileConfig.Plugins | keyof GraphileConfig.Provides)[];
    before: (keyof GraphileConfig.Plugins | keyof GraphileConfig.Provides)[];
    after: (keyof GraphileConfig.Plugins | keyof GraphileConfig.Provides)[];
    callback: UnwrapCallback<TFunctionality[keyof TFunctionality]>;
  };
  // Normalize all the plugin "functionalities" and gather them into collections
  const allFunctionalities: {
    [key in keyof TFunctionality]?: Array<FullFunctionalitySpec>;
  } = Object.create(null);
  let uid = 0;
  if (plugins) {
    for (const plugin of plugins) {
      const hooks = functionalityRetriever(plugin);
      if (!hooks) {
        continue;
      }
      const keys = Object.keys(hooks) as unknown as Array<keyof typeof hooks>;
      for (const key of keys) {
        const value:
          | CallbackOrDescriptor<AnyCallback>
          | readonly CallbackDescriptor<AnyCallback>[]
          | undefined = hooks[key];
        if (!value) {
          continue;
        }

        const hookList = isArray(value) ? value : [value];
        for (const hookSpecRaw of hookList) {
          const callback: TFunctionality[typeof key] extends CallbackOrDescriptor<
            infer U
          >
            ? U
            : never = (
            isCallback(hookSpecRaw) ? hookSpecRaw : hookSpecRaw.callback
          ) as any;
          const { provides, before, after } = isCallbackDescriptor(hookSpecRaw)
            ? hookSpecRaw
            : ({} as { provides?: never[]; before?: never[]; after?: never });
          if (!allFunctionalities[key]) {
            allFunctionalities[key] = [];
          }
          // We need to give each functionality a unique ID
          const id = String(uid++);
          allFunctionalities[key]!.push({
            id,
            plugin,
            callback,
            provides: [...(provides || []), id, plugin.name],
            before: before || [],
            after: after || [],
          });
        }
      }
    }
  }

  // Sort the collections according to provides, before and after.
  for (const functionalityName in allFunctionalities) {
    const functionalities = allFunctionalities[functionalityName] as
      | FullFunctionalitySpec[]
      | undefined;
    if (!functionalities) {
      continue;
    }

    const final = sortWithBeforeAfterProvides(functionalities, "id");

    // Finally we can register the functionalities
    for (const functionality of final) {
      applyCallback(
        functionalityName,
        functionality.callback,
        functionality.plugin,
      );
    }
  }
}
