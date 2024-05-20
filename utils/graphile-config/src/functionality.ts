import type {
  CallbackDescriptor,
  OrderedCallback,
  PromiseOrDirect,
} from "./interfaces.js";
import { sortWithBeforeAfterProvides } from "./sort.js";

export type FunctionalityObject<T> = Record<
  keyof T,
  CallbackDescriptor<(...args: any[]) => any>
>;
export function orderedApply<
  TFunctionality extends FunctionalityObject<TFunctionality>,
>(
  plugins: readonly GraphileConfig.Plugin[] | undefined,
  functionalityRetriever: (
    plugin: GraphileConfig.Plugin,
  ) => Partial<TFunctionality> | undefined,
  applyCallback: <TFunctionalityName extends keyof TFunctionality>(
    functionalityName: TFunctionalityName,
    hookFn: TFunctionality[TFunctionalityName] extends CallbackDescriptor<
      infer U
    >
      ? U
      : never,
    plugin: GraphileConfig.Plugin,
  ) => void,
): void {
  type FullFunctionalitySpec = {
    id: string;
    plugin: GraphileConfig.Plugin;
    provides: string[];
    before: string[];
    after: string[];
    callback: TFunctionality[keyof TFunctionality] extends CallbackDescriptor<
      infer U
    >
      ? U
      : never;
  };
  // Normalize all the hooks and gather them into collections
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
        const hookSpecRaw: TFunctionality[typeof key] | undefined = hooks[key];
        if (!hookSpecRaw) {
          continue;
        }

        // TypeScript nonsense
        const isOrderedCallback = <T extends (...args: any[]) => any>(
          v: CallbackDescriptor<T>,
        ): v is OrderedCallback<T> => typeof v !== "function";
        const isCallback = <T extends (...args: any[]) => any>(
          v: CallbackDescriptor<T>,
        ): v is T => typeof v === "function";

        const callback: TFunctionality[typeof key] extends CallbackDescriptor<
          infer U
        >
          ? U
          : never = (
          isCallback(hookSpecRaw) ? hookSpecRaw : hookSpecRaw.callback
        ) as any;
        const { provides, before, after } = isOrderedCallback(hookSpecRaw)
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
