import type { GrafastResultsList, GrafastValuesList } from "../index.js";
import type { ExecutionExtra } from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";

/**
 * @experimental
 *
 * Never build this class directly.
 */
export class ProxyStep<T> extends UnbatchedExecutableStep<T> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ProxyStep",
  };
  isSyncAndSafe = true;
  constructor($dep: ExecutableStep<T>) {
    super();
    this.addDependency($dep);
  }
  // Publicly expose this
  public addDependency(step: ExecutableStep<any>): number {
    return super.addDependency(step);
  }
  execute(values: [GrafastValuesList<T>]): GrafastResultsList<T> {
    return values[0];
  }
  executeSingle(extra: ExecutionExtra, value: T): T {
    return value;
  }
  // Do not proxy stream requests
  stream = undefined;
}

function makeProxyHandler<T>(
  $toStep: ExecutableStep<T>,
): ProxyHandler<ExecutableStep<T>> {
  return {
    get(target, p, proxy) {
      if (p in target) {
        // Do not deduplicate the proxy-ness away!
        if (p === "deduplicate") {
          return () => [proxy];
        }
        // DO optimize the proxy-ness away, so execution doesn't need to be proxied
        if (p === "optimize") {
          return () => [target];
        }
        const val = target[p];
        if (typeof val === "function") {
          return function (...args: any[]) {
            return val.apply(target, args);
          };
        } else {
          return val;
        }
      } else {
        const val = $toStep[p];
        if (typeof val === "function") {
          return function (...args: any[]) {
            return val.apply($toStep, args);
          };
        } else {
          return val;
        }
      }
    },
    has(target, p) {
      if (p in target) {
        return true;
      } else {
        return p in $toStep;
      }
    },
    set(target, p, newValue, receiver) {
      if (p in target) {
        return Reflect.set(target, p, newValue, receiver);
      } else {
        throw new Error(
          `Setting through a ProxyStep is currently forbidden (attempted to set '${String(
            p,
          )}' on '${target}'`,
        );
      }
    },
  };
}

/**
 * @experimental
 *
 * This could change at any time, may impact performance, and just, generally,
 * needs more work. You shouldn't need this in the vast majority of cases.
 */
export function proxy<TData, TStep extends ExecutableStep<TData>>(
  $step: TStep,
): TStep & { addDependency(step: ExecutableStep): number } {
  const $proxy = new ProxyStep($step);
  return new Proxy($proxy, makeProxyHandler($step)) as any; // Lie.
}
