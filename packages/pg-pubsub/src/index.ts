import { PubSub } from "graphql-subscriptions";
import { EventEmitter } from "events";
import createDebugger from "debug";
import { PostGraphilePlugin } from "postgraphile";
import PgGenericSubscriptionPlugin from "./PgGenericSubscriptionPlugin";
import PgSubscriptionResolverPlugin from "./PgSubscriptionResolverPlugin";
import * as pg from "pg";

const RECONNECT_BASE_DELAY = 100;
const RECONNECT_MAX_DELAY = 30000;

declare module "postgraphile" {
  interface PostGraphileOptions {
    simpleSubscriptions?: boolean;
    subscriptionAuthorizationFunction?: string;
  }
}

declare module "graphile-build" {
  interface Options {
    pubsub: PubSub;
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const debugSubscriptions = createDebugger("postgraphile:subscriptions");

const plugin: PostGraphilePlugin = {
  ["cli:flags:add:schema"](addFlag) {
    addFlag(
      "-S, --simple-subscriptions",
      "⚡️[experimental] add simple subscription support"
    );
    addFlag(
      "--subscription-authorization-function [schemaDotFunctionName]",
      "⚡️[experimental] PG function to call to check user is allowed to subscribe"
    );
    return addFlag;
  },

  ["cli:library:options"](options, { config, cliOptions }) {
    const {
      simpleSubscriptions = false,
      subscriptionAuthorizationFunction = null,
    } = {
      ...config.options,
      ...cliOptions,
    };
    return {
      ...options,
      simpleSubscriptions,
      subscriptionAuthorizationFunction,
    };
  },

  ["postgraphile:options"](incomingOptions, { pgPool }) {
    const eventEmitter = new EventEmitter();
    const {
      simpleSubscriptions,
      subscriptionAuthorizationFunction,
    } = incomingOptions;
    const pubsub = new PubSub({
      eventEmitter,
    });

    const handleNotification = function (msg: {
      channel: string;
      payload?: string;
    }) {
      let payload;
      if (msg.payload) {
        try {
          payload = JSON.parse(msg.payload);
        } catch (e) {
          debugSubscriptions("Failed to parse payload JSON");
          debugSubscriptions(e);
          // ignore
        }
      }
      pubsub.publish(msg.channel, payload);
    };
    let listeningClient: pg.PoolClient | null;
    const cleanClient = function (client: pg.PoolClient) {
      client.removeListener("notification", handleNotification);
      clearInterval(client["keepAliveInterval"]);
      delete client["keepAliveInterval"];
      if (client === listeningClient) {
        listeningClient = null;
      }
    };
    const releaseClient = function (client: pg.PoolClient): void {
      if (!client) {
        return;
      }
      if (client) {
        cleanClient(client);
        client.release();
      }
    };
    const listenToChannelWithClient = async function (
      client: pg.PoolClient,
      channel: string
    ): Promise<void> {
      const sql = "LISTEN " + client.escapeIdentifier(channel);
      await client.query(sql);
    };
    const unlistenFromChannelWithClient = async function (
      client: pg.PoolClient,
      channel: string
    ): Promise<void> {
      const sql = "UNLISTEN " + client.escapeIdentifier(channel);
      await client.query(sql);
    };
    const channelListenCount: { [key: string]: number } = {};
    const listen = async function (channel: string) {
      channelListenCount[channel] = (channelListenCount[channel] || 0) + 1;
      if (channelListenCount[channel] === 1 && listeningClient) {
        await listenToChannelWithClient(listeningClient, channel);
      }
    };
    const unlisten = async function (channel: string) {
      channelListenCount[channel] = (channelListenCount[channel] || 1) - 1;
      if (channelListenCount[channel] === 0 && listeningClient) {
        await unlistenFromChannelWithClient(listeningClient, channel);
      }
    };
    const aL = eventEmitter.addListener;
    eventEmitter.addListener = function (name, hook) {
      if (typeof name === "string") {
        listen(name).catch(e => {
          // eslint-disable-next-line no-console
          console.error("Error occurred when unlistening:", e.message);
        });
      }
      return aL.call(this, name, hook);
    };
    const rL = eventEmitter.removeListener;
    eventEmitter.removeListener = function (name, hook) {
      if (typeof name === "string") {
        unlisten(name).catch(e => {
          // eslint-disable-next-line no-console
          console.error("Error occurred when unlistening:", e.message);
        });
      }
      return rL.call(this, name, hook);
    };

    const setupClient = async function (attempts = 0): Promise<void> {
      if (attempts > 0 && attempts % 5 === 0) {
        // eslint-disable-next-line no-console
        console.warn(
          `WARNING: @graphile/pg-pubsub cannot establish a connection to the server; reattempting with exponential backoff (attempt ${attempts})`
        );
      }
      // Permanently check client out of the pool
      let client: pg.PoolClient;
      try {
        client = await pgPool.connect();
      } catch (e) {
        // Exponential back-off
        const delay = Math.floor(
          Math.min(
            RECONNECT_MAX_DELAY,
            RECONNECT_BASE_DELAY * Math.random() * 2 ** attempts
          )
        );
        await sleep(delay);
        return setupClient(attempts + 1);
      }
      listeningClient = client;
      listeningClient.addListener("notification", handleNotification);
      // Every 25 seconds, send 'select 1' to keep the connection alive
      client["keepAliveInterval"] = setInterval(() => {
        client.query("select 1").catch(e => {
          // eslint-disable-next-line no-console
          console.error(
            "Listen client keepalive error (will attempt reconnect):"
          );
          // eslint-disable-next-line no-console
          console.error(e);
          releaseClient(client);
          if (!pgPool.ending) {
            setupClient();
          }
        });
      }, 25000);
      const channels = Object.entries(channelListenCount)
        .filter(([_channel, count]) => count > 0)
        .map(([channel]) => channel);
      try {
        await Promise.all(
          channels.map(channel => listenToChannelWithClient(client, channel))
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(
          `Error occurred when listening to channel; retrying after ${
            attempts * 2
          } seconds`
        );
        // eslint-disable-next-line no-console
        console.error(e);
        releaseClient(client);
        if (!pgPool.ending) {
          await sleep(attempts * 2000);
          return setupClient(attempts + 1);
        }
      }
    };
    setupClient().catch(e => {
      // eslint-disable-next-line no-console
      console.error(
        "Error occurred when trying to set up initial client. Current state is undefined. Suggest server restart.",
        e
      );
    });
    pgPool.on("remove", (client: pg.PoolClient) => {
      if (client === listeningClient) {
        cleanClient(client);
        if (!pgPool.ending) {
          setupClient();
        }
      }
    });
    return {
      ...incomingOptions,
      graphileBuildOptions: {
        ...incomingOptions.graphileBuildOptions,
        pubsub,
        pgSubscriptionAuthorizationFunction: subscriptionAuthorizationFunction,
      },
      appendPlugins: [
        ...(incomingOptions.appendPlugins || []),
        PgSubscriptionResolverPlugin,
        ...(simpleSubscriptions ? [PgGenericSubscriptionPlugin] : []),
      ],
    };
  },
};

export default plugin;
