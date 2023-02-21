import { ExecutionExtra, UnbatchedExecutableStep } from "grafast";
import { ExecutableStep } from "grafast";

import type { PgTypeCodec } from "../interfaces.js";

/**
 * Converts the given value to the representation suitable for feeding into the
 * PostgreSQL driver.
 *
 * @remarks This would have been a lambda, but we want to be able to deduplicate it.
 *
 * @internal
 */
export class ToPgStep extends UnbatchedExecutableStep<any> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ToPgStep",
  };
  isSyncAndSafe = true;
  constructor(
    $value: ExecutableStep<any>,
    private codec: PgTypeCodec<any, any, any>,
  ) {
    super();
    this.addDependency($value);
  }
  deduplicate(peers: ToPgStep[]): ToPgStep[] {
    return peers.filter((peer) => peer.codec === this.codec);
  }

  unbatchedExecute(_extra: ExecutionExtra, v: any) {
    return v == null ? null : this.codec.toPg(v);
  }
}

/**
 * Converts the given value to the representation suitable for feeding into the
 * PostgreSQL driver.
 *
 * @internal
 */
export function toPg(
  $value: ExecutableStep<any>,
  codec: PgTypeCodec<any, any, any>,
) {
  return new ToPgStep($value, codec);
}
