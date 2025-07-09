"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenStep = void 0;
exports.listen = listen;
const dev_js_1 = require("../dev.js");
const index_js_1 = require("../index.js");
const step_js_1 = require("../step.js");
const constant_js_1 = require("./constant.js");
/**
 * Subscribes to the given `pubsubOrPlan` to get realtime updates on a given
 * topic (`topicOrPlan`), mapping the resulting event via the `itemPlan`
 * callback.
 */
class ListenStep extends step_js_1.Step {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "ListenStep",
    }; }
    constructor(pubsubOrPlan, topicOrPlan, itemPlan = ($item) => $item) {
        super();
        this.itemPlan = itemPlan;
        this.isSyncAndSafe = true;
        const $topic = typeof topicOrPlan === "string" ? (0, constant_js_1.constant)(topicOrPlan) : topicOrPlan;
        const $pubsub = (0, step_js_1.isExecutableStep)(pubsubOrPlan)
            ? pubsubOrPlan
            : (0, constant_js_1.constant)(pubsubOrPlan, false);
        this.pubsubDep = this.addDependency($pubsub);
        this.topicDep = this.addDependency($topic);
    }
    execute({ indexMap, values, stream, }) {
        if (!stream) {
            throw new Error("ListenStep must be streamed, never merely executed");
        }
        const pubsubValue = values[this.pubsubDep];
        const topicValue = values[this.topicDep];
        return indexMap((i) => {
            const pubsub = pubsubValue.at(i);
            if (!pubsub) {
                throw new index_js_1.SafeError("Subscription not supported", dev_js_1.isDev
                    ? {
                        hint: `${this.dependencies[this.pubsubDep]} did not provide a GrafastSubscriber; perhaps you forgot to add the relevant property to context?`,
                    }
                    : {});
            }
            const topic = topicValue.at(i);
            return pubsub.subscribe(topic);
        });
    }
}
exports.ListenStep = ListenStep;
/**
 * Subscribes to the given `pubsubOrPlan` to get realtime updates on a given
 * topic (`topicOrPlan`), mapping the resulting event via the `itemPlan`
 * callback.
 */
function listen(pubsubOrPlan, topicOrPlan, itemPlan) {
    return new ListenStep(pubsubOrPlan, topicOrPlan, itemPlan);
}
//# sourceMappingURL=listen.js.map