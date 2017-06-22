"use strict";
const assert = require("assert");
const defaults = require("lodash/defaults");

// Based on https://github.com/tjmehta/graphql-parse-fields

function parseFields(info, options = {}) {
  const fieldNodes = info && (info.fieldASTs || info.fieldNodes);
  if (!fieldNodes) {
    throw new Error("No fieldNodes provided!");
  }
  defaults(options, {
    keepRoot: false,
    deep: true,
  });
  let tree = fieldTreeFromAST(fieldNodes, info.fragments, undefined, options);
  if (!options.keepRoot) {
    const key = firstKey(tree);
    tree = tree[key];
  }
  return tree;
}

function fieldTreeFromAST(inASTs, fragments, init, options) {
  fragments = fragments || {};
  init = init || {};
  options = options || {};
  const asts = Array.isArray(inASTs) ? inASTs : [inASTs];
  return asts.reduce(function(tree, val) {
    const kind = val.kind;
    const name = val.name && val.name.value;
    const alias = val.alias ? val.alias.value : name;
    const args = val.arguments;
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
            fragments,
            tree[alias].fields,
            options
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
        fragments,
        tree,
        options
      );
    } else if (kind === "InlineFragment" && options.deep) {
      const fragment = val;
      fieldTreeFromAST(
        fragment.selectionSet.selections,
        fragments,
        tree,
        options
      );
    } // else ignore
    return tree;
  }, init);
}

function firstKey(obj) {
  for (const key in obj) {
    return key;
  }
}

module.exports = parseFields;
