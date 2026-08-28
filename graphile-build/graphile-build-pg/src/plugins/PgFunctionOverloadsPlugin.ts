import "graphile-config";

import type { PgProc } from "pg-introspection";

import { version } from "../version.ts";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      /**
       * The signature to append to a function's resource name to
       * disambiguate it from its overloads, based on the names of its input
       * argument types.
       */
      functionResourceNameSignature(
        this: Inflection,
        details: {
          serviceName: string;
          pgProc: PgProc;
        },
      ): string;
    }
  }

  namespace GraphileConfig {
    interface Plugins {
      PgFunctionOverloadsPlugin: true;
    }
  }
}

export const PgFunctionOverloadsPlugin: GraphileConfig.Plugin = {
  name: "PgFunctionOverloadsPlugin",
  description:
    "Factors the input argument types into function resource names so that overloaded functions receive distinct names rather than being skipped",
  version: version,

  inflection: {
    replace: {
      functionResourceName(previous, options, details) {
        if (!previous) {
          throw new Error(`No functionResourceName inflector found!`);
        }
        return `${previous(details)}${this.functionResourceNameSignature(
          details,
        )}`;
      },
    },
    add: {
      functionResourceNameSignature(_options, { pgProc }) {
        return pgProc
          .getArguments()
          .filter((a) => a.isIn)
          .map((a) => "__" + a.type.typname)
          .join("");
      },
    },
  },
};

export const PgFunctionOverloadsPreset: GraphileConfig.Preset = {
  plugins: [PgFunctionOverloadsPlugin],
};
