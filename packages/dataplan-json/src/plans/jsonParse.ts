import chalk from "chalk";
import type {
  AccessPlan,
  CrystalResultsList,
  CrystalValuesList,
} from "graphile-crystal";
import { access, ExecutablePlan } from "graphile-crystal";

type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | Array<JSONValue>;

export class JSONParsePlan<
  TJSON extends JSONValue,
> extends ExecutablePlan<TJSON> {
  static $$export = {
    moduleName: "@dataplan/json",
    exportName: "JSONParsePlan",
  };
  sync = true;

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
        return JSON.parse(v);
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