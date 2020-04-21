interface Node<KeyType, ValueType> {
  key: KeyType;
  value: ValueType;
  next: Node<KeyType, ValueType> | null;
  prev: Node<KeyType, ValueType> | null;
}

interface LRUOptions<KeyType, ValueType> {
  maxLength: number;
  dispose?: (key: KeyType, value: ValueType) => void;
}

/**
 * An tiny LRU cache with maximum count, identical weighting and no expiration.
 */
export default class LRU<KeyType = any, ValueType = any> {
  public length: number;
  private _maxLength: number;
  private _head: Node<KeyType, ValueType> | null;
  private _tail: Node<KeyType, ValueType> | null;
  private _cache: Map<KeyType, Node<KeyType, ValueType>>;
  private _dispose: ((key: KeyType, value: ValueType) => void) | null;

  constructor({ maxLength, dispose }: LRUOptions<KeyType, ValueType>) {
    if (maxLength < 2) {
      throw new Error("Max length must be >= 2");
    }
    if (parseInt(String(maxLength), 10) !== maxLength) {
      throw new Error("Max length must be an integer");
    }
    this._maxLength = maxLength;

    this._dispose = dispose || null;
    this._cache = new Map();

    this.reset();
  }

  public reset() {
    const values = this._cache.values();
    this._cache.clear();
    this._head = null;
    this._tail = null;
    this.length = 0;
    if (this._dispose) {
      for (const hit of values) {
        this._dispose(hit.key, hit.value);
      }
    }
  }

  public get(key: KeyType): ValueType | undefined {
    const hit = this._cache.get(key);
    if (hit) {
      this._hoist(hit);
      return hit.value;
    }
    return undefined;
  }

  public set(key: KeyType, value: ValueType): void {
    const hit = this._cache.get(key);
    if (hit) {
      hit.value = value;
    } else {
      const newHead: Node<KeyType, ValueType> = {
        key,
        value,
        next: null,
        prev: null,
      };
      this._cache.set(key, newHead);
      this._add(newHead);
    }
  }

  private _hoist(newHead: Node<KeyType, ValueType>) {
    if (newHead === this._head) {
      return;
    }
    if (!this._head) {
      this._head = this._tail = newHead;
      return;
    }
    // Remove newHead from old position
    newHead.prev!.next = newHead.next;
    if (newHead.next) {
      newHead.next.prev = newHead.prev;
    } else {
      // It was the _tail, now newHead.prev is the _tail
      this._tail = newHead.prev;
    }
    // Add newHead at top
    newHead.next = this._head;
    this._head.prev = newHead;
    this._head = newHead;
    newHead.prev = null;
  }

  private _add(newHead: Node<KeyType, ValueType>) {
    if (!this._head) {
      this._head = this._tail = newHead;
      this.length = 1;
      return;
    }
    this._head.prev = newHead;
    newHead.next = this._head;
    this._head = newHead;
    if (this.length === this._maxLength) {
      // Remove the _tail
      const oldTail = this._tail!;
      this._cache.delete(oldTail.key);
      this._tail = oldTail.prev;
      this._tail!.next = null;
      if (this._dispose) {
        this._dispose(oldTail.key, oldTail.value);
      }
    } else {
      if (this.length === 0) {
        this._tail = newHead;
      }
      this.length++;
    }
  }
}
