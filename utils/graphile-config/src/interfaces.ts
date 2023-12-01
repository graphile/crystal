export type PluginHookObject<T extends (...args: any[]) => any> = {
  provides?: string[];
  before?: string[];
  after?: string[];
  callback: T;
};

export type PluginHook<T extends (...args: any[]) => any> =
  | T
  | PluginHookObject<T>;

export type PluginHookCallback<T extends PluginHook<(...args: any[]) => any>> =
  T extends PluginHook<infer U> ? U : never;
