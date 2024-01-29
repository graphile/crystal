/** IMPORTANT: bump this on incompatible changes to this module */
const revision = 1;

/**
 * This is the secret to our safety; since this is a symbol it cannot be faked
 * in a JSON payload or other user-provided data, so external data cannot make
 * itself trusted.
 */
export const $$type: unique symbol = Symbol.for(`tamedevil-type-${revision}`);
