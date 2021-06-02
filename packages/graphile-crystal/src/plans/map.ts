import chalk from "chalk";

import { ExecutablePlan } from "../plan";

type ActualKeyByDesiredKey = { [desiredKey: string]: string };

export function makeMapper(actualKeyByDesiredKey: ActualKeyByDesiredKey) {
  // TODO: JIT this.
  return (obj: object): object => {
    return Object.keys(actualKeyByDesiredKey).reduce((memo, desiredKey) => {
      memo[desiredKey] = obj[actualKeyByDesiredKey[desiredKey]];
      return memo;
    }, {} as object);
  };
}

export class MapPlan extends ExecutablePlan {
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
    return values.map((value) => {
      const previous = value[0];
      return this.mapper(previous);
    });
  }

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
