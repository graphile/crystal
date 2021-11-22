// Inspired by babel-plugin-react-hooks

import { ExhaustiveDeps } from "./ExhaustiveDeps";
import { ExportInstances } from "./ExportInstances";
import { ExportMethods } from "./ExportMethods";

export const configs = {
  recommended: {
    plugins: ["graphile-exporter"],
    rules: {
      "graphile-exporter/exhaustive-deps": [
        "error",
        {
          disableAutofix: false,
          sortExports: true,
        },
      ],
      "graphile-exporter/export-methods": [
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
          ],
        },
      ],
      "graphile-exporter/export-instances": [
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
};
