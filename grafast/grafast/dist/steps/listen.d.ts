import type { ExecutionDetails, GrafastResultStreamList, GrafastSubscriber } from "../interfaces.js";
import { Step } from "../step.js";
import type { __ItemStep } from "./__item.js";
/**
 * Subscribes to the given `pubsubOrPlan` to get realtime updates on a given
 * topic (`topicOrPlan`), mapping the resulting event via the `itemPlan`
 * callback.
 */
export declare class ListenStep<TTopics extends {
    [topic: string]: any;
}, TTopic extends keyof TTopics, TPayloadStep extends Step> extends Step<TTopics[TTopic][]> {
    itemPlan: (itemPlan: __ItemStep<TTopics[TTopic]>) => TPayloadStep;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    /**
     * The id for the PostgreSQL context plan.
     */
    private pubsubDep;
    /**
     * The plan that will tell us which topic we're subscribing to.
     */
    private topicDep;
    constructor(pubsubOrPlan: Step<GrafastSubscriber<TTopics> | null> | GrafastSubscriber<TTopics> | null, topicOrPlan: Step<TTopic> | string, itemPlan?: (itemPlan: __ItemStep<TTopics[TTopic]>) => TPayloadStep);
    execute({ indexMap, values, stream, }: ExecutionDetails<readonly [GrafastSubscriber<TTopics>, TTopic]>): GrafastResultStreamList<TTopics[TTopic]>;
}
/**
 * Subscribes to the given `pubsubOrPlan` to get realtime updates on a given
 * topic (`topicOrPlan`), mapping the resulting event via the `itemPlan`
 * callback.
 */
export declare function listen<TTopics extends {
    [topic: string]: any;
}, TTopic extends keyof TTopics, TPayloadStep extends Step>(pubsubOrPlan: Step<GrafastSubscriber<TTopics> | null> | GrafastSubscriber<TTopics> | null, topicOrPlan: Step<TTopic> | string, itemPlan?: (itemPlan: __ItemStep<TTopics[TTopic]>) => TPayloadStep): ListenStep<TTopics, TTopic, TPayloadStep>;
//# sourceMappingURL=listen.d.ts.map