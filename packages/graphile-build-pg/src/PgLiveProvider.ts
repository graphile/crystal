import { LiveProvider } from "graphile-build";
import { PgClass } from "./plugins/PgIntrospectionPlugin";

export default class PgLiveProvider extends LiveProvider {
  constructor() {
    super("pg");
  }

  collectionIdentifierIsValid(collectionIdentifier: PgClass) {
    return collectionIdentifier && collectionIdentifier.kind === "class";
  }

  recordIdentifierIsValid(
    collectionIdentifier: PgClass,
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
