// Inspired by eslint-plugin-react-hooks

import type { ESLint, Linter, Rule } from "eslint";

import { ExhaustiveDeps } from "./ExhaustiveDeps.js";
import { ExportInstances } from "./ExportInstances.js";
import { ExportMethods } from "./ExportMethods.js";
import { ExportPlans } from "./ExportPlans.js";
import { ExportSubclasses } from "./ExportSubclasses.js";
import { NoNested } from "./NoNested.js";

export const configs = {
  recommended: {
    name: "graphile-export/recommended",
    plugins: {
      get "graphile-export"(): ESLint.Plugin {
        return plugin;
      },
    },
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
            "planType",
            "toSpecifier",
            "subscribePlan",
            "isTypeOf",
            "resolveType",
            "serialize",
            "parseValue",
            "parseLiteral",
            "inputPlan",
            "baked",
            "applyPlan",
            "apply",
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
      "graphile-export/export-plans": [
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
    } satisfies Linter.RulesRecord,
  },
};

export const meta = {
  name: "eslint-plugin-graphile-export",
};

export const rules = {
  "exhaustive-deps": ExhaustiveDeps,
  "export-methods": ExportMethods,
  "export-instances": ExportInstances,
  "export-plans": ExportPlans,
  "export-subclasses": ExportSubclasses,
  "no-nested": NoNested,
} satisfies Record<string, Rule.RuleModule>;

const plugin = {
  configs,
  meta,
  rules,
};
