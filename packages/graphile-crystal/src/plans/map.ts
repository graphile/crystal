/* eslint-disable @typescript-eslint/ban-types */
import chalk from "chalk";

import type { CrystalError } from "../error";
import { isCrystalError } from "../error";
import { ExecutablePlan } from "../plan";

// Do **NOT** allow variables that start with `__`!
export const isSafeIdentifier = (key: string) =>
  /^(?:[a-z$]|_[a-z0-9$])[a-z0-9_$]*$/i.test(key);

type ActualKeyByDesiredKey = { [desiredKey: string]: string };

export function makeMapper(actualKeyByDesiredKey: ActualKeyByDesiredKey) {
  const entries = Object.entries(actualKeyByDesiredKey);
  if (
    entries.every(
      ([key, val]) => isSafeIdentifier(key) && isSafeIdentifier(val),
    )
  ) {
    // We can do a fast custom conversion
    return new Function(
      "obj",
      `return { ${entries
        .map(([key, val]) => `${key}: obj.${val}`)
        .join(", ")} }`,
    ) as any;
  }
  // Fallback to slow conversion
  return (obj: object | null | CrystalError): object | null | CrystalError => {
    if (obj == null || isCrystalError(obj)) {
      return obj;
    }
    return Object.keys(actualKeyByDesiredKey).reduce((memo, desiredKey) => {
      memo[desiredKey] = obj[actualKeyByDesiredKey[desiredKey]];
      return memo;
    }, {} as object);
  };
}

export class MapPlan extends ExecutablePlan {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "MapPlan ",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  private mapper: (obj: object) => object;
  constructor(
    parentPlan: ExecutablePlan,
    private actualKeyByDesiredKey: ActualKeyByDesiredKey,
  ) {
    super();
    this.addDependency(parentPlan);
    this.mapper = makeMapper(actualKeyByDesiredKey);
  }

  toStringMeta(): string {
    return (
      chalk.bold.yellow(String(this.dependencies[0])) +
      ":" +
      JSON.stringify(this.actualKeyByDesiredKey)
    );
  }

  execute(values: any[][]): any[] {
    return values[0].map(this.mapper);
  }

  executeSingle = (value: any[]): any => this.mapper(value[0]);

  deduplicate(peers: MapPlan[]): MapPlan {
    const myMap = JSON.stringify(this.actualKeyByDesiredKey);
    const peersWithSameMap = peers.filter(
      (p) => JSON.stringify(p.actualKeyByDesiredKey) === myMap,
    );
    return peersWithSameMap.length > 0 ? peersWithSameMap[0] : this;
  }
}

export function map(
  p: ExecutablePlan,
  actualKeyByDesiredKey: { [desiredKey: string]: string },
): MapPlan {
  return new MapPlan(p, actualKeyByDesiredKey);
}
