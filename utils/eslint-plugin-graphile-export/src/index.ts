// Inspired by babel-plugin-react-hooks

import { ExhaustiveDeps } from "./ExhaustiveDeps.js";
import { ExportInstances } from "./ExportInstances.js";
import { ExportMethods } from "./ExportMethods.js";
import { ExportSubclasses } from "./ExportSubclasses.js";
import { NoNested } from "./NoNested.js";

export const configs = {
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

export const rules = {
  "exhaustive-deps": ExhaustiveDeps,
  "export-methods": ExportMethods,
  "export-instances": ExportInstances,
  "export-subclasses": ExportSubclasses,
  "no-nested": NoNested,
};
