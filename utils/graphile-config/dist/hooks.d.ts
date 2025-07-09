import { orderedApply } from "./functionality.js";
import type { CallbackDescriptor, CallbackOrDescriptor, FunctionalityObject, PromiseOrDirect, UnwrapCallback } from "./interfaces.js";
export declare class AsyncHooks<THooks extends FunctionalityObject<THooks>> {
    callbacks: {
        [key in keyof THooks]?: Array<THooks[keyof THooks] extends CallbackOrDescriptor<infer U> ? U : never>;
    };
    hook<THookName extends keyof THooks>(event: THookName, fn: THooks[THookName] extends CallbackOrDescriptor<infer U> ? U : never): void;
    /**
     * Hooks can _mutate_ the argument, they cannot return a replacement. This
     * allows us to completely side-step the problem of recursive calls.
     */
    process<THookName extends keyof THooks>(hookName: THookName, ...args: Parameters<THooks[THookName] extends CallbackOrDescriptor<infer U> ? U : never>): void | Promise<void>;
}
/** @deprecated Use FunctionalityObject */
export type HookObject<T> = FunctionalityObject<T>;
/** @deprecated Use `orderedApply` */
export declare const applyHooks: typeof orderedApply;
/** @deprecated Use CallbackDescriptor */
export type PluginHookObject<T extends (...args: any[]) => any> = CallbackDescriptor<T>;
/** @deprecated Use CallbackOrDescriptor */
export type PluginHook<T extends (...args: any[]) => PromiseOrDirect<UnwrapCallback<any> | void>> = CallbackOrDescriptor<T> | readonly CallbackDescriptor<T>[];
/** @deprecated Use UnwrapCallback */
export type PluginHookCallback<T extends CallbackOrDescriptor<(...args: any[]) => any>> = UnwrapCallback<T>;
//# sourceMappingURL=hooks.d.ts.map