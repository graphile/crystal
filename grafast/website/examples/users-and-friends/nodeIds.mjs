import { access, constant, ExecutableStep, list } from "grafast";

import { postById, userById } from "./plans.mjs";

/**
 * Converts values into base64-encoded JSON and back.
 *
 * @type {import('grafast').NodeIdCodec}
 */
const base64JSONCodec = {
  name: "base64JSON",
  encode(value) {
    return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
  },
  decode(value) {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
  },
};

// Grafast optimizations:
base64JSONCodec.encode.isSyncAndSafe = true;
base64JSONCodec.decode.isSyncAndSafe = true;

const _base64JSONCodec = base64JSONCodec;
export { _base64JSONCodec as base64JSONCodec };

/**
 * Creates a Grafast handler for NodeIDs.
 *
 * @param {string} typeName
 * @param {(spec: any) => ExecutableStep} get
 * @returns {import('grafast').NodeIdHandler}
 */
function makeHandler(typeName, codec, get) {
  return {
    typeName,
    codec,
    plan($data) {
      return list([constant(typeName), $data.get("id")]);
    },
    match(list) {
      return list[0] === typeName;
    },
    getSpec($list) {
      return { id: access($list, 1) };
    },
    get,
  };
}

const handlers = {
  User: makeHandler("User", base64JSONCodec, (spec) => userById(spec.id)),
  Post: makeHandler("Post", base64JSONCodec, (spec) => postById(spec.id)),
};

const _handlers = handlers;
export { _handlers as handlers };
