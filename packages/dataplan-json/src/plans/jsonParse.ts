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

  execute(values: CrystalValuesList<[string]>): CrystalResultsList<TJSON> {
    return values.map((v) => {
      if (typeof v[0] === "string") {
        return JSON.parse(v[0]);
      } else if (v[0] == null) {
        return null;
      } else {
        return Promise.reject(
          new Error(
            `JSONParsePlan: expected string to parse, but received ${
              Array.isArray(v[0]) ? "array" : typeof v[0]
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
