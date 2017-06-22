"use strict";
const assert = require("assert");
const defaults = require("lodash/defaults");
const { getArgumentValues } = require("graphql/execution/values");

// Based on https://github.com/tjmehta/graphql-parse-fields

function parseFields(resolveInfo, options = {}) {
  const fieldNodes =
    resolveInfo && (resolveInfo.fieldASTs || resolveInfo.fieldNodes);
  const { parentType } = resolveInfo;
  if (!fieldNodes) {
    throw new Error("No fieldNodes provided!");
  }
  defaults(options, {
    keepRoot: false,
    deep: true,
  });
  let tree = fieldTreeFromAST(
    fieldNodes,
    resolveInfo,
    undefined,
    options,
    parentType
  );
  if (!options.keepRoot) {
    const key = firstKey(tree);
    tree = tree[key];
  }
  return tree;
}

function getFieldFromAST(ast, parentType) {
  if (ast.kind === "Field") {
    const fieldName = ast.name.value;
    return parentType._fields[fieldName];
  }
  return;
}

function stripNonNullType(type) {
  return type.constructor.name === "GraphQLNonNull" ? type.ofType : type;
}

function stripListType(type) {
  return type.constructor.name === "GraphQLList" ? type.ofType : type;
}

function fieldTreeFromAST(inASTs, resolveInfo, init, options, parentType) {
  let { fragments, variableValues } = resolveInfo;
  fragments = fragments || {};
  init = init || {};
  options = options || {};
  const asts = Array.isArray(inASTs) ? inASTs : [inASTs];
  return asts.reduce(function(tree, val) {
    const kind = val.kind;
    const name = val.name && val.name.value;
    const alias = val.alias ? val.alias.value : name;
    const field = getFieldFromAST(val, parentType);
    const fieldGqlType = stripNonNullType(
      stripListType(stripNonNullType(field.type))
    );
    const args = getArgumentValues(field, val, variableValues);
    if (kind === "Field") {
      if (!tree[alias]) {
        tree[alias] = {
          ast: val,
          alias,
          name,
          args,
          fields: {},
        };
        if (val.selectionSet && options.deep) {
          fieldTreeFromAST(
            val.selectionSet.selections,
            resolveInfo,
            tree[alias].fields,
            options,
            fieldGqlType
          );
        } else {
          // No fields to add
        }
      }
    } else if (kind === "FragmentSpread" && options.deep) {
      const fragment = fragments[name];
      assert(fragment, 'unknown fragment "' + name + '"');
      fieldTreeFromAST(
        fragment.selectionSet.selections,
        resolveInfo,
        tree,
        options,
        parentType
      );
    } else if (kind === "InlineFragment" && options.deep) {
      const fragment = val;
      fieldTreeFromAST(
        fragment.selectionSet.selections,
        resolveInfo,
        tree,
        options,
        parentType
      );
    } // else ignore
    // XXX: need to process FragmentDefinition?
    // Ref: https://github.com/postgraphql/postgraphql/pull/342/files#diff-d6702ec9fed755c88b9d70b430fda4d8R148
    return tree;
  }, init);
}

function firstKey(obj) {
  for (const key in obj) {
    return key;
  }
}

module.exports = parseFields;
