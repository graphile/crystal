import crypto from "crypto";
import util, { inspect } from "util";

interface $$Export {
  moduleName: string;
  exportName: string | "default" | "*";
}

const wellKnownMap = new Map<unknown, $$Export>();

// TODO: fill this out a bit...
wellKnownMap.set(crypto, { moduleName: "crypto", exportName: "default" });
wellKnownMap.set(util, { moduleName: "util", exportName: "default" });
wellKnownMap.set(inspect, { moduleName: "util", exportName: "inspect" });

/**
 * @internal
 */
export function wellKnown(thing: unknown): $$Export | undefined {
  return wellKnownMap.get(thing);
}
