import type { GraphQLObjectType } from "graphql";

import type {
  ExecutionDetails,
  ExecutionExtra,
  GrafastResultsList,
  GrafastValuesList,
  PromiseOrDirect,
} from "../index.js";
import { polymorphicWrap } from "../index.js";
import type { PolymorphicStep } from "../step.js";
import { ExecutableStep } from "../step.js";
import { constant } from "./constant.js";

type StepData<TStep extends ExecutableStep> = TStep extends ExecutableStep<
  infer U
>
  ? U
  : any;

interface ConcretePolymorphicBranchMatcher<TStep extends ExecutableStep> {
  match: (obj: StepData<TStep>) => boolean;
  plan: ($obj: TStep) => ExecutableStep;
}
export interface PolymorphicBranchMatchers<TStep extends ExecutableStep> {
  [typeName: string]: PolymorphicBranchMatcher<TStep>;
}
export interface PolymorphicBranchMatcher<TStep extends ExecutableStep> {
  match?: (obj: StepData<TStep>) => boolean;
  plan?: ($obj: TStep) => ExecutableStep;
}

export class PolymorphicBranchStep<TStep extends ExecutableStep>
  extends ExecutableStep
  implements PolymorphicStep
{
  static $$export = {
    moduleName: "grafast",
    exportName: "PolymorphicBranchStep",
  };
  public isSyncAndSafe = true;
  private typeNames: string[];
  private matchers: {
    [typeName: string]: ConcretePolymorphicBranchMatcher<TStep>;
  };
  constructor($step: TStep, matchers: PolymorphicBranchMatchers<TStep>) {
    super();
    this.addDependency($step);
    this.typeNames = Object.keys(matchers);
    this.matchers = Object.fromEntries(
      Object.entries(matchers).map(([typeName, matcher]) => {
        const fixedMatcher = {
          match: matcher.match ?? ((obj) => obj.__typename === typeName),
          plan: matcher.plan ?? (($obj) => $obj),
        };
        return [typeName, fixedMatcher];
      }),
    );
  }

  planForType(objectType: GraphQLObjectType): ExecutableStep {
    const matcher = this.matchers[objectType.name];
    const $step = this.getDep(0) as TStep;
    if (matcher) {
      if (typeof matcher.plan === "function") {
        return matcher.plan($step);
      } else {
        return $step;
      }
    } else {
      // TODO: should this be an error?
      return constant(null);
    }
  }

  executeV2({
    count,
    values: [values0],
    unaries: [unaries0],
  }: ExecutionDetails): PromiseOrDirect<GrafastResultsList<any>> {
    const results: any[] = [];
    for (let i = 0; i < count; i++) {
      const obj = values0 !== null ? values0[i] : unaries0!;
      let match: string | null = null;
      if (obj != null) {
        for (const typeName of this.typeNames) {
          if (this.matchers[typeName].match(obj)) {
            match = typeName;
            break;
          }
        }
      }
      results[i] = match !== null ? polymorphicWrap(match, obj) : null;
    }
    return results;
  }
}

export function polymorphicBranch<TStep extends ExecutableStep>(
  $step: TStep,
  matchers: PolymorphicBranchMatchers<TStep>,
) {
  return new PolymorphicBranchStep($step, matchers);
}
