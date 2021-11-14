// Inspired by babel-plugin-react-hooks

import { ExhaustiveDeps } from "./ExhaustiveDeps";

export const configs = {
  recommended: {
    plugins: ["graphile-exporter"],
    rules: {
      "graphile-exporter/exhaustive-deps": "error",
    },
  },
};

export const rules = {
  "exhaustive-deps": ExhaustiveDeps,
};
