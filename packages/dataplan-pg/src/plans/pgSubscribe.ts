import type {
  CrystalResultStreamList,
  CrystalValuesList,
  StreamablePlan,
} from "graphile-crystal";
import { ExecutablePlan } from "graphile-crystal";
import type { PromiseOrDirect } from "graphile-crystal/src/interfaces";

import type { PgExecutor } from "../executor";

interface PgSubscribePlanOptions<TExecutor extends PgExecutor> {
  /**
   * Via which database are we subscribing?
   */
  executor: TExecutor;

  /**
   * What's the topic we're subscribing to?
   */
  topicPlan: ExecutablePlan<string>;
}

export class PgSubscribePlan<TExecutor extends PgExecutor, TPayload extends any>
  extends ExecutablePlan<TPayload>
  implements StreamablePlan<TPayload>
{
  /**
   * Via which database are we subscribing?
   */
  private executor: TExecutor;

  /**
   * The id for the PostgreSQL context plan.
   */
  private contextId: number;

  /**
   * The plan that will tell us which topic we're subscribing to.
   */
  private topicDepId: number;

  constructor(options: PgSubscribePlanOptions<TExecutor>) {
    super();
    this.executor = options.executor;
    this.contextId = this.addDependency(this.executor.context());
    this.topicDepId = this.addDependency(options.topicPlan);
  }

  execute(): never {
    throw new Error(
      "PgSubscribePlan cannot be executed, it can only be streamed",
    );
  }

  stream(
    values: CrystalValuesList<[any, string]>,
  ): PromiseOrDirect<CrystalResultStreamList<TPayload>> {
    return this.executor.subscribe(
      values.map((value) => ({
        context: value[this.contextId],
        topic: value[this.topicDepId],
      })),
    );
  }
}

export function pgSubscribe<TExecutor extends PgExecutor, TPayload extends any>(
  options: PgSubscribePlanOptions<TExecutor>,
): PgSubscribePlan<TExecutor, TPayload> {
  return new PgSubscribePlan<TExecutor, TPayload>(options);
}
