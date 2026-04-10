/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { existsSync, readdirSync, readFileSync } from "node:fs";

import type {} from "graphile-config";
import {
  buildSchema,
  parse,
  print,
  specifiedDirectives,
  validateSchema,
  visit,
} from "graphql";
import { it } from "mocha";

import { assertConformance, makeConformanceSchema } from "./utils.ts";
const SPECIFIED_DIRECTIVE_NAMES = [
  ...specifiedDirectives.map((d) => d.name),
  "defer",
  "stream",
];

describe("conformance corpus", () => {
  if (!existsSync(`${__dirname}/corpus`)) {
    return;
  }
  const corpuses = readdirSync(`${__dirname}/corpus`);
  for (const corpus of corpuses) {
    if (corpus.startsWith(".")) continue;
    const corpusPath = `${__dirname}/corpus/${corpus}`;
    const schemaText = removeSpecifiedDirectives(
      readFileSync(`${corpusPath}/schema.graphqls`, "utf8"),
    );
    if (!isValidSchemaText(schemaText)) continue;
    describe(corpus, () => {
      const queryIds = readdirSync(corpusPath);
      for (const queryId of queryIds) {
        if (queryId.startsWith(".")) continue;
        if (queryId === "schema.graphqls") continue;
        const source = readFileSync(
          `${corpusPath}/${queryId}/query.graphql`,
          "utf8",
        );
        describe(queryId, () => {
          const variableIds = readdirSync(`${corpusPath}/${queryId}`).filter(
            (id) => !id.startsWith(".") && id !== "query.graphql",
          );
          if (variableIds.length === 0) {
            it(`corpus/${corpus}/${queryId}`, async () => {
              const schema = makeConformanceSchema(schemaText);
              await assertConformance(schema, source);
            });
          } else {
            for (const variablesId of variableIds) {
              const variablesText = readFileSync(
                `${corpusPath}/${queryId}/${variablesId}/variables.json`,
                "utf8",
              );
              const variableValues = JSON.parse(variablesText);
              it(`corpus/${corpus}/${queryId}/${variablesId}`, async () => {
                const schema = makeConformanceSchema(schemaText);
                await assertConformance(schema, source, variableValues);
              });
            }
          }
        });
      }
    });
  }
});

// Specified directives must not be included in schema text
function removeSpecifiedDirectives(schemaText: string) {
  const ast = parse(schemaText);
  const newAst = visit(ast, {
    DirectiveDefinition: {
      leave(d) {
        if (SPECIFIED_DIRECTIVE_NAMES.includes(d.name.value)) {
          return null;
        }
      },
    },
  });
  return print(newAst);
}

function isValidSchemaText(schemaText: string) {
  try {
    const schema = buildSchema(schemaText);
    const errors = validateSchema(schema);
    if (errors.length > 0) {
      throw new Error(errors[0].message);
    }
    return true;
  } catch (e) {
    return false;
  }
}
