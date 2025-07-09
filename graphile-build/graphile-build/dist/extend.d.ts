/**
 * Indents every line in the given text by two spaces (and trims spaces from
 * spaces-only lines).
 */
export declare function indent(text: string): string;
/**
 * Merges the properties from `extra` into `base` tracking the `hint` as to
 * when they were added. If a conflict is found (where `base` already has a key
 * in `extra`) an error will be thrown describing what happened.
 */
export default function extend<Obj1 extends Record<string | number | symbol, any>, Obj2 extends Record<string | number | symbol, any>>(base: Obj1, extra: Obj2, hint: string): Obj1 & Obj2;
//# sourceMappingURL=extend.d.ts.map