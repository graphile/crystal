export type Action = () => void | Promise<void>;

/**
 * This class tracks actions that must be taken when PostGraphile is shut down
 * (released) in order to make sure that all the resources it has consumed has
 * been cleaned up.
 *
 * Since PostGraphile is extensible via plugins and plugins may have their own
 * shutdown actions we use this generic system to handle them all. If your
 * plugin sets up something that would keep running after PostGraphile is
 * `.release()`d (such as a timer, interval, network connection, filesystem
 * monitoring, or similar activity) then you should register an action via
 * `shutdownActions` to clean it up.
 * 
 * This class currently has "experimental" status, it may have breaking
 * changes in future semver minor releases.
 */
export class ShutdownActions {
  private actions: Action[] = [];
  private didInvoke = false;

  /**
   * Register a function to be called when PostGraphile is released.
   */
  add(action: Action): void {
    if (this.didInvoke) {
      console.warn(
        "WARNING: shutdown action added after shutdown actions were invoked; we'll call it now but your program may have already moved on.",
      );
      setImmediate(() => {
        Promise.resolve(action()).catch(e => {
          console.error('Error occurred calling shutdown action after invoke:');
          console.error(e);
        });
      });
    } else {
      this.actions.push(action);
    }
  }

  /**
   * If your action is no longer relevant (for example it has completed, or it
   * was only relevant whilst in a particular mode) then be sure to remove it so
   * it won't be called when PostGraphile is released.
   */
  remove(action: Action): void {
    const index = this.actions.indexOf(action);
    if (index === -1) {
      throw new Error('The specified shutdown action was not found.');
    }
    this.actions.splice(index, 1);
  }

  /**
   * Calls the release actions in parallel and returns the array of resulting
   * promises/results. Will not throw unless the shutdown actions have already
   * been invoked.
   */
  invoke(): Array<Promise<void> | void> {
    if (this.didInvoke) {
      throw new Error('release() has already been called.');
    }
    this.didInvoke = true;
    const actions = this.actions;
    this.actions = [];
    // Invoke in parallel.
    return actions.map(fn => {
      // Ensure that all actions are called, even if a previous action throws an
      // error.
      try {
        return fn();
      } catch (e) {
        return Promise.reject(e);
      }
    });
  }

  /**
   * Calls all the release actions and resolves when complete (rejecting if an
   * error occurred).
   */
  async invokeAll(): Promise<void> {
    // TODO:v5: This would be better if it used `Promise.allSettled()` but we
    // can't use it yet.
    await Promise.all(this.invoke());
  }
}
