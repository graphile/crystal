import type { CrystalResultsList, CrystalValuesList } from "dataplanner";
import { ExecutablePlan } from "dataplanner";

import type { PgTypeCodec } from "../interfaces.js";

/**
 * Converts the given value to the representation suitable for feeding into the
 * PostgreSQL driver.
 *
 * @remarks This would have been a lambda, but we want to be able to deduplicate it.
 *
 * @internal
 */
export class ToPgPlan extends ExecutablePlan<any> {
  static $$export = {
    moduleName: "dataplanner",
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

/**
 * Converts the given value to the representation suitable for feeding into the
 * PostgreSQL driver.
 *
 * @internal
 */
export function toPg(
  $value: ExecutablePlan<any>,
  codec: PgTypeCodec<any, any, any>,
) {
  return new ToPgPlan($value, codec);
}
