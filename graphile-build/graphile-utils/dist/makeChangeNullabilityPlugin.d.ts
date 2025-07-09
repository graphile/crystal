export type NullabilitySpecString = "" | "!" | "[]" | "[]!" | "[!]" | "[!]!" | "[[]]" | "[[]]!" | "[[]!]" | "[[]!]!" | "[[!]]" | "[[!]]!" | "[[!]!]" | "[[!]!]!";
export type NullabilitySpec = boolean | NullabilitySpecString;
export interface ChangeNullabilityTypeRules {
    [fieldName: string]: NullabilitySpec | {
        type?: NullabilitySpec;
        args?: {
            [argName: string]: NullabilitySpec;
        };
    };
}
export interface ChangeNullabilityRules {
    [typeName: string]: ChangeNullabilityTypeRules;
}
export declare function makeChangeNullabilityPlugin(rules: ChangeNullabilityRules): GraphileConfig.Plugin;
//# sourceMappingURL=makeChangeNullabilityPlugin.d.ts.map