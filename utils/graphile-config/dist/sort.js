"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortWithBeforeAfterProvides = sortWithBeforeAfterProvides;
function sortWithBeforeAfterProvides(rawList, idKey) {
    const list = rawList.map((thing) => {
        const before = [...(thing.before ?? [])];
        const after = [...(thing.after ?? [])];
        const provides = [...(thing.provides ?? [])];
        if (!provides.includes(thing[idKey])) {
            provides.push(thing[idKey]);
        }
        return { thing, before, after, provides };
    });
    // Figure out all the possible provides values:
    const validProvides = new Set();
    for (const { provides } of list) {
        for (const provide of provides) {
            validProvides.add(provide);
        }
    }
    // And create fake providers for any values that don't already have one, to
    // ensure correct ordering
    for (const { after, before } of list) {
        for (const val of [...after, ...before]) {
            if (!validProvides.has(val)) {
                list.push({
                    thing: Symbol(val),
                    before: [],
                    after: [],
                    provides: [val],
                });
                validProvides.add(val);
            }
        }
    }
    // "before" and "after" are very similar, lets simplify them into one
    // concept by converting all the "befores" into "afters" on their targets.
    for (const { thing, before } of list) {
        if (typeof thing === "symbol") {
            continue;
        }
        const { [idKey]: id } = thing;
        if (before.length) {
            const previousBefore = before.splice(0, before.length);
            for (const { thing: otherThing, provides: otherProvides, after: otherAfter, } of list) {
                if (otherThing !== thing &&
                    previousBefore.some((beforeValue) => otherProvides.includes(beforeValue))) {
                    otherAfter.push(id);
                }
            }
        }
    }
    const final = [];
    const remaining = [...list];
    // Now we can iteratively add items following the rule that there must be
    // no pending items that "provides" anything that the listEntry must come
    // "after".
    for (let loops = 0; loops < 10000; loops++) {
        let changes = 0;
        if (remaining.length === 0) {
            // We're done!
            break;
        }
        for (let i = 0; i < remaining.length; i++) {
            const listEntry = remaining[i];
            if (!listEntry) {
                continue;
            }
            const { thing, after } = listEntry;
            const dependsOnRemaining = remaining.some(({ thing: otherThing, provides: otherProvides }) => otherThing !== thing &&
                otherProvides.some((otherHookProvide) => after.includes(otherHookProvide)));
            if (!dependsOnRemaining) {
                changes++;
                remaining.splice(i, 1);
                if (typeof thing !== "symbol") {
                    final.push(thing);
                }
                i--;
            }
        }
        if (changes === 0) {
            throw new Error(`Infinite loop in dependencies detected; remaining items:\n  ${remaining
                .map((r) => `${typeof r.thing === "symbol"
                ? `FakeProvider<${r.thing.description}>`
                : r.thing[idKey]} (after: ${r.after}; provides: ${r.provides})`)
                .join("\n  ")}`);
        }
    }
    if (final.length !== rawList.length) {
        throw new Error(`Expected the same number of list entries after sorting (${final.length} != ${rawList.length})`);
    }
    return final;
}
//# sourceMappingURL=sort.js.map