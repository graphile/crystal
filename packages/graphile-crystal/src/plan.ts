type Value = any;

export class Plan {
  private nextGroup: Value[] | null;
  private finalized: boolean;

  constructor() {
    this.nextGroup = null;
    this.finalized = false;
  }

  executeWith(value: Value) {
    if (!this.finalized) {
      throw new Error("Cannot execute non-finalized plan");
    }
    /* TODO */
    if (this.nextGroup) {
      this.nextGroup.push(value);
      throw new Error("TODO");
    } else {
      throw new Error("TODO");
    }
  }

  /**
   * In derivative plans, you can sub out a finalized plan for a different plan
   * to enable cross-query caching/etc.
   */
  finalize() {
    if (this.finalized) {
      throw new Error("Already finalized");
    }
    this.finalized = true;
    return this;
  }
}
