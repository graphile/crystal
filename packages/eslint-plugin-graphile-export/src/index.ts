// Inspired by babel-plugin-react-hooks

import { ExhaustiveDeps } from "./ExhaustiveDeps";
import { ExportInstances } from "./ExportInstances";
import { ExportMethods } from "./ExportMethods";
import { ExportSubclasses } from "./ExportSubclasses";
import { NoNested } from "./NoNested";

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
