import { reservedWords } from "./reservedWords.js";
import { $$type } from "./thereCanBeOnlyOne.js";
/**
 * Represents raw TE, the text will be output verbatim into the compiled code.
 */
export interface TERawNode {
    readonly [$$type]: "RAW";
}
/**
 * Represents an TE value that will be replaced with a closure variable in the
 * compiled TE statement.
 */
export interface TERefNode {
    readonly [$$type]: "REF";
}
/**
 * Represents a temporary variable that will be created, primarily useful for
 * inline wrangling of data where statements are not available.
 */
export interface TETemporaryVariableNode {
    readonly [$$type]: "VARIABLE";
}
/**
 * Represents that the TE inside this should be indented when pretty printed.
 */
export interface TEIndentNode {
    readonly [$$type]: "INDENT";
}
export type TENode = TERawNode | TERefNode | TETemporaryVariableNode | TEIndentNode;
export interface TEQuery {
    readonly [$$type]: "QUERY";
}
/**
 * A tamedevil node or fragment, ready to be combined into a larger fragment or
 * evaluated directly. To evaluate, feed this node into `te.run()`.
 */
export type TE = TENode | TEQuery;
/**
 * Returns true if the given node is a TE node, false otherwise.
 */
declare function isTE(node: unknown): node is TE;
declare function debug(expression: TE): void;
/**
 * Accepts an te`...` expression and compiles it out to the function body
 * `string` and the `refs` that need to be passed via the closure.
 */
declare function compile(fragment: TE): {
    string: string;
    refs: {
        [key: string]: any;
    };
};
declare function cache(strings: TemplateStringsArray): TE;
/**
 * Creates a TE node for a raw code string. Just plain ol‘ raw code - EXTREMELY
 * DANGEROUS.
 *
 * This method is dangerous because it involves no escaping, so proceed with
 * caution!
 *
 * It's very very rarely warranted to use this - there is likely a safer way of
 * achieving your goal. DO NOT USE THIS WITH UNTRUSTED INPUT!
 */
declare function dangerouslyIncludeRawCode(text: string): TE;
/**
 * Creates a TE node for an arbitrary JS object that will be made available
 * (via a closure) to the final code that will be executed. This value is not
 * serialized or similar, it is passed by reference.
 */
declare function ref(val: any, name?: string): TE;
declare const undefinedNode: TERawNode;
/**
 * Similar to `JSON.stringify(string)`, but faster. Bizarrely this seems to be
 * faster than the regexp approach
 */
export declare function stringifyString(value: string): string;
/**
 * Equivalent to JSON.stringify, but typically faster.
 */
export declare const stringifyJSON: (value: any) => string;
/** @deprecated Use stringifyJSON instead */
export declare const toJSON: (value: any) => string;
/**
 * If the value is simple this will stringify it and inject it directly into
 * the code to be evaluated, otherwise will defer to `te.ref`.
 */
declare function lit(val: any): TE;
/**
 * If you're building a string and you want to inject untrusted content into it
 * without opening yourself to code injection attacks nor doing awkward string
 * concatenation, this is the method for you. It's essential that you pass the
 * correct type of string that you're embedding into via the `stringType`
 * parameter.
 *
 * Example:
 *
 * ```js
 * const code = te`const str = "abc${te.substring(untrusted, '"')}123";`
 * ```
 */
declare function substring(text: string, stringType: "'" | '"' | "`"): TE;
/**
 * Escapes `content` so that it can be safely embedded in a multiline comment.
 */
declare function subcomment(content: string | number | null | undefined): TERawNode;
/**
 * Returns true if the given key is safe to set as the key of a POJO (without a
 * null prototype), false otherwise.
 */
export declare const isSafeObjectPropertyName: (key: string | symbol | number) => boolean;
/**
 * Asserts that the given `name` is allowed to be used as an identifier
 * (variable name, function name, etc); and if so it returns a TE node
 * representing this identifier. If disallowed, will throw an error.
 */
declare function identifier(name: string): TERawNode;
/**
 * Checks that the given `key` is not explicitly disallowed as a key on a POJO and returns a TE node representing it. If disallowed, an error will be thrown. Useful for building easy to read objects:
 *
 * ```js
 * const obj = te.run`return { ${te.identifier("frogs")}: "frogs" }`;
 * ```
 *
 * IMPORTANT: It's strongly recommended that instead of defining an object via
 * `const obj = { ${te.safeKeyOrThrow(untrustedKey)}: value }` you instead use
 * `const obj = Object.create(null);` and then set the properties on the resulting
 * object via `${obj}${te.set(untrustedKey, true)} = value;` - this prevents
 * attacks such as **prototype polution** since properties like `__proto__` are
 * not special on null-prototype objects, whereas they can cause havok in
 * regular `{}` objects (POJOs).
 */
declare function safeKeyOrThrow(key: string | symbol | number): TE;
/**
 * Accesses the key of an object either via `.` or `[]` as appropriate;
 * `obj${te.get(key)}` would become `obj.foo` or `obj["1foo"]` as
 * appropriate.
 *
 * DO NOT USE THIS FOR ASSIGNMENT!
 */
declare function get(key: string | symbol | number): TE;
/**
 * Accesses the key of an object via optional-chaining:
 * `obj${te.optionalGet(key)}` would become `obj?.foo` or `obj?.["1foo"]` as
 * appropriate.
 *
 * DO NOT USE THIS FOR ASSIGNMENT!
 */
declare function optionalGet(key: string | symbol | number): TE;
/**
 * Access to the key of an object either via `.` or `[]` as appropriate ready
 * for being assigned to; `obj${te.set(key)}` would become `obj.foo` or
 * `obj["1foo"]` as appropriate. Note this is different to `get` because it
 * performs additional checks.
 *
 * If the object you're setting properties on has a `null` prototype
 * (`Object.create(null)`) then you can set `hasNullPrototype` to true and all
 * keys are allowed. If this is not the case, then an error will be thrown on
 * certain potentially dangerous keys such as `__proto__` or `constructor`.
 *
 * ENHANCE: consider aliasing this as 'leftAccess' (accessing a property, to
 * be done on the left side of an assignment).
 */
declare function set(key: string | symbol | number, hasNullPrototype?: boolean): TE;
/**
 * @experimental
 */
declare function tempVar(symbol?: symbol): TE;
/**
 * @experimental
 */
declare function tmp(obj: TE, callback: (tmp: TE) => TE): TE;
/** For compatibility with graphile-export */
export declare function EXPORTABLE<T, TScope extends any[]>(factory: (...args: TScope) => T, args: [...TScope], nameHint?: string): T;
/**
 * Evaluates the given TE fragment, and returns the result. Note that the
 * fragment must contain a `return` statement for the result to not be
 * undefined.
 */
declare function run<TResult>(fragment: TE): TResult;
declare function run<TResult>(strings: TemplateStringsArray, ...values: TE[]): TResult;
/** Same as `run`, except the result is wrapped in `EXPORTABLE()` */
declare function runExportable<TResult>(fragment: TE): TResult;
declare function runExportable<TResult>(strings: TemplateStringsArray, ...values: TE[]): TResult;
declare function runInBatch<TResult>(fragment: TE, callback: (r: TResult) => void): void;
declare function batch(callback: () => void): void;
/**
 * Join some TE items together, optionally separated by a string. Useful when
 * dealing with lists of TE nodes, for example a dynamic list of object
 * properties.
 */
declare function join(items: Array<TE>, separator?: string): TE;
/**
 * Indicates that the given fragment should be indented when output in debug
 * mode. (Has no effect in production mode.)
 *
 * WARNING: all lines will be indented, without any parsing, so if there are
 * template literals that contain newlines, spaces will be added inside these
 * too.
 */
declare function indent(fragment: TE): TE;
declare function indent(strings: TemplateStringsArray, ...values: Array<TE>): TE;
/**
 * If the given condition is true, the fragment will be wrapped with an indent
 * node, otherwise it will be returned verbatim.
 */
declare function indentIf(condition: boolean, fragment: TE): TE;
/**
 * Makes safe identifiers
 *
 * @experimental
 */
export declare class Idents {
    idents: Set<string>;
    /**
     * Don't allow using these identifiers (presumably because they're already in use).
     */
    forbid(identifiers: string[]): void;
    makeSafeIdentifier(str: string): string;
}
declare const te: TamedEvil;
export default te;
export { batch, cache, compile, 
/** @deprecated Use safeKeyOrThrow instead */
safeKeyOrThrow as dangerousKey, dangerouslyIncludeRawCode, debug, run as eval, get, identifier, isTE, join, lit, lit as literal, optionalGet, ref, run, runExportable, runInBatch, safeKeyOrThrow, set, subcomment, substring, te, tempVar, tmp, undefinedNode as undefined, };
export interface TamedEvil {
    (strings: TemplateStringsArray, ...values: Array<TE>): TE;
    te: TamedEvil;
    cache: typeof cache;
    ref: typeof ref;
    reference: typeof ref;
    lit: typeof lit;
    literal: typeof lit;
    substring: typeof substring;
    subcomment: typeof subcomment;
    join: typeof join;
    identifier: typeof identifier;
    safeKeyOrThrow: typeof safeKeyOrThrow;
    /** @deprecated Use safeKeyOrThrow instead */
    dangerousKey: typeof safeKeyOrThrow;
    get: typeof get;
    optionalGet: typeof optionalGet;
    set: typeof set;
    tmp: typeof tmp;
    tempVar: typeof tempVar;
    run: {
        <TResult>(fragment: TE): TResult;
        <TResult>(strings: TemplateStringsArray, ...values: TE[]): TResult;
    };
    runExportable: {
        <TResult>(fragment: TE): TResult;
        <TResult>(strings: TemplateStringsArray, ...values: TE[]): TResult;
    };
    eval: {
        <TResult>(fragment: TE): TResult;
        <TResult>(strings: TemplateStringsArray, ...values: TE[]): TResult;
    };
    runInBatch: typeof runInBatch;
    batch: typeof batch;
    compile: typeof compile;
    indent: typeof indent;
    indentIf: typeof indentIf;
    undefined: TE;
    blank: TE;
    isTE: typeof isTE;
    debug: typeof debug;
    dangerouslyIncludeRawCode: typeof dangerouslyIncludeRawCode;
}
export { reservedWords };
//# sourceMappingURL=index.d.ts.map