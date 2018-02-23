// @flow

import assert from "assert";
import { getArgumentValues } from "graphql/execution/values";
import {
  getNamedType,
  isCompositeType,
  GraphQLObjectType,
  GraphQLUnionType,
} from "graphql";
import debugFactory from "debug";

import type {
  GraphQLResolveInfo,
  GraphQLField,
  GraphQLCompositeType,
  GraphQLInterfaceType,
  GraphQLType,
} from "graphql/type/definition";

import type {
  ASTNode,
  FieldNode,
  SelectionNode,
  FragmentSpreadNode,
  InlineFragmentNode,
} from "graphql/language/ast";

export type FieldsByTypeName = {
  [string]: {
    [string]: ResolveTree,
  },
};

export type ResolveTree = {
  name: string,
  alias: string,
  args: {
    [string]: mixed,
  },
  fieldsByTypeName: FieldsByTypeName,
};

const debug = debugFactory("graphql-parse-resolve-info");

// Originally based on https://github.com/tjmehta/graphql-parse-fields

export function getAliasFromResolveInfo(
  resolveInfo: GraphQLResolveInfo
): string {
  const asts = resolveInfo.fieldNodes || resolveInfo.fieldASTs;
  const alias = asts.reduce(function(alias, val) {
    if (!alias) {
      if (val.kind === "Field") {
        alias = val.alias ? val.alias.value : val.name && val.name.value;
      }
    }
    return alias;
  }, null);
  if (!alias) {
    throw new Error("Could not determine alias?!");
  }
  return alias;
}

export function parseResolveInfo(
  resolveInfo: GraphQLResolveInfo,
  options: { keepRoot?: boolean, deep?: boolean } = {}
): ResolveTree | FieldsByTypeName | null | void {
  const fieldNodes: $ReadOnlyArray<FieldNode> =
    resolveInfo.fieldNodes || resolveInfo.fieldASTs;

  const { parentType } = resolveInfo;
  if (!fieldNodes) {
    throw new Error("No fieldNodes provided!");
  }
  if (options.keepRoot == null) {
    options.keepRoot = false;
  }
  if (options.deep == null) {
    options.deep = true;
  }
  let tree = fieldTreeFromAST(
    fieldNodes,
    resolveInfo,
    undefined,
    options,
    parentType
  );
  if (!options.keepRoot) {
    const typeKey = firstKey(tree);
    if (!typeKey) {
      return null;
    }
    tree = tree[typeKey];
    const fieldKey = firstKey(tree);
    if (!fieldKey) {
      return null;
    }
    tree = tree[fieldKey];
  }
  return tree;
}

function getFieldFromAST(
  ast: ASTNode,
  parentType: GraphQLCompositeType
): ?GraphQLField<*, *> {
  if (ast.kind === "Field") {
    const fieldNode: FieldNode = ast;
    const fieldName = fieldNode.name.value;
    if (!(parentType instanceof GraphQLUnionType)) {
      const type: GraphQLObjectType | GraphQLInterfaceType = parentType;
      return type.getFields()[fieldName];
    } else {
      // XXX: TODO: Handle GraphQLUnionType
    }
  }
  return;
}

let iNum = 1;
function fieldTreeFromAST<T: SelectionNode>(
  inASTs: $ReadOnlyArray<T> | T,
  resolveInfo: GraphQLResolveInfo,
  initTree: FieldsByTypeName = {},
  options = {},
  parentType: GraphQLCompositeType,
  depth = ""
): FieldsByTypeName {
  const instance = iNum++;
  debug(
    "%s[%d] Entering fieldTreeFromAST with parent type '%s'",
    depth,
    instance,
    parentType
  );
  let { variableValues } = resolveInfo;
  const fragments = resolveInfo.fragments || {};
  const asts: $ReadOnlyArray<T> = Array.isArray(inASTs) ? inASTs : [inASTs];
  initTree[parentType.name] = initTree[parentType.name] || {};
  const outerDepth = depth;
  return asts.reduce(function(tree, selectionVal: SelectionNode, idx) {
    const depth = `${outerDepth}  `;
    debug(
      "%s[%d] Processing AST %d of %d; kind = %s",
      depth,
      instance,
      idx + 1,
      asts.length,
      selectionVal.kind
    );
    if (selectionVal.kind === "Field") {
      const val: FieldNode = selectionVal;
      const name = val.name && val.name.value;
      const isReserved = name && name !== "__id" && name.substr(0, 2) === "__";
      if (isReserved) {
        debug(
          "%s[%d] IGNORING because field '%s' is reserved",
          depth,
          instance,
          name
        );
      } else {
        const alias: string =
          val.alias && val.alias.value ? val.alias.value : val.name.value;
        debug("%s[%d] Field '%s' (alias = '%s')", depth, instance, name, alias);
        const field = getFieldFromAST(val, parentType);
        if (!field) {
          return tree;
        }
        const fieldGqlType = getNamedType(field.type);
        if (!fieldGqlType) {
          return tree;
        }
        const args = getArgumentValues(field, val, variableValues) || {};
        if (parentType.name && !tree[parentType.name][alias]) {
          const newTreeRoot: ResolveTree = {
            name,
            alias,
            args,
            fieldsByTypeName: isCompositeType(fieldGqlType)
              ? {
                  [fieldGqlType.name]: {},
                }
              : {},
          };
          tree[parentType.name][alias] = newTreeRoot;
        }
        const selectionSet = val.selectionSet;
        if (
          selectionSet != null &&
          options.deep &&
          isCompositeType(fieldGqlType)
        ) {
          const newParentType: GraphQLCompositeType = fieldGqlType;
          debug("%s[%d] Recursing into subfields", depth, instance);
          fieldTreeFromAST(
            selectionSet.selections,
            resolveInfo,
            tree[parentType.name][alias].fieldsByTypeName,
            options,
            newParentType,
            `${depth}  `
          );
        } else {
          // No fields to add
          debug("%s[%d] Exiting (no fields to add)", depth, instance);
        }
      }
    } else if (selectionVal.kind === "FragmentSpread" && options.deep) {
      const val: FragmentSpreadNode = selectionVal;
      const name = val.name && val.name.value;
      debug("%s[%d] Fragment spread '%s'", depth, instance, name);
      const fragment = fragments[name];
      assert(fragment, 'unknown fragment "' + name + '"');
      let fragmentType = parentType;
      if (fragment.typeCondition) {
        fragmentType = getType(resolveInfo, fragment.typeCondition);
      }
      if (fragmentType && isCompositeType(fragmentType)) {
        const newParentType: GraphQLCompositeType = fragmentType;
        fieldTreeFromAST(
          fragment.selectionSet.selections,
          resolveInfo,
          tree,
          options,
          newParentType,
          `${depth}  `
        );
      }
    } else if (selectionVal.kind === "InlineFragment" && options.deep) {
      const val: InlineFragmentNode = selectionVal;
      const fragment = val;
      let fragmentType = parentType;
      if (fragment.typeCondition) {
        fragmentType = getType(resolveInfo, fragment.typeCondition);
      }
      debug(
        "%s[%d] Inline fragment (parent = '%s', type = '%s')",
        depth,
        instance,
        parentType,
        fragmentType
      );
      if (fragmentType && isCompositeType(fragmentType)) {
        const newParentType: GraphQLCompositeType = fragmentType;
        fieldTreeFromAST(
          fragment.selectionSet.selections,
          resolveInfo,
          tree,
          options,
          newParentType,
          `${depth}  `
        );
      }
    } else {
      debug(
        "%s[%d] IGNORING because kind '%s' not understood",
        depth,
        instance,
        selectionVal.kind
      );
    }
    // Ref: https://github.com/postgraphql/postgraphql/pull/342/files#diff-d6702ec9fed755c88b9d70b430fda4d8R148
    return tree;
  }, initTree);
}

function firstKey(obj) {
  for (const key in obj) {
    return key;
  }
}

function getType(resolveInfo, typeCondition) {
  const { schema } = resolveInfo;
  const { kind, name } = typeCondition;
  if (kind === "NamedType") {
    const typeName = name.value;
    return schema.getType(typeName);
  }
}

export function simplifyParsedResolveInfoFragmentWithType(
  parsedResolveInfoFragment: ResolveTree,
  Type: GraphQLType
) {
  const { fieldsByTypeName } = parsedResolveInfoFragment;
  const fields = {};
  const StrippedType = getNamedType(Type);
  if (isCompositeType(StrippedType)) {
    Object.assign(fields, fieldsByTypeName[StrippedType.name]);
    if (StrippedType instanceof GraphQLObjectType) {
      const ObjectType: GraphQLObjectType = StrippedType;
      // GraphQL ensures that the subfields cannot clash, so it's safe to simply overwrite them
      for (const Interface of ObjectType.getInterfaces()) {
        Object.assign(fields, fieldsByTypeName[Interface.name]);
      }
    }
  }
  return Object.assign({}, parsedResolveInfoFragment, {
    fields,
  });
}

export const parse = parseResolveInfo;
export const simplify = simplifyParsedResolveInfoFragmentWithType;
export const getAlias = getAliasFromResolveInfo;
