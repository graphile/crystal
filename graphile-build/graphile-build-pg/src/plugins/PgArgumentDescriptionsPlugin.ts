import "graphile-config";

import { version } from "../version.ts";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgArgumentDescriptionsPlugin: true;
    }
  }
}

export const PgArgumentDescriptionsPlugin: GraphileConfig.Plugin = {
  name: "PgArgumentDescriptionsPlugin",
  description:
    "Applies zero-based @argNdescription tags to SQL function inputs.",
  version,
  gather: {
    hooks: {
      pgProcedures_PgResourceOptions(_info, { pgProc, resourceOptions }) {
        const { parameters } = resourceOptions;
        if (!parameters) return;
        const { tags } = pgProc.getTagsAndDescription();
        const types = pgProc.proallargtypes ?? pgProc.proargtypes ?? [];
        let inputIndex = 0;
        types.forEach((_type, index) => {
          const mode = pgProc.proargmodes?.[index] ?? "i";
          if (mode !== "i" && mode !== "b") return;
          const param = parameters[inputIndex++];
          const tag = tags[`arg${index}description`];
          const description = Array.isArray(tag) ? tag.join("\n") : tag;
          if (typeof description === "string") {
            param.extensions = {
              ...param.extensions,
              argDescription: description,
            };
          }
        });
      },
    },
  },
};
