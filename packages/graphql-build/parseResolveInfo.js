"use strict";
const assert = require("assert");
const defaults = require("lodash/defaults");
const { getArgumentValues } = require("graphql/execution/values");
const { getNamedType } = require("graphql");

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
    const typeKey = firstKey(tree);
    tree = tree[typeKey];
    const fieldKey = firstKey(tree);
    tree = tree[fieldKey];
  }
  return tree;
}

function getFieldFromAST(ast, parentType) {
  if (ast.kind === "Field") {
    const fieldName = ast.name.value;
    return parentType.getFields()[fieldName];
  }
  return;
}

let iNum = 1;
function fieldTreeFromAST(inASTs, resolveInfo, initTree, options, parentType) {
  const instance = iNum++;
  console.log(instance, "Field tree from AST");
  let { fragments, variableValues } = resolveInfo;
  fragments = fragments || {};
  initTree = initTree || {};
  options = options || {};
  const asts = Array.isArray(inASTs) ? inASTs : [inASTs];
  initTree[parentType.name] = initTree[parentType.name] || {};
  return asts.reduce(function(tree, val, idx) {
    console.log(instance, "AST", idx + 1, "/", asts.length);
    const kind = val.kind;
    const name = val.name && val.name.value;
    const isReserved = name && name.substr(0, 2) === "__";
    if (kind === "Field" && !isReserved) {
      const alias = val.alias ? val.alias.value : name;
      console.log(instance, "Field", alias, name);
      const field = getFieldFromAST(val, parentType);
      const fieldGqlType = getNamedType(field.type);
      const args = getArgumentValues(field, val, variableValues) || {};
      if (!tree[parentType.name][alias]) {
        tree[parentType.name][alias] = {
          ast: val,
          alias,
          name,
          args,
          fieldsByTypeName: {
            [fieldGqlType.name]: {},
          },
        };
        if (val.selectionSet && options.deep) {
          fieldTreeFromAST(
            val.selectionSet.selections,
            resolveInfo,
            tree[parentType.name][alias].fieldsByTypeName,
            options,
            fieldGqlType
          );
        } else {
          // No fields to add
          console.log(instance, "EXITING!", val);
        }
      }
    } else if (kind === "FragmentSpread" && options.deep) {
      console.log(instance, "Fragment spread", name);
      const fragment = fragments[name];
      assert(fragment, 'unknown fragment "' + name + '"');
      let fragmentType = parentType;
      if (fragment.typeCondition) {
        fragmentType = getType(resolveInfo, fragment.typeCondition);
      }
      if (fragmentType) {
        fieldTreeFromAST(
          fragment.selectionSet.selections,
          resolveInfo,
          tree,
          options,
          fragmentType
        );
      }
    } else if (kind === "InlineFragment" && options.deep) {
      const fragment = val;
      let fragmentType = parentType;
      if (fragment.typeCondition) {
        fragmentType = getType(resolveInfo, fragment.typeCondition);
      }
      if (fragmentType) {
        fieldTreeFromAST(
          fragment.selectionSet.selections,
          resolveInfo,
          tree,
          options,
          fragmentType
        );
      }
    } // else ignore
    // XXX: need to process FragmentDefinition?
    // Ref: https://github.com/postgraphql/postgraphql/pull/342/files#diff-d6702ec9fed755c88b9d70b430fda4d8R148
    return tree;
  }, initTree);
}

function firstKey(obj) {
  for (const key in obj) {
    return key;
  }
}

function findCompatibleType(type, typeCondition) {
  let compatibleType = null;
  const { kind, name } = typeCondition;
  if (kind === "NamedType") {
    const otherTypeName = name.value;
    compatibleType = otherTypeName === type.name ? type : null;
    if (!compatibleType && type.getInterfaces) {
      // Maybe it implements an interface?
      const interfaces = type.getInterfaces();
      compatibleType = interfaces.find(({ name }) => name === otherTypeName);
    }
  }
  return compatibleType;
}

function getType(resolveInfo, typeCondition) {
  const { schema } = resolveInfo;
  const { kind, name } = typeCondition;
  if (kind === "NamedType") {
    const typeName = name.value;
    return schema.getType(typeName);
  }
}

module.exports = parseFields;
