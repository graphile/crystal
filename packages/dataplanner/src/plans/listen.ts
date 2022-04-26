import type {
  CrystalResultStreamList,
  CrystalSubscriber,
  CrystalValuesList,
} from "../interfaces";
import type { StreamablePlan } from "../plan";
import { ExecutablePlan, isExecutablePlan } from "../plan";
import type { __ItemPlan } from "./__item";
import { constant } from "./constant";

/**
 * Subscribes to the given `pubsubOrPlan` to get realtime updates on a given
 * topic (`topicOrPlan`), mapping the resulting event via the `itemPlan`
 * callback.
 */
export class ListenPlan<
    TTopics extends { [topic: string]: any },
    TTopic extends keyof TTopics,
    TPayloadPlan extends ExecutablePlan,
  >
  extends ExecutablePlan<TTopics[TTopic]>
  implements StreamablePlan<TTopics[TTopic]>
{
  static $$export = {
    moduleName: "dataplanner",
    exportName: "ListenPlan",
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
      | ExecutablePlan<CrystalSubscriber<TTopics>>
      | CrystalSubscriber<TTopics>,
    topicOrPlan: ExecutablePlan<TTopic> | string,
    public itemPlan: (itemPlan: __ItemPlan<TTopics[TTopic]>) => TPayloadPlan,
  ) {
    super();
    const $topic =
      typeof topicOrPlan === "string" ? constant(topicOrPlan) : topicOrPlan;
    const $pubsub = isExecutablePlan(pubsubOrPlan)
      ? pubsubOrPlan
      : constant(pubsubOrPlan);
    this.pubsubDep = this.addDependency($pubsub);
    this.topicDep = this.addDependency($topic);
  }

  execute(): never {
    throw new Error("ListenPlan cannot be executed, it can only be streamed");
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
  TPayloadPlan extends ExecutablePlan,
>(
  pubsubOrPlan:
    | ExecutablePlan<CrystalSubscriber<TTopics>>
    | CrystalSubscriber<TTopics>,
  topicOrPlan: ExecutablePlan<TTopic> | string,
  itemPlan: (itemPlan: __ItemPlan<TTopics[TTopic]>) => TPayloadPlan,
): ListenPlan<TTopics, TTopic, TPayloadPlan> {
  return new ListenPlan<TTopics, TTopic, TPayloadPlan>(
    pubsubOrPlan,
    topicOrPlan,
    itemPlan,
  );
}
