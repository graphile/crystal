import type { FunctionalityObject } from "./functionality.js";
import { orderedApply } from "./functionality.js";
import type {
  CallbackDescriptor,
  OrderedCallback,
  PromiseOrDirect,
  UnwrapCallback,
} from "./interfaces.js";

const isDev = process.env.GRAPHILE_ENV === "development";

/** @deprecated Use FunctionalityObject */
export type HookObject<T> = FunctionalityObject<T>;

/** @deprecated Use Middlewares */
export class AsyncHooks<THooks extends FunctionalityObject<THooks>> {
  callbacks: {
    [key in keyof THooks]?: Array<
      THooks[keyof THooks] extends CallbackDescriptor<infer U> ? U : never
    >;
  } = Object.create(null);

  hook<THookName extends keyof THooks>(
    event: THookName,
    fn: THooks[THookName] extends CallbackDescriptor<infer U> ? U : never,
  ): void {
    this.callbacks[event] = this.callbacks[event] || [];
    this.callbacks[event]!.push(fn);
  }

  /**
   * Hooks can _mutate_ the argument, they cannot return a replacement. This
   * allows us to completely side-step the problem of recursive calls.
   */
  process<THookName extends keyof THooks>(
    hookName: THookName,
    ...args: Parameters<
      THooks[THookName] extends CallbackDescriptor<infer U> ? U : never
    >
  ): void | Promise<void> {
    const callbacks = this.callbacks[hookName];
    if (!callbacks) {
      return;
    }
    const l = callbacks.length;
    let chain = undefined;
    for (let i = 0; i < l; i++) {
      const callback = callbacks[i];
      if (chain !== undefined) {
        chain = chain.then(() => callback.apply(null, args));
      } else {
        const result = callback.apply(null, args);
        if (result != null) {
          if (isDev && typeof result.then !== "function") {
            throw new Error(
              `Hook '${
                hookName as string
              }' returned invalid value of type ${typeof result} - must be 'undefined' or a Promise/PromiseLike.`,
            );
          }
          chain = result;
        }
      }
    }
    return chain;
  }
}

/** @deprecated Use `orderedApply` */
export const applyHooks = orderedApply;

/** @deprecated Use OrderedCallback */
export type PluginHookObject<T extends (...args: any[]) => any> =
  OrderedCallback<T>;
/** @deprecated Use CallbackDescriptor */
export type PluginHook<
  T extends (...args: any[]) => PromiseOrDirect<UnwrapCallback<any> | void>,
> = CallbackDescriptor<T>;
/** @deprecated Use UnwrapCallback */
export type PluginHookCallback<
  T extends CallbackDescriptor<(...args: any[]) => any>,
> = UnwrapCallback<T>;
