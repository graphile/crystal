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

interface Node<KeyType, ValueType> {
  /** key */
  k: KeyType;
  /** value */
  v: ValueType;
  /** next */
  n: Node<KeyType, ValueType> | null;
  /** previous */
  p: Node<KeyType, ValueType> | null;
}

export interface LRUOptions<KeyType, ValueType> {
  maxLength: number;
  dispose?: (key: KeyType, value: ValueType) => void;
}

/**
 * An tiny LRU cache with maximum count, identical weighting and no expiration.
 */
export class LRU<KeyType = any, ValueType = any> {
  public length: number;
  /** max length */
  private m: number;
  /** head */
  private h: Node<KeyType, ValueType> | null;
  /** tail */
  private t: Node<KeyType, ValueType> | null;
  /** cache */
  private c: Map<KeyType, Node<KeyType, ValueType>>;
  /** dispose */
  private d: ((key: KeyType, value: ValueType) => void) | null;

  constructor({ maxLength, dispose }: LRUOptions<KeyType, ValueType>) {
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

    this.reset();
  }

  public reset() {
    const values = this.c.values();
    this.c.clear();
    this.h = null;
    this.t = null;
    this.length = 0;
    if (this.d) {
      for (const hit of values) {
        this.d(hit.k, hit.v);
      }
    }
  }

  public get(key: KeyType): ValueType | undefined {
    const hit = this.c.get(key);
    if (hit) {
      // HOIST
      if (hit !== this.h) {
        if (!this.h) {
          this.h = this.t = hit;
        } else {
          // Remove newHead from old position
          hit.p!.n = hit.n;
          if (hit.n) {
            hit.n.p = hit.p;
          } else {
            // It was the t, now hit.prev is the t
            this.t = hit.p;
          }
          // Add hit at top
          hit.n = this.h;
          this.h!.p = hit;
          this.h = hit;
          hit.p = null;
        }
      }

      // RETURN
      return hit.v;
    }
    return undefined;
  }

  public set(key: KeyType, value: ValueType): void {
    const hit = this.c.get(key);
    if (hit) {
      hit.v = value;
    } else {
      const newHead: Node<KeyType, ValueType> = {
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
  private a(newHead: Node<KeyType, ValueType>) {
    if (!this.h) {
      this.h = this.t = newHead;
      this.length = 1;
      return;
    }
    this.h.p = newHead;
    newHead.n = this.h;
    this.h = newHead;
    if (this.length === this.m) {
      // Remove the t
      const oldTail = this.t!;
      this.c.delete(oldTail.k);
      this.t = oldTail.p;
      this.t!.n = null;
      if (this.d) {
        this.d(oldTail.k, oldTail.v);
      }
    } else {
      if (this.length === 0) {
        this.t = newHead;
      }
      this.length++;
    }
  }
}
export default LRU;
