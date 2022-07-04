import type {
  CrystalResultStreamList,
  CrystalSubscriber,
  CrystalValuesList,
} from "../interfaces.js";
import type { StreamableStep } from "../step.js";
import { ExecutableStep, isExecutableStep } from "../step.js";
import type { __ItemStep } from "./__item.js";
import { constant } from "./constant.js";

/**
 * Subscribes to the given `pubsubOrPlan` to get realtime updates on a given
 * topic (`topicOrPlan`), mapping the resulting event via the `itemPlan`
 * callback.
 */
export class ListenStep<
    TTopics extends { [topic: string]: any },
    TTopic extends keyof TTopics,
    TPayloadStep extends ExecutableStep,
  >
  extends ExecutableStep<TTopics[TTopic]>
  implements StreamableStep<TTopics[TTopic]>
{
  static $$export = {
    moduleName: "dataplanner",
    exportName: "ListenStep",
  };
  isSyncAndSafe = true;

  /**
   * The id for the PostgreSQL context plan.
   */
  private pubsubDep: number;

  /**
   * The plan that will tell us which topic we're subscribing to.
   */
  private topicDep: number;

  constructor(
    pubsubOrPlan:
      | ExecutableStep<CrystalSubscriber<TTopics>>
      | CrystalSubscriber<TTopics>,
    topicOrPlan: ExecutableStep<TTopic> | string,
    public itemPlan: (itemPlan: __ItemStep<TTopics[TTopic]>) => TPayloadStep,
  ) {
    super();
    const $topic =
      typeof topicOrPlan === "string" ? constant(topicOrPlan) : topicOrPlan;
    const $pubsub = isExecutableStep(pubsubOrPlan)
      ? pubsubOrPlan
      : constant(pubsubOrPlan);
    this.pubsubDep = this.addDependency($pubsub);
    this.topicDep = this.addDependency($topic);
  }

  execute(): never {
    throw new Error("ListenStep cannot be executed, it can only be streamed");
  }

  stream(
    values: [
      CrystalValuesList<CrystalSubscriber<TTopics>>,
      CrystalValuesList<TTopic>,
    ],
  ): CrystalResultStreamList<TTopics[TTopic]> {
    return values[this.pubsubDep as 0].map((pubsub, i) => {
      const topic = values[this.topicDep as 1][i];
      return pubsub.subscribe(topic);
    });
  }
}

/**
 * Subscribes to the given `pubsubOrPlan` to get realtime updates on a given
 * topic (`topicOrPlan`), mapping the resulting event via the `itemPlan`
 * callback.
 */
export function listen<
  TTopics extends { [topic: string]: any },
  TTopic extends keyof TTopics,
  TPayloadStep extends ExecutableStep,
>(
  pubsubOrPlan:
    | ExecutableStep<CrystalSubscriber<TTopics>>
    | CrystalSubscriber<TTopics>,
  topicOrPlan: ExecutableStep<TTopic> | string,
  itemPlan: (itemPlan: __ItemStep<TTopics[TTopic]>) => TPayloadStep,
): ListenStep<TTopics, TTopic, TPayloadStep> {
  return new ListenStep<TTopics, TTopic, TPayloadStep>(
    pubsubOrPlan,
    topicOrPlan,
    itemPlan,
  );
}
