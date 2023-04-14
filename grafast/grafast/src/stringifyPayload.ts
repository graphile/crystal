import type { JSONObject } from "./interfaces.js";

export function stringifyPayload(
  payload: JSONObject,
  outputDataAsString: boolean | undefined,
): string {
  if (!outputDataAsString || typeof payload.data !== "string") {
    return JSON.stringify(payload);
  }
  let str = "{";
  let first = true;
  if (payload.incremental) {
    throw new Error("Haven't implemented incremental yet");
  }
  if (payload.errors !== undefined) {
    if (!first) {
      str += ",";
      first = false;
    }
    str += `"errors":${JSON.stringify(payload.errors)}`;
  }
  if (payload.data === undefined) {
    // noop
  } else if (payload.data === null) {
    if (!first) {
      str += ",";
      first = false;
    }
    str += `"data":null`;
  } else if (typeof payload.data === "string") {
    if (!first) {
      str += ",";
      first = false;
    }
    str += `"data":${payload.data}`;
  } else {
    throw new Error(`Expected data to be null, undefined, or a JSON string`);
  }
  if (payload.extensions !== undefined) {
    if (!first) {
      str += ",";
      first = false;
    }
    str += `"extensions":${JSON.stringify(payload.extensions)}`;
  }
  if (payload.label !== undefined) {
    if (!first) {
      str += ",";
      first = false;
    }
    str += `"label":${JSON.stringify(payload.label)}`;
  }
  if (payload.hasNext !== undefined) {
    if (!first) {
      str += ",";
      first = false;
    }
    str += `"hasNext":${JSON.stringify(payload.hasNext)}`;
  }
  str += "}";
  return str;
}
