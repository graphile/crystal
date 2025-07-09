"use strict";
// Inspired by babel-plugin-react-hooks
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = exports.configs = void 0;
const ExhaustiveDeps_js_1 = require("./ExhaustiveDeps.js");
const ExportInstances_js_1 = require("./ExportInstances.js");
const ExportMethods_js_1 = require("./ExportMethods.js");
const ExportSubclasses_js_1 = require("./ExportSubclasses.js");
const NoNested_js_1 = require("./NoNested.js");
exports.configs = {
    recommended: {
        plugins: ["graphile-export"],
        rules: {
            "graphile-export/exhaustive-deps": [
                "error",
                {
                    disableAutofix: false,
                    sortExports: true,
                },
            ],
            "graphile-export/export-methods": [
                "error",
                {
                    disableAutofix: false,
                    methods: [
                        "resolve",
                        "subscribe",
                        "plan",
                        "subscribePlan",
                        "isTypeOf",
                        "resolveType",
                        "serialize",
                        "parseValue",
                        "parseLiteral",
                        "inputPlan",
                        "applyPlan",
                        "assertStep",
                    ],
                },
            ],
            "graphile-export/export-instances": [
                "error",
                {
                    disableAutofix: false,
                },
            ],
            "graphile-export/export-subclasses": [
                "error",
                {
                    disableAutofix: false,
                },
            ],
            "graphile-export/no-nested": [
                "error",
                {
                    disableAutofix: false,
                },
            ],
        },
    },
};
exports.rules = {
    "exhaustive-deps": ExhaustiveDeps_js_1.ExhaustiveDeps,
    "export-methods": ExportMethods_js_1.ExportMethods,
    "export-instances": ExportInstances_js_1.ExportInstances,
    "export-subclasses": ExportSubclasses_js_1.ExportSubclasses,
    "no-nested": NoNested_js_1.NoNested,
};
//# sourceMappingURL=index.js.map