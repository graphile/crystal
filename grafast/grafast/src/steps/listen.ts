import { SafeError } from "grafast";

import { isDev } from "../dev.js";
import type {
  GrafastResultStreamList,
  GrafastSubscriber,
  GrafastValuesList,
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
    moduleName: "grafast",
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
      | ExecutableStep<GrafastSubscriber<TTopics> | null>
      | GrafastSubscriber<TTopics>
      | null,
    topicOrPlan: ExecutableStep<TTopic> | string,
    public itemPlan: (itemPlan: __ItemStep<TTopics[TTopic]>) => TPayloadStep = (
      $item,
    ) => $item as any,
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
    count: number,
    values: readonly [
      GrafastValuesList<GrafastSubscriber<TTopics>>,
      GrafastValuesList<TTopic>,
    ],
  ): GrafastResultStreamList<TTopics[TTopic]> {
    const pubsubs = values[this.pubsubDep as 0];
    const topics = values[this.topicDep as 1];
    const result = [];
    for (let i = 0; i < count; i++) {
      const pubsub = pubsubs[i];
      if (!pubsub) {
        throw new SafeError(
          "Subscription not supported",
          isDev
            ? {
                hint: `${
                  this.dependencies[this.pubsubDep]
                } did not provide a GrafastSubscriber; perhaps you forgot to add the relevant property to context?`,
              }
            : {},
        );
      }
      const topic = topics[i];
      result[i] = pubsub.subscribe(topic);
    }
    return result;
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
    | ExecutableStep<GrafastSubscriber<TTopics> | null>
    | GrafastSubscriber<TTopics>
    | null,
  topicOrPlan: ExecutableStep<TTopic> | string,
  itemPlan?: (itemPlan: __ItemStep<TTopics[TTopic]>) => TPayloadStep,
): ListenStep<TTopics, TTopic, TPayloadStep> {
  return new ListenStep<TTopics, TTopic, TPayloadStep>(
    pubsubOrPlan,
    topicOrPlan,
    itemPlan,
  );
}
