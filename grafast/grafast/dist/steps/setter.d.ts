import type { InputObjectTypeBakedInfo } from "../index.js";
import { Modifier } from "./applyInput.js";
export interface SetterCapable<TObj extends Record<string, any>> {
    set<TKey extends keyof TObj>(key: TKey, value: TObj[TKey]): void;
}
export declare class Setter<TObj extends Record<string, any> = Record<string, any>, TParent extends SetterCapable<TObj> = SetterCapable<TObj>> extends Modifier<TParent> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    private setters;
    constructor(parent: TParent);
    set<TKey extends keyof TObj>(key: TKey, value: TObj[TKey]): void;
    apply(): void;
}
export declare function setter<TObj extends Record<string, any> = Record<string, any>, TParent extends SetterCapable<TObj> = SetterCapable<TObj>>(parent: TParent): Setter<TObj, TParent>;
export declare function createObjectAndApplyChildren<TObj extends Record<string, any>>(_input: Record<string, any>, info: InputObjectTypeBakedInfo): TObj;
//# sourceMappingURL=setter.d.ts.map