export type Action = () => void | Promise<void>;

export class ShutdownActions {
  private readonly actions: Action[] = [];
  private didInvoke = false;

  add(action: () => void | Promise<void>): void {
    this.actions.push(action);
  }

  invoke(): Array<Promise<void> | void> {
    if (this.didInvoke) {
      throw new Error("release() has already been called.");
    }
    this.didInvoke = true;
    // Invoke in parallel.
    const actions = this.actions;
    this.actions = [];
    return actions.map(fn => {
      // Ensure that all actions are called, even if a previous action throws an error
      try {
        return fn();
      } catch (e) {
        return Promise.reject(e);
      }
    });
  }

  async invokeAll(): Promise<void> {
    // This would be better if it used `Promise.allSettled()` but we can't use
    // it yet.
    for (const promise of this.invoke()) {
      if (promise) {
        try {
          await promise;
        } catch (e) {} // eslint-disable-line no-empty
      }
    }
  }
}
