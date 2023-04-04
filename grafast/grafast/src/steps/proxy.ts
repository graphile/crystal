import type { GrafastResultsList, GrafastValuesList } from "../index.js";
import type { ExecutionExtra } from "../interfaces.js";
import { $$proxy } from "../interfaces.js";
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
  private $depId: number;
  constructor($dep: ExecutableStep<T>, $actualDep: ExecutableStep) {
    super();
    this.$depId = $dep.id;
    this.addDependency($actualDep);
  }
  public toStringMeta(): string | null {
    const $dep = this.opPlan.dangerouslyGetStep(this.$depId);
    return $dep.toString();
  }
  // Publicly expose this
  public addDependency(step: ExecutableStep): number {
    return super.addDependency(step);
  }
  execute(
    _count: number,
    values: [GrafastValuesList<T>],
  ): GrafastResultsList<T> {
    return values[0];
  }
  unbatchedExecute(extra: ExecutionExtra, value: T): T {
    return value;
  }
  // Do not proxy stream requests
  stream = undefined;
}

declare module "../step.js" {
  interface ExecutableStep {
    [$$proxy]?: any;
  }
}

function makeProxyHandler<T>(
  $toStep: ExecutableStep<T>,
): ProxyHandler<ExecutableStep<T>> {
  return {
    // $proxy - the ProxyStep instance
    // p - the property being accessed
    // proxy - the `new Proxy($proxy, ...)`
    get($proxy, p, proxy) {
      // Do not deduplicate the proxy-ness away!
      if (p === "deduplicate") {
        return () => [proxy];
      }
      // DO optimize the proxy-ness away, so execution doesn't need to be proxied
      if (p === "optimize") {
        delete $proxy[$$proxy];
        return () => [$proxy];
      }

      if (p in $proxy) {
        // $proxy has this property ('id', 'layerPlan', etc) - use it
        const val = $proxy[p as keyof typeof $proxy];
        if (typeof val === "function") {
          return function (...args: any[]) {
            return val.apply($proxy, args);
          };
        } else {
          return val;
        }
      } else {
        // $proxy doesn't understand this - delegate to $toStep
        const val = $toStep[p as keyof typeof $toStep];
        if (typeof val === "function") {
          return function (...args: any[]) {
            return val.apply($toStep, args);
          };
        } else {
          return val;
        }
      }
    },
    has($proxy, p) {
      if (p in $proxy) {
        return true;
      } else {
        return p in $toStep;
      }
    },
    set($proxy, p, newValue, receiver) {
      if (p in $proxy) {
        return Reflect.set($proxy, p, newValue, receiver);
      } else {
        throw new Error(
          `Setting through a ProxyStep is currently forbidden (attempted to set '${String(
            p,
          )}' on '${$proxy}'`,
        );
      }
    },
    getPrototypeOf(_$proxy) {
      return Object.getPrototypeOf($toStep);
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
  $actualDep: ExecutableStep = $step,
): TStep & { addDependency(step: ExecutableStep): number } {
  const $proxy = new ProxyStep($step, $actualDep);
  const proxy = new Proxy($proxy, makeProxyHandler($step)) as any; // Lie.
  $proxy[$$proxy] = proxy;
  return proxy;
}
