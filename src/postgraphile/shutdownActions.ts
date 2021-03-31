export type Action = () => void | Promise<void>;

export class ShutdownActions {
  private actions: Action[] = [];
  private didInvoke = false;

  add(action: Action): void {
    this.actions.push(action);
  }

  remove(action: Action): void {
    const index = this.actions.indexOf(action);
    if (index === -1) {
      throw Error('The specified shutdown action was not found.');
    }
    this.actions.splice(index, 1);
  }

  invoke(): Array<Promise<void> | void> {
    if (this.didInvoke) {
      throw new Error('release() has already been called.');
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
    await Promise.all(this.invoke());
  }
}
