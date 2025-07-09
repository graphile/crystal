#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable no-console,curly */
const ws_1 = tslib_1.__importDefault(require("ws"));
const index_js_1 = tslib_1.__importDefault(require("./index.js"));
const CONNECTION_STRING = process.env.LD_DATABASE_URL;
const TABLE_PATTERN = process.env.LD_TABLE_PATTERN || "*.*";
const SLOT_NAME = process.env.LD_SLOT_NAME || "postgraphile";
const PORT = parseInt(process.env.LD_PORT || process.env.PORT || "", 10) || 9876;
const HOST = process.env.LD_HOST || "127.0.0.1";
// Maximum number of expected clients
const SLOTS = parseInt(process.env.LD_MAX_CLIENTS || "", 10) || 50;
const SLEEP_DURATION = Math.max(1, parseInt(process.env.LD_WAIT || "", 10) || 125);
const stringify = JSON.stringify;
async function main() {
    if (!CONNECTION_STRING) {
        throw new Error("No connection string provided, please set envvar LD_DATABASE_URL.");
    }
    // Now slot is created, create websocket server
    const wss = new ws_1.default.Server({ port: PORT, host: HOST });
    const clients = [];
    const channels = Object.create(null);
    // Send keepalive every 25 seconds
    setInterval(() => {
        clients.forEach((ws) => {
            if (ws && ws.readyState === ws_1.default.OPEN) {
                ws.send(JSON.stringify({
                    _: "KA",
                }));
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
            // PERF: do this more performantly!!
            for (const tableMap of Object.values(channels)) {
                for (const clientsMap of Object.values(tableMap)) {
                    for (const channelClients of Object.values(clientsMap)) {
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
            let topicJSON;
            let sub;
            if (message.startsWith("SUB ")) {
                topicJSON = message.substr(4);
                sub = true;
            }
            else if (message.startsWith("UNSUB ")) {
                topicJSON = message.substr(6);
                sub = false;
            }
            else {
                console.error("Unknown command", message);
                return;
            }
            const topic = JSON.parse(topicJSON);
            if (!Array.isArray(topic))
                return console.error("Not an array");
            if (topic.length < 2)
                return console.error("Too short");
            if (topic.length > 3)
                return console.error("Too long");
            const [schema, table, key] = topic;
            if (typeof schema !== "string") {
                return console.error("Schema not a string");
            }
            if (typeof table !== "string")
                return console.error("Table not a string");
            if (key && !Array.isArray(key)) {
                return console.error("Invalid key spec", topic);
            }
            const stringifiedKey = key ? stringify(key) : "";
            const tableMap = channels[schema] ??
                (channels[schema] = Object.create(null));
            const clientsMap = tableMap[table] ??
                (tableMap[table] = Object.create(null));
            const channelClients = clientsMap[stringifiedKey] ??
                (clientsMap[stringifiedKey] = new Array(SLOTS));
            const i = channelClients.indexOf(ws);
            if (sub) {
                if (i >= 0) {
                    console.error("Socket is already registered for ", stringifiedKey);
                    return;
                }
                const emptyIndex = channelClients.findIndex((s) => s != null);
                if (emptyIndex < 0) {
                    console.error("All sockets are full");
                    return;
                }
                channelClients[emptyIndex] = ws;
            }
            else {
                if (i < 0) {
                    console.error("Socket is not registered for ", stringifiedKey);
                    return;
                }
                channelClients[i] = null;
            }
        });
        ws.send(JSON.stringify({
            _: "ACK",
        }));
    });
    const callback = function (announcement) {
        const { _: kind, schema, table } = announcement;
        const tableMap = channels[schema];
        const clientsMap = tableMap?.[table];
        if (!clientsMap)
            return;
        const stringifiedKey = announcement._ !== "insertC" && announcement._ !== "updateC"
            ? stringify(announcement.keys)
            : "";
        const channelClients = clientsMap?.[stringifiedKey];
        if (!channelClients)
            return;
        const msg = JSON.stringify(announcement);
        for (const socket of channelClients) {
            if (socket && socket.readyState === ws_1.default.OPEN) {
                socket.send(msg);
            }
        }
        if (kind === "delete") {
            delete clientsMap[stringifiedKey];
        }
    };
    await (0, index_js_1.default)(CONNECTION_STRING, callback, {
        slotName: SLOT_NAME,
        tablePattern: TABLE_PATTERN,
        sleepDuration: SLEEP_DURATION,
    });
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map