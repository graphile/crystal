/* tslint:disable no-console */
import { Plugin } from "postgraphile-core";
import * as WebSocket from "ws";
import subscribeToLogicalDecoding, {
  Announcement,
  LDSubscription,
} from "@graphile/lds";
type SubscriptionReleaser = () => void;
type SubscriptionCallback = () => void;
type Predicate = (record: any) => boolean;

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
function generateRandomString(length: number): string {
  let str = "";
  for (let i = 0; i < length; i++) {
    str += LETTERS[Math.floor(Math.random() * LETTERS.length)];
  }
  return str;
}

export class LDSLiveSource {
  public readonly slotName: string | null;
  private lds: LDSubscription | null;
  private url: string | null;
  private connectionString: string | null;

  private reconnecting: boolean;
  private live: boolean;
  private subscriptions: {
    [topic: string]: Array<[SubscriptionCallback, Predicate | void]>;
  };
  private ws: WebSocket | null;
  private sleepDuration?: number;
  private tablePattern?: string;

  /**
   * @param url - If not specified, we'll spawn our own LDS listener
   */
  constructor(options: Options) {
    const { ldsURL, connectionString, sleepDuration, tablePattern } = options;
    if (!ldsURL && !connectionString) {
      throw new Error(
        "No LDS URL or connectionString was passed to LDSLiveSource; this likely means that you don't have `ownerConnectionString` specified in the PostGraphile library call."
      );
    }
    this.url = ldsURL || null;
    this.connectionString = connectionString || null;
    this.sleepDuration = sleepDuration;
    this.tablePattern = tablePattern;

    this.lds = null;
    this.slotName = this.url ? null : generateRandomString(30);
    this.ws = null;
    this.reconnecting = false;
    this.live = true;
    this.subscriptions = {};
  }

  public async init() {
    if (this.url) {
      await this.connect();
    } else {
      if (!this.connectionString) {
        throw new Error("No PG connection string given");
      }
      if (!this.slotName) {
        throw new Error("this.slotName is blank");
      }
      this.lds = await subscribeToLogicalDecoding(
        this.connectionString,
        this.handleAnnouncement,
        {
          slotName: this.slotName,
          temporary: true,
          sleepDuration: this.sleepDuration,
          tablePattern: this.tablePattern,
        }
      );
    }
  }

  public subscribeCollection(
    callback: () => void,
    collectionIdentifier: any,
    predicate?: Predicate
  ): SubscriptionReleaser | null {
    return this.sub(
      JSON.stringify([
        collectionIdentifier.namespaceName,
        collectionIdentifier.name,
      ]),
      callback,
      predicate
    );
  }

  public subscribeRecord(
    callback: () => void,
    collectionIdentifier: any,
    recordIdentifier: any
  ): SubscriptionReleaser | null {
    return this.sub(
      JSON.stringify([
        collectionIdentifier.namespaceName,
        collectionIdentifier.name,
        recordIdentifier,
      ]),
      callback
    );
  }

  public async close() {
    if (!this.live) {
      return;
    }
    this.live = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.lds) {
      await this.lds.close();
      this.lds = null;
    }
  }

  private connect() {
    if (!this.url) {
      throw new Error("No connection URL provided");
    }
    if (!this.url.match(/^wss?:\/\//)) {
      throw new Error(
        `Invalid URL, must be a websocket ws:// or wss:// URL, you passed '${
          this.url
        }'`
      );
    }
    this.ws = new WebSocket(this.url);
    this.ws.on("error", err => {
      console.error("Websocket error: ", err.message);
      this.reconnect();
    });
    this.ws.on("open", () => {
      // Resubscribe
      for (const topic of Object.keys(this.subscriptions)) {
        if (this.subscriptions[topic] && this.subscriptions[topic].length) {
          this.ws!.send("SUB " + topic);
        }
      }
    });
    this.ws.on("message", this.handleMessage);
    this.ws.on("close", () => {
      if (this.live) {
        this.reconnect();
      }
    });
    // Even if the first connection fails, we'll keep trying.
    return Promise.resolve();
  }

  private reconnect() {
    if (this.reconnecting) {
      return;
    }
    this.reconnecting = true;
    setTimeout(() => {
      this.reconnecting = false;
      this.connect();
    }, 1000);
  }

  private sub(
    topic: string,
    cb: SubscriptionCallback,
    predicate?: Predicate | void
  ) {
    if (!this.live) {
      return null;
    }
    const entry: [SubscriptionCallback, Predicate | void] = [cb, predicate];
    if (!this.subscriptions[topic]) {
      this.subscriptions[topic] = [];
    }
    const newLength = this.subscriptions[topic].push(entry);
    if (this.ws && newLength === 1) {
      this.ws.send("SUB " + topic);
    }

    let done = false;
    return () => {
      if (done) {
        console.warn("Double release?!");
        return;
      }
      done = true;
      const i = this.subscriptions[topic].indexOf(entry);
      this.subscriptions[topic].splice(i, 1);
      if (this.subscriptions[topic].length === 0) {
        // Solve potential memory leak
        delete this.subscriptions[topic];

        if (this.ws) {
          this.ws.send("UNSUB " + topic);
        }
      }
    };
  }

  private announce(topic: string, dataOrKey: any) {
    const subs = this.subscriptions[topic];
    if (subs) {
      subs.forEach(([callback, predicate]) => {
        if (predicate && !predicate(dataOrKey)) {
          return;
        }
        callback();
      });
    }
  }

  private handleAnnouncement = (announcement: Announcement) => {
    switch (announcement._) {
      case "insertC": {
        const { schema, table, data } = announcement;
        const topic = JSON.stringify([schema, table]);
        this.announce(topic, data);
        return;
      }
      case "updateC": {
        const { schema, table, data } = announcement;
        const topic = JSON.stringify([schema, table]);
        this.announce(topic, data);
        return;
      }
      case "update": {
        const { schema, table, keys, data } = announcement;
        const topic = JSON.stringify([schema, table, keys]);
        this.announce(topic, data);
        return;
      }
      case "delete": {
        const { schema, table, keys } = announcement;
        const topic = JSON.stringify([schema, table, keys]);
        this.announce(topic, keys);
        return;
      }
      default: {
        console.warn(
          "Unhandled announcement type: ",
          // @ts-ignore
          announcement && announcement._
        );
      }
    }
  };

  private handleMessage = (message: WebSocket.Data) => {
    try {
      // @ts-ignore Buffer, string, whatever -> toString("utf8") is safe.
      const messageString = message.toString("utf8");
      const payload = JSON.parse(messageString);
      switch (payload._) {
        case "insertC":
        case "updateC":
        case "update":
        case "delete":
          return this.handleAnnouncement(payload);
        case "ACK":
          // Connected, no action necessary.
          return;
        case "KA":
          // Keep alive, no action necessary.
          return;
        default:
          console.warn("Unhandled message:", payload);
      }
    } catch (e) {
      console.error(
        "Error occurred when processing message,",
        message,
        ":",
        e.message
      );
    }
  };
}

interface Options {
  ldsURL?: string;
  connectionString?: string;
  sleepDuration?: number;
  /*
   * Not valid when used with `ldsUrl`
   */
  tablePattern?: string;
}

async function makeLDSLiveSource(options: Options): Promise<LDSLiveSource> {
  const ldsLiveSource = new LDSLiveSource(options);
  await ldsLiveSource.init();
  return ldsLiveSource;
}

function getSafeNumber(str: string | undefined): number | undefined {
  if (str) {
    const n = parseInt(str, 10);
    if (n && isFinite(n) && n > 0) {
      return n;
    }
  }
  return undefined;
}

const PgLDSSourcePlugin: Plugin = async function(
  builder,
  {
    pgLDSUrl = process.env.LDS_URL,
    pgOwnerConnectionString,
    ldsSleepDuration = getSafeNumber(process.env.LD_WAIT),
    ldsTablePattern = process.env.LD_TABLE_PATTERN,
  }
) {
  // Connect to LDS server
  try {
    const source = await makeLDSLiveSource({
      ldsURL: typeof pgLDSUrl === "string" ? pgLDSUrl : undefined,
      // @ts-ignore
      connectionString: pgOwnerConnectionString as string,
      sleepDuration: ldsSleepDuration,
      tablePattern: ldsTablePattern,
    });
    builder.hook(
      "build",
      build => {
        build.liveCoordinator.registerSource("pg", source);
        return build;
      },
      ["PgLDSSource"]
    );
    if (process.env.NODE_ENV === "test") {
      // Need a way of releasing it
      builder.hook("finalize", schema => {
        Object.defineProperty(schema, "__pgLdsSource", {
          value: source,
          enumerable: false,
          configurable: false,
        });
        return schema;
      });
    }
  } catch (e) {
    console.error(
      "Could not Initiate PgLDSSourcePlugin, continuing without LDS live queries. Error:",
      e.message
    );
    return;
  }
};

export default PgLDSSourcePlugin;
