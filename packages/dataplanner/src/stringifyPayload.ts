import { JSONObject, JSONValue } from "./interfaces";

export function stringifyPayload(
  payload: JSONObject,
  asString: boolean | undefined,
): string {
  if (!asString || typeof payload.data !== "string") {
    return JSON.stringify(payload);
  }
  let str = "{";
  let first = true;
  if (payload.incremental) {
    throw new Error("Haven't implemented incremental yet");
  }
  if (payload.errors !== undefined) {
    if (!first) str += ",";
    first = false;
    str += `"errors":${JSON.stringify(payload.errors)}`;
  }
  if (payload.data !== undefined) {
    if (!first) str += ",";
    first = false;
    // TODO: assert that data is a string
    str += `"data":${payload.data ?? "null"}`;
  }
  if (payload.extensions !== undefined) {
    if (!first) str += ",";
    first = false;
    str += `"extensions":${JSON.stringify(payload.extensions)}`;
  }
  if (payload.label !== undefined) {
    if (!first) str += ",";
    first = false;
    str += `"label":${JSON.stringify(payload.label)}`;
  }
  if (payload.hasNext !== undefined) {
    if (!first) str += ",";
    first = false;
    str += `"hasNext":${JSON.stringify(payload.hasNext)}`;
  }
  str += "}";
  return str;
}
