import { ExecutablePlan } from "../plan";

type UnwrapPlanTuple<TPlanTuple extends readonly ExecutablePlan<any>[]> = [
  ...(TPlanTuple extends readonly ExecutablePlan<infer U>[]
    ? readonly U[]
    : never)
];

export class ListPlan<
  TPlanTuple extends readonly ExecutablePlan<any>[],
> extends ExecutablePlan<UnwrapPlanTuple<TPlanTuple>> {
  private results: Array<UnwrapPlanTuple<TPlanTuple>> = [];
  constructor(list: readonly [...TPlanTuple]) {
    super();
    for (let i = 0, l = list.length; i < l; i++) {
      this.addDependency(list[i]);
    }
  }

  tupleToTuple(
    tuple: UnwrapPlanTuple<TPlanTuple>,
  ): UnwrapPlanTuple<TPlanTuple> {
    const tupleLength = tuple.length;
    // Note: `outerloop` is a JavaScript "label". They are not very common.
    // First look for an existing match:
    outerloop: for (let i = 0, l = this.results.length; i < l; i++) {
      const existingTuple = this.results[i];
      // Shortcut for identical tuples (unlikely).
      if (existingTuple === tuple) {
        return existingTuple;
      }
      // Slow loop over each value in the tuples; this is not expected to be a
      // particularly big loop, typically only 2-5 keys.
      for (let j = 0; j < tupleLength; j++) {
        if (existingTuple[j] !== tuple[j]) {
          // This isn't a match; try the next record in the outer loop
          continue outerloop;
        }
      }
      return existingTuple;
    }

    // That failed; store this tuple so the same tuple values result in the exact same array.
    this.results.push(tuple);
    return tuple;
  }

  execute(
    values: Array<UnwrapPlanTuple<TPlanTuple>>,
  ): Array<UnwrapPlanTuple<TPlanTuple>> {
    return values.map(this.tupleToTuple.bind(this));
  }

  deduplicate(peers: ListPlan<TPlanTuple>[]): ListPlan<TPlanTuple> {
    return peers.length > 0 ? peers[0] : this;
  }
}

export function list<TPlanTuple extends ExecutablePlan<any>[]>(
  list: TPlanTuple,
): ListPlan<TPlanTuple> {
  return new ListPlan(list);
}
