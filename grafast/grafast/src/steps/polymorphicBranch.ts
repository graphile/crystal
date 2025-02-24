import type { GraphQLObjectType } from "graphql";

import type {
  ExecutionDetails,
  GrafastResultsList,
  PromiseOrDirect,
} from "../index.js";
import { polymorphicWrap } from "../index.js";
import type { PolymorphicStep } from "../step.js";
import { Step } from "../step.js";
import { constant } from "./constant.js";

type StepData<TStep extends Step> = TStep extends Step<infer U> ? U : any;

interface ConcretePolymorphicBranchMatcher<TStep extends Step> {
  match: (obj: StepData<TStep>) => boolean;
  plan: ($obj: TStep) => Step;
}
export interface PolymorphicBranchMatchers<TStep extends Step> {
  [typeName: string]: PolymorphicBranchMatcher<TStep>;
}
export interface PolymorphicBranchMatcher<TStep extends Step> {
  match?: (obj: StepData<TStep>) => boolean;
  plan?: ($obj: TStep) => Step;
}

export class PolymorphicBranchStep<TStep extends Step>
  extends Step
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

  planForType(objectType: GraphQLObjectType): Step {
    const matcher = this.matchers[objectType.name];
    const $step = this.getDep<TStep>(0);
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

  execute({
    indexMap,
    values: [values0],
  }: ExecutionDetails): PromiseOrDirect<GrafastResultsList<any>> {
    return indexMap((i) => {
      const obj = values0.at(i);
      let match: string | null = null;
      if (obj != null) {
        for (const typeName of this.typeNames) {
          if (this.matchers[typeName].match(obj)) {
            match = typeName;
            break;
          }
        }
      }
      return match !== null ? polymorphicWrap(match, obj) : null;
    });
  }
}

export function polymorphicBranch<TStep extends Step>(
  $step: TStep,
  matchers: PolymorphicBranchMatchers<TStep>,
) {
  return new PolymorphicBranchStep($step, matchers);
}
