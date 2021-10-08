import EventEmitter from "events";
import type { CrystalSubscriber, Deferred } from "graphile-crystal";
import { defer } from "graphile-crystal";
import type { Notification, Pool, PoolClient } from "pg";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    const asyncIterableIterator = (async function* () {
      let waiting: Deferred<any> | null = null;
      const stack: any[] = [];
      function recv(payload: any) {
        if (waiting) {
          waiting.resolve(payload);
          waiting = null;
        } else {
          stack.push(payload);
        }
      }
      eventEmitter.addListener(topic as string, recv);
      try {
        while (true) {
          if (stack.length) {
            yield stack.shift();
          } else {
            waiting = defer();
            yield await waiting;
          }
        }
      } finally {
        eventEmitter.removeListener(topic as string, recv);
        // Every code path above this has to go through a `yield` and thus
        // `asyncIterableIterator` will definitely be defined.
        const idx = topics[topic]?.indexOf(asyncIterableIterator!);
        if (idx != null && idx >= 0) {
          topics[topic]!.splice(idx, 1);
          if (topics[topic]!.length === 0) {
            delete topics[topic];
            that.unlisten(topic);
          }
        }
      }
    })();
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
    }).catch(() => this.resetClient());
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
          this.getClient().catch(() => {
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
              const client = await this.pool.connect();
              try {
                const logError = (e: Error) => {
                  console.error(`Error on listening client: ${e}`);
                };
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
        promise.catch(() => {
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
