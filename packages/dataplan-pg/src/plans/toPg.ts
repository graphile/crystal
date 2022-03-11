import type { CrystalResultsList, CrystalValuesList } from "graphile-crystal";
import { ExecutablePlan } from "graphile-crystal";

import type { PgTypeCodec } from "../interfaces";

/**
 * This would have been a lambda, but we want to be able to deduplicate it.
 *
 * @internal
 */
export class ToPgPlan extends ExecutablePlan<any> {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "ToPgPlan",
  };
  isSyncAndSafe = true;
  constructor(
    $value: ExecutablePlan<any>,
    private codec: PgTypeCodec<any, any, any>,
  ) {
    super();
    this.addDependency($value);
  }
  deduplicate(peers: ToPgPlan[]): ToPgPlan {
    for (const peer of peers) {
      if (peer.codec === this.codec) {
        return peer;
      }
    }
    return this;
  }

  execute(values: [CrystalValuesList<any>]): CrystalResultsList<any> {
    return values[0].map(this.codec.toPg);
  }
}

export function toPg(
  $value: ExecutablePlan<any>,
  codec: PgTypeCodec<any, any, any>,
) {
  return new ToPgPlan($value, codec);
}
