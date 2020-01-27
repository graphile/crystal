// @flow
import { LiveProvider } from "graphile-build";
import type { PgClass } from "./plugins/PgIntrospectionPlugin";

export default class PgLiveProvider extends LiveProvider {
  // eslint-disable-next-line flowtype/no-weak-types
  constructor(...args: any[]) {
    super(...args);
    this.namespace = "pg";
  }

  collectionIdentifierIsValid(collectionIdentifier: PgClass) {
    return collectionIdentifier && collectionIdentifier.kind === "class";
  }

  recordIdentifierIsValid(
    collectionIdentifier: PgClass,
    // eslint-disable-next-line flowtype/no-weak-types
    recordIdentifier: Array<any>
  ) {
    if (!Array.isArray(recordIdentifier)) return false;
    if (!collectionIdentifier.primaryKeyConstraint) return false;
    if (
      recordIdentifier.length !==
      collectionIdentifier.primaryKeyConstraint.keyAttributes.length
    ) {
      return false;
    }
    // TODO: more validation would not go amiss
    return true;
  }
}
