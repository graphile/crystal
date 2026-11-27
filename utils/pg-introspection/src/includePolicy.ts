import type {
  IntrospectionPolicy,
  NamedEntity,
  PurposeList,
} from "./interfaces.ts";

/** Seed multipass discovery with named objects and their requested purposes. */
export function includePolicy(
  name: string,
  entity: NamedEntity,
  identities: readonly (string | readonly string[])[],
  purposes: PurposeList,
): IntrospectionPolicy<null> {
  return {
    name,
    entity: null,
    select(_row, details) {
      for (const identity of identities) {
        details.requestByName(entity, identity, purposes);
      }
    },
  };
}
