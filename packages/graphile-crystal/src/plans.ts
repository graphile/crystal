import { Plan } from "./plan";

class MapPlan extends Plan {
  private mapper: (obj: object) => object;
  constructor(
    parentPlan: Plan,
    actualKeyByDesiredKey: { [desiredKey: string]: string },
  ) {
    super();
    this.addDependency(parentPlan);
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
}

export function map(
  p: Plan,
  actualKeyByDesiredKey: { [desiredKey: string]: string },
): MapPlan {
  return new MapPlan(p, actualKeyByDesiredKey);
}
