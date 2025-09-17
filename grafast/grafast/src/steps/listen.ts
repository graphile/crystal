import { isDev } from "../dev.js";
import { SafeError } from "../index.js";
import type {
  ExecutionDetails,
  GrafastResultStreamList,
  GrafastSubscriber,
} from "../interfaces.js";
import { isExecutableStep, Step } from "../step.js";
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
  TPayloadStep extends Step,
> extends Step<TTopics[TTopic][]> {
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

  private initialEventDep: number | null = null;

  constructor(
    pubsubOrPlan:
      | Step<GrafastSubscriber<TTopics> | null>
      | GrafastSubscriber<TTopics>
      | null,
    topicOrPlan: Step<TTopic> | string,
    public itemPlan: (itemPlan: __ItemStep<TTopics[TTopic]>) => TPayloadStep = (
      $item,
    ) => $item as any,
    $initialEvent?: Step<TTopics[TTopic]>,
  ) {
    super();
    const $topic =
      typeof topicOrPlan === "string" ? constant(topicOrPlan) : topicOrPlan;
    const $pubsub = isExecutableStep(pubsubOrPlan)
      ? pubsubOrPlan
      : constant(pubsubOrPlan, false);
    this.pubsubDep = this.addDependency($pubsub);
    this.topicDep = this.addDependency($topic);
    if ($initialEvent) {
      this.initialEventDep = this.addDependency($initialEvent);
    }
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
    const initialEventValue =
      this.initialEventDep !== null ? values[this.initialEventDep] : null;
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
      const stream = pubsub.subscribe(topic);
      const initialEvent = initialEventValue?.at(i);
      if (initialEvent === undefined) {
        return stream;
      } else {
        return Promise.resolve(stream).then((stream) =>
          withInitialValue(initialEvent as any, stream),
        );
      }
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
  TPayloadStep extends Step,
>(
  pubsubOrPlan:
    | Step<GrafastSubscriber<TTopics> | null>
    | GrafastSubscriber<TTopics>
    | null,
  topicOrPlan: Step<TTopic> | string,
  itemPlan?: (itemPlan: __ItemStep<TTopics[TTopic]>) => TPayloadStep,
  $initialEvent?: Step<TTopics[TTopic]>,
): ListenStep<TTopics, TTopic, TPayloadStep> {
  return new ListenStep<TTopics, TTopic, TPayloadStep>(
    pubsubOrPlan,
    topicOrPlan,
    itemPlan,
    $initialEvent,
  );
}

const DONE = Object.freeze({ value: undefined as any, done: true });

const withInitialValue = <T>(
  initialVal: T,
  source: AsyncIterable<T>,
): AsyncIterable<T> => ({
  [Symbol.asyncIterator](): AsyncIterator<T> {
    const sourceIterator = source[Symbol.asyncIterator]();
    let first = true;
    let done: IteratorResult<T> | null = null;

    return {
      async next(): Promise<IteratorResult<T>> {
        if (done) return done;
        if (first) {
          first = false;
          return { value: initialVal, done: false };
        }
        const res = await sourceIterator.next();
        if (res.done) done = res;
        return res;
      },

      async return(value?: unknown): Promise<IteratorResult<T>> {
        done ??= { value: value as T, done: true };
        if (typeof sourceIterator.return === "function") {
          try {
            await sourceIterator.return();
          } catch {
            /* noop */
          }
        }
        return done;
      },

      async throw(err?: unknown): Promise<IteratorResult<T>> {
        done ??= DONE;
        if (typeof sourceIterator.throw === "function") {
          return sourceIterator.throw(err);
        }
        throw err;
      },
    };
  },
});
