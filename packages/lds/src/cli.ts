#!/usr/bin/env node
/* eslint-disable no-console,curly */
import subscribeToLogicalDecoding, { AnnounceCallback } from "./index";
import * as WebSocket from "ws";

const CONNECTION_STRING = process.env.LD_DATABASE_URL;
const TABLE_PATTERN = process.env.LD_TABLE_PATTERN || "*.*";
const SLOT_NAME = process.env.LD_SLOT_NAME || "postgraphile";
const PORT =
  parseInt(process.env.LD_PORT || process.env.PORT || "", 10) || 9876;
const HOST = process.env.LD_HOST || "127.0.0.1";
// Maximum number of expected clients
const SLOTS = parseInt(process.env.LD_MAX_CLIENTS || "", 10) || 50;
const SLEEP_DURATION = Math.max(
  1,
  parseInt(process.env.LD_WAIT || "", 10) || 125
);
const stringify = JSON.stringify;

async function main() {
  if (!CONNECTION_STRING) {
    throw new Error(
      "No connection string provided, please set envvar LD_DATABASE_URL."
    );
  }
  // Now slot is created, create websocket server
  const wss = new WebSocket.Server({ port: PORT, host: HOST });
  const clients: Array<WebSocket> = [];
  const channels: {
    [schema: string]: {
      [table: string]: {
        [stringifiedKey: string]: Array<WebSocket | null>;
      };
    };
  } = {};
  // Send keepalive every 25 seconds
  setInterval(() => {
    clients.forEach(ws => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            _: "KA",
          })
        );
      }
    });
  }, 25000);

  wss.on("connection", function connection(ws) {
    clients.push(ws);

    ws.on("close", () => {
      const i = clients.indexOf(ws);
      if (i >= 0) {
        clients.splice(i, 1);
      }
      // Release all the subscriptions
      // TODO: do this more performantly!!
      for (const schema of Object.keys(channels)) {
        for (const table of Object.keys(channels[schema])) {
          for (const stringifiedKey of Object.keys(channels[schema][table])) {
            const channelClients = channels[schema][table][stringifiedKey];
            const index = channelClients.indexOf(ws);
            if (index >= 0) {
              channelClients[index] = null;
            }
          }
        }
      }
    });

    ws.on("message", function incoming(rawMessage) {
      const message = rawMessage.toString("utf8");
      let topicJSON: string;
      let sub: boolean;
      if (message.startsWith("SUB ")) {
        topicJSON = message.substr(4);
        sub = true;
      } else if (message.startsWith("UNSUB ")) {
        topicJSON = message.substr(6);
        sub = false;
      } else {
        console.error("Unknown command", message);
        return;
      }
      const topic = JSON.parse(topicJSON);
      if (!Array.isArray(topic)) return console.error("Not an array");
      if (topic.length < 2) return console.error("Too short");
      if (topic.length > 3) return console.error("Too long");
      const [schema, table, key] = topic;
      if (typeof schema !== "string") {
        return console.error("Schema not a string");
      }
      if (typeof table !== "string") return console.error("Table not a string");
      if (key && !Array.isArray(key)) {
        return console.error("Invalid key spec", topic);
      }

      const stringifiedKey = key ? stringify(key) : "";
      if (!channels[schema]) {
        channels[schema] = {};
      }
      if (!channels[schema][table]) {
        channels[schema][table] = {};
      }
      if (!channels[schema][table][stringifiedKey]) {
        channels[schema][table][stringifiedKey] = new Array(SLOTS);
      }
      const channelClients = channels[schema][table][stringifiedKey]!;
      const i = channelClients.indexOf(ws);
      if (sub) {
        if (i >= 0) {
          console.error("Socket is already registered for ", stringifiedKey);
          return;
        }
        const emptyIndex = channelClients.findIndex(s => !s);
        if (emptyIndex < 0) {
          console.error("All sockets are full");
          return;
        }
        channelClients[emptyIndex] = ws;
      } else {
        if (i < 0) {
          console.error("Socket is not registered for ", stringifiedKey);
          return;
        }
        channelClients[i] = null;
      }
    });

    ws.send(
      JSON.stringify({
        _: "ACK",
      })
    );
  });

  const callback: AnnounceCallback = function (announcement) {
    const { _: kind, schema, table } = announcement;
    if (!channels[schema] || !channels[schema][table]) return;
    const stringifiedKey =
      announcement._ !== "insertC" && announcement._ !== "updateC"
        ? stringify(announcement.keys)
        : "";
    const channelClients = channels[schema][table][stringifiedKey];
    if (!channelClients) return;
    const msg = JSON.stringify(announcement);
    for (const socket of channelClients) {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(msg);
      }
    }
    if (kind === "delete") {
      delete channels[schema][table][stringifiedKey];
    }
  };

  await subscribeToLogicalDecoding(CONNECTION_STRING, callback, {
    slotName: SLOT_NAME,
    tablePattern: TABLE_PATTERN,
    sleepDuration: SLEEP_DURATION,
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
