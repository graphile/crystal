"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gql = gql;
// eslint-disable-next-line no-restricted-syntax
const graphql_1 = require("grafast/graphql");
function isGraphQLDocument(input) {
    return (input &&
        typeof input === "object" &&
        input.kind === "Document" &&
        Array.isArray(input.definitions));
}
function gql(strings, ...interpolatedValues) {
    const gqlStrings = [];
    const placeholders = Object.create(null);
    const additionalDefinitions = [];
    for (let idx = 0, length = strings.length; idx < length; idx++) {
        gqlStrings.push(strings[idx]);
        if (idx === length - 1) {
            // NOOP: last string, so no matching interpolatedValue.
        }
        else {
            const interpolatedValue = interpolatedValues[idx];
            if (typeof interpolatedValue === "string") {
                gqlStrings.push(String(interpolatedValue));
            }
            else if (isGraphQLDocument(interpolatedValue)) {
                additionalDefinitions.push(...interpolatedValue.definitions);
            }
            else {
                throw new Error(`Placeholder ${idx + 1} is invalid - expected string or GraphQL AST, but received '${typeof interpolatedValue}'. Happened after '${gqlStrings.join("")}'`);
            }
        }
    }
    const ast = (0, graphql_1.parse)(gqlStrings.join(""));
    const visitor = {
        enter: (node) => {
            if (node.kind === "Document") {
                return {
                    ...node,
                    definitions: [...node.definitions, ...additionalDefinitions],
                };
            }
            else if (node.kind === "Argument") {
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
    const astWithPlaceholdersReplaced = (0, graphql_1.visit)(ast, visitor);
    return astWithPlaceholdersReplaced;
}
//# sourceMappingURL=gql.js.map