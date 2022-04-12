/**
 * The pathIdentity that represents things without a path identity. Making this
 * non-string would be a PITA right now... But maybe that's what we should do
 * long term. This is used for things like plans for
 * context/rootValue/variableValues which don't apply to a path.
 *
 * IMPORTANT: this must be shorter than EVERY OTHER path identity.
 */
export const GLOBAL_PATH = "";

/**
 * The pathIdentity that represents the root of the operation. All other paths
 * flow from this so it should be short, but it must be longer than
 * GLOBAL_PATH.
 */
export const ROOT_PATH = "~";
