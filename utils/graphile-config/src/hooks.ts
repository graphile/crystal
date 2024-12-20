import { orderedApply } from "./functionality.js";
import type {
  CallbackDescriptor,
  CallbackOrDescriptor,
  FunctionalityObject,
  PromiseOrDirect,
  UnwrapCallback,
} from "./interfaces.js";

const isDev =
  typeof process !== "undefined" && process.env.GRAPHILE_ENV === "development";

export class AsyncHooks<THooks extends FunctionalityObject<THooks>> {
  callbacks: {
    [key in keyof THooks]?: Array<
      THooks[keyof THooks] extends CallbackOrDescriptor<infer U> ? U : never
    >;
  } = Object.create(null);

  hook<THookName extends keyof THooks>(
    event: THookName,
    fn: THooks[THookName] extends CallbackOrDescriptor<infer U> ? U : never,
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
      THooks[THookName] extends CallbackOrDescriptor<infer U> ? U : never
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

/* DEPRECATED */

/** @deprecated Use FunctionalityObject */
export type HookObject<T> = FunctionalityObject<T>;
/** @deprecated Use `orderedApply` */
export const applyHooks = orderedApply;
/** @deprecated Use CallbackDescriptor */
export type PluginHookObject<T extends (...args: any[]) => any> =
  CallbackDescriptor<T>;
/** @deprecated Use CallbackOrDescriptor */
export type PluginHook<
  T extends (...args: any[]) => PromiseOrDirect<UnwrapCallback<any> | void>,
> = CallbackOrDescriptor<T> | readonly CallbackDescriptor<T>[];
/** @deprecated Use UnwrapCallback */
export type PluginHookCallback<
  T extends CallbackOrDescriptor<(...args: any[]) => any>,
> = UnwrapCallback<T>;
