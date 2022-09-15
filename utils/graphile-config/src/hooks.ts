import * as assert from "assert";

import type { PluginHook, PluginHookObject } from "./interfaces.js";

export type HookObject<T> = Record<keyof T, (...args: any[]) => any>;

export class AsyncHooks<THooks extends HookObject<THooks>> {
  callbacks: { [key in keyof THooks]?: Array<THooks[keyof THooks]> } = {};

  hook<TKey extends keyof THooks>(event: TKey, fn: THooks[TKey]): void {
    this.callbacks[event] = this.callbacks[event] || [];
    this.callbacks[event]!.push(fn);
  }

  /**
   * Hooks can _mutate_ the argument, they cannot return a replacement. This
   * allows us to completely side-step the problem of recursive calls.
   */
  async process<TKey extends keyof THooks>(
    event: TKey,
    ...args: Parameters<THooks[TKey]>
  ): Promise<void> {
    const [arg, ...rest] = args;
    const callbacks = this.callbacks[event];
    if (callbacks) {
      for (const callback of callbacks!) {
        await callback(arg, ...rest);
      }
    }
  }
}

export function applyHooks<
  THooks extends {
    [key: string]: PluginHook<(...args: any[]) => any>;
  },
>(
  plugins: GraphileConfig.Plugin[],
  hooksRetriever: (
    plugin: GraphileConfig.Plugin,
  ) => Partial<THooks> | undefined,
  applyHookCallback: <THookName extends keyof THooks>(
    hookName: THookName,
    hookFn: THooks[THookName] extends PluginHook<infer U> ? U : never,
    plugin: GraphileConfig.Plugin,
  ) => void,
): void {
  type FullHookSpec = {
    id: string;
    plugin: GraphileConfig.Plugin;
    provides: string[];
    before: string[];
    after: string[];
    callback: THooks[keyof THooks] extends PluginHook<infer U> ? U : never;
  };
  // Normalize all the hooks and gather them into collections
  const allHooks: {
    [key in keyof THooks]?: Array<FullHookSpec>;
  } = Object.create(null);
  let uid = 0;
  for (const plugin of plugins) {
    const hooks = hooksRetriever(plugin);
    if (!hooks) {
      continue;
    }
    const keys = Object.keys(hooks) as unknown as Array<keyof typeof hooks>;
    for (const key of keys) {
      const hookSpecRaw: THooks[typeof key] | undefined = hooks[key];
      if (!hookSpecRaw) {
        continue;
      }

      // TypeScript nonsense
      const isPluginHookObject = <T extends (...args: any[]) => any>(
        v: PluginHook<T>,
      ): v is PluginHookObject<T> => typeof v !== "function";
      const isPluginHookFunction = <T extends (...args: any[]) => any>(
        v: PluginHook<T>,
      ): v is T => typeof v === "function";

      const callback: THooks[typeof key] extends PluginHook<infer U>
        ? U
        : never = (
        isPluginHookFunction(hookSpecRaw) ? hookSpecRaw : hookSpecRaw.callback
      ) as any;
      const { provides, before, after } = isPluginHookObject(hookSpecRaw)
        ? hookSpecRaw
        : ({} as { provides?: never[]; before?: never[]; after?: never });
      if (!allHooks[key]) {
        allHooks[key] = [];
      }
      // We need to give each hook a unique ID
      const id = String(uid++);
      allHooks[key]!.push({
        id,
        plugin,
        callback,
        provides: [...(provides || []), id],
        before: before || [],
        after: after || [],
      });
    }
  }

  // Sort the collections according to provides, before and after.
  for (const hookName in allHooks) {
    const hooks = allHooks[hookName] as FullHookSpec[] | undefined;
    if (!hooks) {
      continue;
    }

    // "before" and "after" are very similar, lets simplify them into one
    // concept by converting all the "befores" into "afters" on their targets.
    for (const hook of hooks) {
      const { id, before } = hook;
      if (before.length) {
        const previousBefore = before.splice(0, before.length);
        for (const otherHook of hooks) {
          if (
            previousBefore.some((beforeValue) =>
              otherHook.provides.includes(beforeValue),
            )
          ) {
            otherHook.after.push(id);
          }
        }
      }
    }

    // Now lets figure out all the possible provides values:
    const providers: {
      [key: string]: typeof hooks;
    } = Object.create(null);
    for (const hook of hooks) {
      const { provides } = hook;
      for (const provide of provides) {
        if (!providers[provide]) {
          providers[provide] = [];
        }
        providers[provide]!.push(hook);
      }
    }

    // And ignore any "afters" with no providers:
    const validProviders = Object.keys(providers);
    for (const hook of hooks) {
      hook.after = hook.after.filter((afterValue) =>
        validProviders.includes(afterValue),
      );
    }

    const final = [];
    const remaining = [...hooks];
    // Now we can iteratively add items following the rule that there must be
    // no pending items that "provides" anything that the hook must come
    // "after".
    for (let loops = 0; loops < 10000; loops++) {
      let changes = 0;
      if (remaining.length === 0) {
        // We're done!
        break;
      }

      for (let i = 0; i < remaining.length; i++) {
        const hook = remaining[i];
        if (!hook) {
          continue;
        }
        const dependsOnRemaining = remaining.some(
          (otherHook) =>
            otherHook !== hook &&
            otherHook.provides.some((otherHookProvide) =>
              hook.after.includes(otherHookProvide),
            ),
        );
        if (!dependsOnRemaining) {
          changes++;
          remaining.splice(i, 1);
          final.push(hook);
          i--;
        }
      }

      if (changes === 0) {
        throw new Error("Infinite loop in hook dependencies detected.");
      }
    }

    assert.equal(
      final.length,
      hooks.length,
      `Expected the same number of hooks after sorting`,
    );

    // Finally we can register the hooks
    for (const hook of final) {
      applyHookCallback(hookName, hook.callback, hook.plugin);
    }
  }
}
