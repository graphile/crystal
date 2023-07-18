import type { ASTNode, DefinitionNode, DocumentNode } from "grafast/graphql";
// eslint-disable-next-line no-restricted-syntax
import { parse, visit } from "grafast/graphql";

function isGraphQLDocument(input: any): input is DocumentNode {
  return (
    input &&
    typeof input === "object" &&
    input.kind === "Document" &&
    Array.isArray(input.definitions)
  );
}

export function gql(
  strings: TemplateStringsArray,
  ...interpolatedValues: Array<string | DocumentNode>
): DocumentNode {
  const gqlStrings = [];
  const placeholders = Object.create(null);
  const additionalDefinitions: Array<DefinitionNode> = [];
  for (let idx = 0, length = strings.length; idx < length; idx++) {
    gqlStrings.push(strings[idx]);
    if (idx === length - 1) {
      // NOOP: last string, so no matching interpolatedValue.
    } else {
      const interpolatedValue = interpolatedValues[idx];
      if (typeof interpolatedValue === "string") {
        gqlStrings.push(String(interpolatedValue));
      } else if (isGraphQLDocument(interpolatedValue)) {
        additionalDefinitions.push(...interpolatedValue.definitions);
      } else {
        throw new Error(
          `Placeholder ${
            idx + 1
          } is invalid - expected string or GraphQL AST, but received '${typeof interpolatedValue}'. Happened after '${gqlStrings.join(
            "",
          )}'`,
        );
      }
    }
  }
  const ast = parse(gqlStrings.join(""));
  const visitor = {
    enter: (node: ASTNode) => {
      if (node.kind === "Document") {
        return {
          ...node,
          definitions: [...node.definitions, ...additionalDefinitions],
        };
      } else if (node.kind === "Argument") {
        if (node.value.kind === "StringValue") {
          if (placeholders[node.value.value]) {
            return {
              ...node,
              value: placeholders[node.value.value],
            };
          }
        }
      }
      return undefined;
    },
  };
  const astWithPlaceholdersReplaced = visit(ast, visitor);
  return astWithPlaceholdersReplaced;
}
