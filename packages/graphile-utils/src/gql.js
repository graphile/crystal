import { parse, visit } from "graphql";
const $$embed = Symbol("graphile-embed");

export function isEmbed(obj) {
  return obj && obj[$$embed] === true;
}

export function embed(value) {
  return {
    [$$embed]: true,
    value: {
      kind: "GraphileEmbed",
      value,
    },
  };
}

export function gql(strings, ...interpolatedValues) {
  const gqlStrings = [];
  const placeholders = {};
  const createPlaceholderFor = value => {
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
        gqlStrings.push(createPlaceholderFor(interpolatedValue.value));
      } else {
        if (typeof interpolatedValue !== "string") {
          throw new Error(
            `Placeholder ${idx +
              1} is invalid - expected string, but received '${typeof interpolatedValue}'. Happened after '${gqlStrings.join(
              ""
            )}'`
          );
        }
        gqlStrings.push(String(interpolatedValue));
      }
    }
  }
  const ast = parse(gqlStrings.join(""));
  const visitor = {
    enter(node, _key, _parent, _path, _ancestors) {
      if (node.kind === "Argument") {
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
