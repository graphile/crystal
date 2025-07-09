"use strict";
/*
 * I know this is ridiculous, but I've seen in the past that the length of keys
 * in objects can have a marginal impact on performance. @graphile/lru is
 * obsessively optimized, so we'll take every smidging of performance we can
 * get. As such, all non-public keys are single letters. To try and keep things
 * from being too confusing, we try not to use the same letter in two places.
 * Letters:
 *
 * Letter | Place | longName
 * ------ | ----- | --------
 * a      | LRU   | add
 * c      | LRU   | cache
 * d      | LRU   | dispose
 * h      | LRU   | head
 * k      | Node  | key
 * m      | LRU   | maxLength
 * n      | Node  | next
 * p      | Node  | previous
 * r      | LRU   | raise (aka "hoist")
 * t      | LRU   | tail
 * v      | Node  | value
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LRU = void 0;
/** An optimized get to use before the LRU saturates */
function quickGet(key) {
    return this.c.get(key)?.v;
}
/**
 * An tiny LRU cache with maximum count, identical weighting and no expiration.
 */
class LRU {
    constructor({ maxLength, dispose }) {
        if (maxLength < 2) {
            throw new Error("Max length must be >= 2");
        }
        if (parseInt(String(maxLength), 10) !== maxLength) {
            throw new Error("Max length must be an integer");
        }
        this.length = 0;
        this.m = maxLength;
        this.h = null;
        this.t = null;
        this.c = new Map();
        this.d = dispose || null;
        this.s = false;
        this.get = quickGet;
        this.reset();
    }
    reset() {
        const values = this.c.values();
        this.c.clear();
        this.h = null;
        this.t = null;
        this.length = 0;
        if (this.d !== null) {
            for (const hit of values) {
                this.d(hit.k, hit.v);
            }
        }
    }
    get(key) {
        const hit = this.c.get(key);
        if (hit === undefined) {
            return undefined;
        }
        // HOIST
        if (this.h === null) {
            this.h = this.t = hit;
        }
        else if (hit !== this.h) {
            // Remove newHead from old position
            hit.p.n = hit.n;
            if (hit.n !== null) {
                hit.n.p = hit.p;
            }
            else {
                // It was the t, now hit.prev is the t
                this.t = hit.p;
            }
            // Add hit at top
            hit.n = this.h;
            this.h.p = hit;
            this.h = hit;
            hit.p = null;
        }
        // RETURN
        return hit.v;
    }
    set(key, value) {
        const hit = this.c.get(key);
        if (hit !== undefined) {
            hit.v = value;
        }
        else {
            const newHead = {
                k: key,
                v: value,
                n: null,
                p: null,
            };
            this.c.set(key, newHead);
            this.a(newHead);
        }
    }
    /** add */
    a(newHead) {
        if (this.h === null) {
            this.h = this.t = newHead;
            this.length = 1;
            return;
        }
        this.h.p = newHead;
        newHead.n = this.h;
        this.h = newHead;
        if (this.s) {
            // Remove the t
            const oldTail = this.t;
            this.c.delete(oldTail.k);
            this.t = oldTail.p;
            this.t.n = null;
            if (this.d !== null) {
                this.d(oldTail.k, oldTail.v);
            }
        }
        else {
            if (this.length === 0) {
                this.t = newHead;
            }
            this.length++;
            if (this.length === this.m) {
                this.s = true;
                this.get = LRU.prototype.get;
            }
        }
    }
}
exports.LRU = LRU;
exports.default = LRU;
//# sourceMappingURL=index.js.map