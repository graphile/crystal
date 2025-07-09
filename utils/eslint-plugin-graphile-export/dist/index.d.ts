export declare const configs: {
    recommended: {
        plugins: string[];
        rules: {
            "graphile-export/exhaustive-deps": (string | {
                disableAutofix: boolean;
                sortExports: boolean;
            })[];
            "graphile-export/export-methods": (string | {
                disableAutofix: boolean;
                methods: string[];
            })[];
            "graphile-export/export-instances": (string | {
                disableAutofix: boolean;
            })[];
            "graphile-export/export-subclasses": (string | {
                disableAutofix: boolean;
            })[];
            "graphile-export/no-nested": (string | {
                disableAutofix: boolean;
            })[];
        };
    };
};
export declare const rules: {
    "exhaustive-deps": import("eslint").Rule.RuleModule;
    "export-methods": import("eslint").Rule.RuleModule;
    "export-instances": import("eslint").Rule.RuleModule;
    "export-subclasses": import("eslint").Rule.RuleModule;
    "no-nested": import("eslint").Rule.RuleModule;
};
//# sourceMappingURL=index.d.ts.map