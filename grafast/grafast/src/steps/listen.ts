import { isDev } from "../dev.js";
import { SafeError } from "../index.js";
import type {
  ExecutionDetails,
  GrafastResultStreamList,
  GrafastSubscriber,
} from "../interfaces.js";
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
> extends ExecutableStep<TTopics[TTopic][]> {
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
      : constant(pubsubOrPlan, false);
    this.pubsubDep = this.addDependency($pubsub);
    this.topicDep = this.addDependency($topic);
  }

  execute({
    indexMap,
    values,
    stream,
  }: ExecutionDetails<
    readonly [GrafastSubscriber<TTopics>, TTopic]
  >): GrafastResultStreamList<TTopics[TTopic]> {
    if (!stream) {
      throw new Error("ListenStep must be streamed, never merely executed");
    }
    const pubsubValue = values[this.pubsubDep as 0];
    const topicValue = values[this.topicDep as 1];
    return indexMap((i) => {
      const pubsub = pubsubValue.at(i);
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
      const topic = topicValue.at(i);
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
