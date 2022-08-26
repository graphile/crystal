import type { CrystalSubscriber, Deferred } from "dataplanner";
import { defer } from "dataplanner";
import EventEmitter from "events";
import type { Notification, Pool, PoolClient } from "pg";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * This class provides helpers for Postgres' LISTEN/NOTIFY pub/sub
 * implementation. We aggregate all LISTEN/NOTIFY events so that we can supply
 * them all via a single pgClient. We grab and release this client from/to the
 * pool automatically. If the Postgres connection is interrupted then we'll
 * automatically reconnect and re-establish the LISTENs, however _events can be
 * lost_ when this happens, so you should be careful that Postgres connections
 * will not be prematurely terminated in general.
 */
export class PgSubscriber<
  TTopics extends { [key: string]: string } = { [key: string]: string },
> implements CrystalSubscriber<TTopics>
{
  private topics: { [topic in keyof TTopics]?: AsyncIterableIterator<any>[] } =
    {};
  private eventEmitter = new EventEmitter();
  private alive = true;

  constructor(private pool: Pool) {}

  private recordNotification = (notification: Notification): void => {
    this.eventEmitter.emit(notification.channel, notification.payload);
  };

  subscribe<TTopic extends keyof TTopics>(
    topic: TTopic,
  ): AsyncIterableIterator<TTopics[TTopic]> {
    if (!this.alive) {
      throw new Error("This PgSubscriber has been released.");
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const { eventEmitter, topics } = this;
    let waiting: Deferred<any> | null = null;
    const stack: any[] = [];

    function doFinally() {
      if (waiting) {
        const p = waiting;
        waiting = null;
        // TODO: Is this right?!
        p.reject(new Error("Terminated"));
      }
      eventEmitter.removeListener(topic as string, recv);
      // Every code path above this has to go through a `yield` and thus
      // `asyncIterableIterator` will definitely be defined.
      const idx = topics[topic]?.indexOf(asyncIterableIterator);
      if (idx != null && idx >= 0) {
        topics[topic]!.splice(idx, 1);
        if (topics[topic]!.length === 0) {
          delete topics[topic];
          that.unlisten(topic);
        }
      }
    }

    const asyncIterableIterator: AsyncIterableIterator<any> = {
      [Symbol.asyncIterator]() {
        return this;
      },
      async next() {
        if (stack.length) {
          return Promise.resolve(stack.shift()).then((value) => ({
            done: false,
            value,
          }));
        } else {
          if (waiting) {
            return waiting.then(() => this.next());
          } else {
            waiting = defer();
            const value = await waiting;
            return { done: false, value };
          }
        }
      },
      async return(value) {
        doFinally();
        return { done: true, value: value };
      },
      async throw() {
        doFinally();
        return { done: true, value: undefined };
      },
    };

    function recv(payload: any) {
      if (waiting) {
        const p = waiting;
        waiting = null;
        p.resolve(payload);
      } else {
        stack.push(payload);
      }
    }
    eventEmitter.addListener(topic as string, recv);

    if (!topics[topic]) {
      topics[topic] = [asyncIterableIterator];
      this.listen(topic);
    } else {
      topics[topic]!.push(asyncIterableIterator);
    }
    return asyncIterableIterator;
  }

  private listen<TTopic extends keyof TTopics>(_topic: TTopic) {
    this.sync();
  }

  private unlisten<TTopic extends keyof TTopics>(_topic: TTopic) {
    this.sync();
  }

  private subscribedTopics = new Set<string>();
  private sync() {
    this.chain(async () => {
      if (!this.alive) {
        return;
      }
      const client = await this.getClient();
      await this.syncWithClient(client);
    }).then(null, () => this.resetClient());
  }

  private async syncWithClient(client: PoolClient) {
    if (!this.alive) {
      throw new Error("PgSubscriber released; aborting syncWithClient");
    }
    const expectedTopics = Object.keys(this.topics);
    const topicsToAdd = expectedTopics.filter(
      (t) => !this.subscribedTopics.has(t),
    );
    const topicsToRemove = [...this.subscribedTopics.values()].filter(
      (t) => !expectedTopics.includes(t),
    );
    for (const topic of topicsToAdd) {
      await client.query(`LISTEN ${client.escapeIdentifier(topic)}`);
      this.subscribedTopics.add(topic);
    }
    for (const topic of topicsToRemove) {
      await client.query(`UNLISTEN ${client.escapeIdentifier(topic)}`);
      this.subscribedTopics.delete(topic);
    }
  }

  private resetClient() {
    this.chain(() => {
      if (!this.alive) {
        return;
      }
      const client = this.listeningClient;
      if (client) {
        client.off("notification", this.recordNotification);
        client.release();
        this.listeningClient = null;
        this.subscribedTopics.clear();
        if (this.listeningClientPromise) {
          throw new Error(
            "This should not occur (found listeningClientPromise in resetClient)",
          );
        }
        if (Object.keys(this.topics).length > 0) {
          // Trigger a new client to be fetched and have it sync.
          this.getClient().then(null, () => {
            // Must be released; ignore
          });
        }
      }
    });
  }

  private listeningClient: PoolClient | null = null;
  private listeningClientPromise: Promise<PoolClient> | null = null;
  private getClient(): Promise<PoolClient> {
    if (!this.alive) {
      return Promise.reject(new Error("Released; aborting getClient"));
    }
    if (this.listeningClient) {
      return Promise.resolve(this.listeningClient);
    } else {
      if (!this.listeningClientPromise) {
        const promise = (async () => {
          for (let attempts = 0; ; attempts++) {
            try {
              if (!this.alive) {
                return Promise.reject(
                  new Error("PgSubscriber released; aborting getClient"),
                );
              }
              const logError = (e: Error) => {
                console.error(`Error on listening client: ${e}`);
              };
              const client = await this.pool.connect();
              try {
                client.on("error", logError);
                client.on("notification", this.recordNotification);
                await this.syncWithClient(client);

                // All good; we can return this client finally!
                this.listeningClientPromise = null;
                this.listeningClient = client;
                client.off("error", logError);
                client.on("error", (e) => {
                  logError(e);
                  this.resetClient();
                });
                return client;
              } catch (e) {
                client.off("error", logError);
                client.off("notification", this.recordNotification);
                client.release();
                throw e;
              }
            } catch (e) {
              console.error(
                `Error with listening client during getClient (attempt ${
                  attempts + 1
                }): ${e}`,
              );
              // Exponential back-off (maximum 30 seconds)
              await sleep(Math.min(100 * Math.exp(attempts), 30000));
            }
          }
        })();
        promise.then(null, () => {
          /* ignore */
        });
        this.listeningClientPromise = promise;
        return promise;
      } else {
        return this.listeningClientPromise;
      }
    }
  }

  public release(): void {
    if (this.alive) {
      this.alive = false;
      for (const topic of Object.keys(this.topics)) {
        for (const asyncIterableIterator of this.topics[topic]!) {
          if (asyncIterableIterator.return) {
            asyncIterableIterator.return();
          } else if (asyncIterableIterator.throw) {
            asyncIterableIterator.throw(new Error("Released"));
          } else {
            console.error(
              `Could not return or throw from iterator for topic '${topic}'`,
            );
          }
        }
        delete this.topics[topic];
      }
      const unlistenAndRelease = async (client: PoolClient) => {
        try {
          for (const topic of this.subscribedTopics) {
            await client.query(`UNLISTEN ${client.escapeIdentifier(topic)}`);
            this.subscribedTopics.delete(topic);
          }
        } catch (e) {
          // ignore
        }
        client.release();
      };
      if (this.listeningClient) {
        unlistenAndRelease(this.listeningClient);
      } else if (this.listeningClientPromise) {
        this.listeningClientPromise.then(unlistenAndRelease, () => {
          /* ignore */
        });
      }
    }
  }

  // Avoid race conditions by chaining everything
  private promise: Promise<void> = Promise.resolve();
  private async chain(callback: () => void | Promise<void>) {
    this.promise = this.promise.then(callback, callback);
    return this.promise;
  }
}
