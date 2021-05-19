import { Plan } from "../plan";

export class MapPlan extends Plan {
  private mapper: (obj: object) => object;
  constructor(
    parentPlan: Plan,
    private actualKeyByDesiredKey: { [desiredKey: string]: string },
  ) {
    super();
    this.addDependency(parentPlan);
    // TODO: JIT this.
    this.mapper = (obj: object): object => {
      return Object.keys(actualKeyByDesiredKey).reduce((memo, desiredKey) => {
        memo[desiredKey] = obj[actualKeyByDesiredKey[desiredKey]];
        return memo;
      }, {} as object);
    };
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
  p: Plan,
  actualKeyByDesiredKey: { [desiredKey: string]: string },
): MapPlan {
  return new MapPlan(p, actualKeyByDesiredKey);
}
