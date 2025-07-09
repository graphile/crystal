import { Step } from "./step.js";
/**
 * When using this, always use `const`! Otherwise tuples will show up as arrays
 * and break things.
 */
export type Multistep = null | undefined | Step | readonly [...(readonly Step[])] | Record<string, Step>;
export type UnwrapMultistep<TMultistepSpec extends Multistep> = TMultistepSpec extends null ? null : TMultistepSpec extends undefined ? undefined : TMultistepSpec extends Step<infer U> ? U : TMultistepSpec extends readonly [...(readonly any[])] ? {
    [index in keyof TMultistepSpec]: TMultistepSpec[index] extends Step<infer V> ? V : never;
} : {
    [key in keyof TMultistepSpec]: TMultistepSpec[key] extends Step<infer V> ? V : never;
};
interface MultistepCacheConfig {
    identifier: string;
    cacheSize: number;
}
export declare function multistep<const TMultistepSpec extends Multistep>(spec: TMultistepSpec, stable?: string | true | MultistepCacheConfig): Step<UnwrapMultistep<TMultistepSpec>>;
export declare function isMultistep<const TMultistepSpec extends Multistep>(spec: any): spec is TMultistepSpec;
export {};
//# sourceMappingURL=multistep.d.ts.map