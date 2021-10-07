import type {
  CrystalResultStreamList,
  CrystalSubscriber,
  CrystalValuesList,
} from "../interfaces";
import type { StreamablePlan } from "../plan";
import { ExecutablePlan, isExecutablePlan } from "../plan";
import { constant } from "./constant";

export class SubscribePlan<
    TTopics extends { [topic: string]: any },
    TTopic extends keyof TTopics,
  >
  extends ExecutablePlan<TTopics[TTopic]>
  implements StreamablePlan<TTopics[TTopic]>
{
  /**
   * The id for the PostgreSQL context plan.
   */
  private pubsubDepId: number;

  /**
   * The plan that will tell us which topic we're subscribing to.
   */
  private topicDepId: number;

  constructor(
    pubsubOrPlan:
      | ExecutablePlan<CrystalSubscriber<TTopics>>
      | CrystalSubscriber<TTopics>,
    topicOrPlan: ExecutablePlan<TTopic> | string,
  ) {
    super();
    const $topic =
      typeof topicOrPlan === "string" ? constant(topicOrPlan) : topicOrPlan;
    const $pubsub = isExecutablePlan(pubsubOrPlan)
      ? pubsubOrPlan
      : constant(pubsubOrPlan);
    this.pubsubDepId = this.addDependency($pubsub);
    this.topicDepId = this.addDependency($topic);
  }

  execute(): never {
    throw new Error(
      "SubscribePlan cannot be executed, it can only be streamed",
    );
  }

  stream(
    values: CrystalValuesList<[CrystalSubscriber<TTopics>, TTopic]>,
  ): CrystalResultStreamList<TTopics[TTopic]> {
    return values.map((value) => {
      const pubsub = value[this.pubsubDepId as 0];
      const topic = value[this.topicDepId as 1];
      return pubsub.subscribe(topic);
    });
  }
}

export function subscribe<
  TTopics extends { [topic: string]: any },
  TTopic extends keyof TTopics,
>(
  pubsubOrPlan:
    | ExecutablePlan<CrystalSubscriber<TTopics>>
    | CrystalSubscriber<TTopics>,
  topicOrPlan: ExecutablePlan<TTopic> | string,
): SubscribePlan<TTopics, TTopic> {
  return new SubscribePlan<TTopics, TTopic>(pubsubOrPlan, topicOrPlan);
}
