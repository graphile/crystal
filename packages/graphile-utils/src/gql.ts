// eslint-disable-next-line no-restricted-imports
import { parse, visit, ASTNode, DocumentNode, DefinitionNode } from "graphql";
const $$embed = Symbol("graphile-embed");

export interface GraphileEmbed<T = any> {
  [$$embed]: true;
  kind: "GraphileEmbed";
  value: T;
}

export function isEmbed(obj: any): obj is GraphileEmbed {
  return obj && obj[$$embed] === true;
}

export function embed<T>(value: T): GraphileEmbed<T> {
  return {
    [$$embed]: true,
    kind: "GraphileEmbed",
    value,
  };
}

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
  ...interpolatedValues: Array<string | GraphileEmbed | DocumentNode>
): DocumentNode {
  const gqlStrings = [];
  const placeholders = {};
  const additionalDefinitions: Array<DefinitionNode> = [];
  const createPlaceholderFor = (value: any) => {
    const rand = String(Math.random());
    placeholders[rand] = value;
    return `"${rand}"`;
  };
  for (let idx = 0, length = strings.length; idx < length; idx++) {
    gqlStrings.push(strings[idx]);
    if (idx === length - 1) {
      // NOOP: last string, so no matching interpolatedValue.
    } else {
      const interpolatedValue = interpolatedValues[idx];
      if (isEmbed(interpolatedValue)) {
        gqlStrings.push(createPlaceholderFor(interpolatedValue));
      } else {
        if (typeof interpolatedValue === "string") {
          gqlStrings.push(String(interpolatedValue));
        } else if (isGraphQLDocument(interpolatedValue)) {
          additionalDefinitions.push(...interpolatedValue.definitions);
        } else {
          throw new Error(
            `Placeholder ${idx +
              1} is invalid - expected string or GraphQL AST, but received '${typeof interpolatedValue}'. Happened after '${gqlStrings.join(
              ""
            )}'`
          );
        }
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
