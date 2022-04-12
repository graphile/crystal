import chalk from "chalk";
import type {
  AccessPlan,
  CrystalResultsList,
  CrystalValuesList,
} from "dataplanner";
import { access, ExecutablePlan } from "dataplanner";

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | Array<JSONValue>;

/**
 * This plan accepts as JSON string as its only input and will result in the
 * parsed JSON object (or array, boolean, string, etc).
 */
export class JSONParsePlan<
  TJSON extends JSONValue,
> extends ExecutablePlan<TJSON> {
  static $$export = {
    moduleName: "@dataplan/json",
    exportName: "JSONParsePlan",
  };
  // We're not safe because if parsing JSON fails we'll include a rejected
  // promise.
  isSyncAndSafe = false;

  constructor($stringPlan: ExecutablePlan<string | null>) {
    super();
    this.addDependency($stringPlan);
  }

  toStringMeta(): string {
    return chalk.bold.yellow(String(this.dependencies[0]));
  }

  get<TKey extends keyof TJSON>(
    key: TKey,
  ): AccessPlan<
    TJSON extends { [key: string]: unknown } ? TJSON[TKey] : never
  > {
    return access(this, [key as string]);
  }

  at<TIndex extends keyof TJSON & number>(
    index: TIndex,
  ): AccessPlan<TJSON[TIndex]> {
    return access(this, [index]);
  }

  execute(values: [CrystalValuesList<string>]): CrystalResultsList<TJSON> {
    return values[0].map((v) => {
      if (typeof v === "string") {
        try {
          return JSON.parse(v);
        } catch (e) {
          return Promise.reject(e);
        }
      } else if (v == null) {
        return null;
      } else {
        return Promise.reject(
          new Error(
            `JSONParsePlan: expected string to parse, but received ${
              Array.isArray(v) ? "array" : typeof v
            }`,
          ),
        );
      }
    }) as CrystalResultsList<TJSON>;
  }
}

/**
 * This plan accepts as JSON string as its only input and will result in the
 * parsed JSON object (or array, boolean, string, etc).
 */
export function jsonParse<TJSON extends JSONValue>(
  $string: ExecutablePlan<string | null>,
): JSONParsePlan<TJSON> {
  return new JSONParsePlan<TJSON>($string);
}

Object.defineProperty(jsonParse, "$$export", {
  value: {
    moduleName: "@dataplan/json",
    exportName: "jsonParse",
  },
});
