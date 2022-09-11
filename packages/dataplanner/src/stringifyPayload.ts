import { JSONObject, JSONValue } from "./interfaces";

const KEYS = ["errors", "data", "extensions", "label", "hasNext"] as const;

export function stringifyPayload(
  payload: JSONObject,
  asString: boolean | undefined,
) {
  if (!asString || typeof payload.data !== "string") {
    return JSON.stringify(payload);
  }
  let str = "{";
  let first = true;
  if (payload.incremental) {
    throw new Error("Haven't implemented incremental yet");
  }
  for (const key of KEYS) {
    const value = payload[key];
    if (value === undefined) {
      continue;
    }
    if (!first) {
      str += ",";
    }
    first = false;
    if (key === "data") {
      str += `"${key}":${value}`;
    } else {
      str += `"${key}":${JSON.stringify(value)}`;
    }
  }
  str += "}";
  return str;
}
