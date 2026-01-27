// Inspired by eslint-plugin-react-hooks

import type { ESLint, Linter, Rule } from "eslint";

import { ExhaustiveDeps } from "./ExhaustiveDeps.ts";
import { ExportInstances } from "./ExportInstances.ts";
import { ExportMethods } from "./ExportMethods.ts";
import { ExportPlans } from "./ExportPlans.ts";
import { ExportSubclasses } from "./ExportSubclasses.ts";
import { NoNested } from "./NoNested.ts";

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
