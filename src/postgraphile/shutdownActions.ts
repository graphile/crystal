export type Action = () => void | Promise<void>;

export class ShutdownActions {
  private actions: Action[] = [];
  private didInvoke = false;

  add(action: Action): void {
    if (this.didInvoke) {
      console.warn("WARNING: shutdown action added after shutdown actions were invoked; we'll call it now but your program may have already moved on.");
      setImmediate(() => {
        action().catch(e => {
          console.error("Error occurred calling shutdown action after invoke:");
          console.error(e);
        });
      });
    } else {
      this.actions.push(action);
    }
  }

  remove(action: Action): void {
    const index = this.actions.indexOf(action);
    if (index === -1) {
      throw new Error('The specified shutdown action was not found.');
    }
    this.actions.splice(index, 1);
  }

  invoke(): Array<Promise<void> | void> {
    if (this.didInvoke) {
      throw new Error('release() has already been called.');
    }
    this.didInvoke = true;
    const actions = this.actions;
    this.actions = [];
    // Invoke in parallel.
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
    // TODO:v5: This would be better if it used `Promise.allSettled()` but we can't
    // use it yet.
    await Promise.all(this.invoke());
  }
}
