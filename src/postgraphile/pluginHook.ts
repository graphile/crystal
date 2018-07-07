/* eslint-disable */// Because we use tslint
import { AddFlagFn } from './cli'
import { Server } from 'http'
import { Postgraphile } from '../interfaces'
import { WithPostGraphileContextFn } from './withPostGraphileContext'
import HttpRequestHandler = Postgraphile.HttpRequestHandler
import PostGraphileOptions = Postgraphile.PostGraphileOptions

export type HookFn<T> = (arg: T, context: {}) => T
export type PluginHookFn = <T>(hookName: string, argument: T, context?: {}) => T
export interface PostGraphilePlugin {
  'pluginHook'?: HookFn<PluginHookFn>
  'cli:flags:add:standard'?: HookFn<AddFlagFn>
  'cli:flags:add:schema'?: HookFn<AddFlagFn>
  'cli:flags:add:errorHandling'?: HookFn<AddFlagFn>
  'cli:flags:add:plugins'?: HookFn<AddFlagFn>
  'cli:flags:add:noServer'?: HookFn<AddFlagFn>
  'cli:flags:add:webserver'?: HookFn<AddFlagFn>
  'cli:flags:add:jwt'?: HookFn<AddFlagFn>
  'cli:flags:add'?: HookFn<AddFlagFn>
  'cli:flags:add:deprecated'?: HookFn<AddFlagFn>
  'cli:flags:add:workarounds'?: HookFn<AddFlagFn>

  'cli:server:middleware'?: HookFn<HttpRequestHandler>
  'cli:server:created'?: HookFn<Server>

  'postgraphile:options'?: HookFn<PostGraphileOptions>
  'withPostGraphileContext'?: HookFn<WithPostGraphileContextFn>
}
type HookName = keyof PostGraphilePlugin

const identityHook = <T>(input: T): T => input
const identityPluginHook = <T>(_hookName: HookName, input: T): T => input

function contextIsSame(context1: {}, context2: {}): boolean {
  // Shortcut if obvious
  if (context1 === context2) {
    return true
  }
  // Blacklist approach from now on
  const keys1 = Object.keys(context1)
  const keys2 = Object.keys(context2)
  if (keys1.length !== keys2.length) {
    return false
  }
  // tslint:disable-next-line one-variable-per-declaration
  for (let i = 0, l = keys1.length; i < l; i++) {
    const key = keys1[i]
    if (context1[key] !== context2[key]) {
      return false
    }
    if (keys2.indexOf(key) === -1) {
      return false
    }
  }

  return true
}

// Caches the last value of the hook, in case it's called with exactly the same
// arguments again.
function memoizeHook<T>(hook: HookFn<T>): HookFn<T> {
  let lastCall: {
    argument: T,
    context: {},
    result: T,
  } | null = null
  return (argument: T, context: {}): T => {
    if (lastCall && lastCall.argument === argument && contextIsSame(lastCall.context, context)) {
      return lastCall.result
    } else {
      const result = hook(argument, context)
      lastCall = {
        argument,
        context,
        result,
      }
      return result
    }
  }
}

function makeHook<T>(
  plugins: Array<PostGraphilePlugin>,
  hookName: HookName,
): HookFn<T> {
  return memoizeHook<T>(plugins.reduce((previousHook: HookFn<T>, plugin: {}) => {
    if (typeof plugin[hookName] === 'function') {
      return (argument: T, context: {}) => {
        return plugin[hookName](previousHook(argument, context), context)
      }
    } else {
      return previousHook
    }
  }, identityHook))
}

export function makePluginHook(
  plugins: Array<PostGraphilePlugin>,
): PluginHookFn {
  const hooks = {}
  const emptyObject = {} // caching this makes memoization faster when no context is needed
  function rawPluginHook<T>(hookName: HookName, argument: T, context: {} = emptyObject): T {
    if (!hooks[hookName]) {
      hooks[hookName] = makeHook(plugins, hookName)
    }
    return hooks[hookName](argument, context)
  }

  const pluginHook: PluginHookFn = rawPluginHook('pluginHook', rawPluginHook, {})
  return pluginHook
}

export function pluginHookFromOptions(options: PostGraphileOptions): PluginHookFn {
  if (typeof options.pluginHook === 'function') {
    return options.pluginHook
  } else {
    return identityPluginHook
  }
}
