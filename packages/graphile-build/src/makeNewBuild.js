// @flow

import * as graphql from "graphql";
import type {
  GraphQLNamedType,
  GraphQLInputField,
  GraphQLFieldResolver,
  GraphQLType,
} from "graphql";
import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
  getAliasFromResolveInfo as rawGetAliasFromResolveInfo,
} from "graphql-parse-resolve-info";
import debugFactory from "debug";
import type { ResolveTree } from "graphql-parse-resolve-info";
import pluralize from "pluralize";
import LRUCache from "lru-cache";
import { upperCamelCase, camelCase, constantCase } from "./utils";
import swallowError from "./swallowError";

import type SchemaBuilder, {
  Build,
  Context,
  Scope,
  DataForType,
} from "./SchemaBuilder";

import extend from "./extend";
import { createHash } from "crypto";

import { version } from "../package.json";

const isString = str => typeof str === "string";
const isDev = ["test", "development"].indexOf(process.env.NODE_ENV) >= 0;
const debug = debugFactory("graphile-build");

/*
 * This should be more than enough for normal usage. If you come under a
 * sophisticated attack then the attacker can empty this of useful values (with
 * a lot of work) but because we use SHA1 hashes under the covers the aliases
 * will still be consistent even after the LRU cache is exhausted. And SHA1 can
 * produce half a million hashes per second on my machine, the LRU only gives
 * us a 10x speedup!
 */
const hashCache = LRUCache(100000);

/*
 * This function must never return a string longer than 56 characters.
 *
 * This function must only output alphanumeric and underscore characters.
 *
 * Collisions in SHA1 aren't problematic here (for us; they will be problematic
 * for the user deliberately causing them, but that's their own fault!), so
 * we'll happily take the performance boost over SHA256.
 */
function hashFieldAlias(str) {
  const precomputed = hashCache.get(str);
  if (precomputed) return precomputed;
  const hash = createHash("sha1")
    .update(str)
    .digest("hex");
  hashCache.set(str, hash);
  return hash;
}

/*
 * This function may be replaced at any time, but all versions of it will
 * always return a representation of `alias` (a valid GraphQL identifier)
 * that:
 *
 *   1. won't conflict with normal GraphQL field names
 *   2. won't be over 60 characters long (allows for systems with alias length limits, such as PG)
 *   3. will give the same value when called multiple times within the same GraphQL query
 *   4. matches the regex /^[@!-_A-Za-z0-9]+$/
 *   5. will not be prefixed with `__` (as that will conflict with other Graphile internals)
 *
 * It does not guarantee that this alias will be human readable!
 */
function getSafeAliasFromAlias(alias) {
  if (alias.length <= 60 && !alias.startsWith("@")) {
    // Use the `@` to prevent conflicting with normal GraphQL field names, but otherwise let it through verbatim.
    return `@${alias}`;
  } else if (alias.length > 1024) {
    throw new Error(
      `GraphQL alias '${alias}' is too long, use shorter aliases (max length 1024).`
    );
  } else {
    return `@@${hashFieldAlias(alias)}`;
  }
}

/*
 * This provides a "safe" version of the alias from ResolveInfo, guaranteed to
 * never be longer than 60 characters. This makes it suitable as a PostgreSQL
 * identifier.
 */
function getSafeAliasFromResolveInfo(resolveInfo) {
  const alias = rawGetAliasFromResolveInfo(resolveInfo);
  return getSafeAliasFromAlias(alias);
}

type MetaData = {
  [string]: Array<mixed>,
};
type DataGeneratorFunction = (
  parsedResolveInfoFragment: ResolveTree,
  ReturnType: GraphQLType,
  ...args: Array<mixed>
) => Array<MetaData>;

type FieldSpecIsh = {
  type?: GraphQLType,
  args?: {},
  resolve?: GraphQLFieldResolver<*, *>,
  deprecationReason?: string,
  description?: ?string,
};

type ContextAndGenerators =
  | Context
  | {
      addDataGenerator: DataGeneratorFunction => void,
      addArgDataGenerator: DataGeneratorFunction => void,
      getDataFromParsedResolveInfoFragment: (
        parsedResolveInfoFragment: ResolveTree,
        Type: GraphQLType
      ) => DataForType,
    };

export type FieldWithHooksFunction = (
  fieldName: string,
  spec: FieldSpecIsh | (ContextAndGenerators => FieldSpecIsh),
  fieldScope?: {}
) => {};

export type InputFieldWithHooksFunction = (
  fieldName: string,
  spec: GraphQLInputField,
  fieldScope?: {}
) => GraphQLInputField;

function getNameFromType(Type: GraphQLNamedType | GraphQLSchema) {
  if (Type instanceof GraphQLSchema) {
    return "schema";
  } else {
    return Type.name;
  }
}

const {
  GraphQLSchema,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  getNamedType,
  isCompositeType,
  isAbstractType,
} = graphql;

const mergeData = (
  data: MetaData,
  gen: DataGeneratorFunction,
  ReturnType,
  arg
) => {
  const results: ?Array<MetaData> = ensureArray(gen(arg, ReturnType, data));
  if (!results) {
    return;
  }
  for (const result: MetaData of results) {
    for (const k of Object.keys(result)) {
      data[k] = data[k] || [];
      const value: mixed = result[k];
      const newData: ?Array<mixed> = ensureArray(value);
      if (newData) {
        data[k].push(...newData);
      }
    }
  }
};

const knownTypes = [
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
];
const knownTypeNames = knownTypes.map(k => k.name);

function ensureArray<T>(val: void | Array<T> | T): void | Array<T> {
  if (val == null) {
    return;
  } else if (Array.isArray(val)) {
    return val;
  } else {
    return [val];
  }
}

// eslint-disable-next-line no-unused-vars
let ensureName = fn => {};
if (["development", "test"].indexOf(process.env.NODE_ENV) >= 0) {
  ensureName = fn => {
    if (isDev && !fn.displayName && !fn.name && debug.enabled) {
      // eslint-disable-next-line no-console
      console.trace(
        "WARNING: you've added a function with no name as an argDataGenerator, doing so may make debugging more challenging"
      );
    }
  };
}

export default function makeNewBuild(builder: SchemaBuilder): { ...Build } {
  const allTypes = {};

  // Every object type gets fieldData associated with each of its
  // fields.

  // When a field is defined, it may add to this field data.

  // When something resolves referencing this type, the resolver may
  // request the fieldData, e.g. to perform optimisations.

  // fieldData is an object whose keys are the fields on this
  // GraphQLObjectType and whose values are an object (whose keys are
  // arbitrary namespaced keys and whose values are arrays of
  // information of this kind)
  const fieldDataGeneratorsByFieldNameByType = new Map();
  const fieldArgDataGeneratorsByFieldNameByType = new Map();

  return {
    graphileBuildVersion: version,
    graphql,
    parseResolveInfo,
    simplifyParsedResolveInfoFragmentWithType,
    getSafeAliasFromAlias,
    getAliasFromResolveInfo: getSafeAliasFromResolveInfo, // DEPRECATED: do not use this!
    getSafeAliasFromResolveInfo,
    resolveAlias(data, _args, _context, resolveInfo) {
      const alias = getSafeAliasFromResolveInfo(resolveInfo);
      return data[alias];
    },
    addType(type: GraphQLNamedType): void {
      if (!type.name) {
        throw new Error(
          `addType must only be called with named types, try using require('graphql').getNamedType`
        );
      }
      if (allTypes[type.name] && allTypes[type.name] !== type) {
        throw new Error(`There's already a type with the name: ${type.name}`);
      }
      allTypes[type.name] = type;
    },
    getTypeByName(typeName) {
      return allTypes[typeName];
    },
    extend,
    newWithHooks<T: GraphQLNamedType | GraphQLSchema, ConfigType: *>(
      Type: Class<T>,
      spec: ConfigType,
      inScope: Scope,
      returnNullOnInvalid = false
    ): ?T {
      const scope = inScope || {};
      if (!inScope) {
        // eslint-disable-next-line no-console
        console.warn(
          `No scope was provided to new ${Type.name}[name=${
            spec.name
          }], it's highly recommended that you add a scope so other hooks can easily reference your object - please check usage of 'newWithHooks'. To mute this message, just pass an empty object.`
        );
      }
      if (!Type) {
        throw new Error("No type specified!");
      }
      if (!this.newWithHooks || !Object.isFrozen(this)) {
        throw new Error(
          "Please do not generate the schema during the build building phase, use 'init' instead"
        );
      }
      const fieldDataGeneratorsByFieldName = {};
      const fieldArgDataGeneratorsByFieldName = {};
      let newSpec = spec;
      if (
        knownTypes.indexOf(Type) === -1 &&
        knownTypeNames.indexOf(Type.name) >= 0
      ) {
        throw new Error(
          `GraphQL conflict for '${
            Type.name
          }' detected! Multiple versions of graphql exist in your node_modules?`
        );
      }
      if (Type === GraphQLSchema) {
        newSpec = builder.applyHooks(this, "GraphQLSchema", newSpec, {
          type: "GraphQLSchema",
          scope,
        });
      } else if (Type === GraphQLObjectType) {
        const addDataGeneratorForField = (
          fieldName,
          fn: DataGeneratorFunction
        ) => {
          fn.displayName =
            fn.displayName ||
            `${getNameFromType(Self)}:${fieldName}[${fn.name || "anonymous"}]`;
          fieldDataGeneratorsByFieldName[fieldName] =
            fieldDataGeneratorsByFieldName[fieldName] || [];
          fieldDataGeneratorsByFieldName[fieldName].push(fn);
        };
        const recurseDataGeneratorsForField = fieldName => {
          const fn = (parsedResolveInfoFragment, ReturnType, ...rest) => {
            const { args } = parsedResolveInfoFragment;
            const { fields } = this.simplifyParsedResolveInfoFragmentWithType(
              parsedResolveInfoFragment,
              ReturnType
            );
            const results = [];
            const StrippedType: GraphQLNamedType = getNamedType(ReturnType);
            const fieldDataGeneratorsByFieldName = fieldDataGeneratorsByFieldNameByType.get(
              StrippedType
            );
            const argDataGeneratorsForSelfByFieldName = fieldArgDataGeneratorsByFieldNameByType.get(
              Self
            );
            if (argDataGeneratorsForSelfByFieldName) {
              const argDataGenerators =
                argDataGeneratorsForSelfByFieldName[fieldName];
              for (const gen of argDataGenerators) {
                const local = ensureArray(gen(args, ReturnType, ...rest));
                if (local) {
                  results.push(...local);
                }
              }
            }
            if (
              fieldDataGeneratorsByFieldName &&
              isCompositeType(StrippedType) &&
              !isAbstractType(StrippedType)
            ) {
              const typeFields = StrippedType.getFields();
              for (const alias of Object.keys(fields)) {
                const field = fields[alias];
                // Run generators with `field` as the `parsedResolveInfoFragment`, pushing results to `results`
                const gens = fieldDataGeneratorsByFieldName[field.name];
                if (gens) {
                  for (const gen of gens) {
                    const local = ensureArray(
                      gen(field, typeFields[field.name].type, ...rest)
                    );
                    if (local) {
                      results.push(...local);
                    }
                  }
                }
              }
            }
            return results;
          };
          fn.displayName = `recurseDataGeneratorsForField(${getNameFromType(
            Self
          )}:${fieldName})`;
          addDataGeneratorForField(fieldName, fn);
          // get type from field, get
        };

        const commonContext = {
          type: "GraphQLObjectType",
          scope,
        };
        newSpec = builder.applyHooks(
          this,
          "GraphQLObjectType",
          newSpec,
          Object.assign({}, commonContext, {
            addDataGeneratorForField,
            recurseDataGeneratorsForField,
          }),
          `|${newSpec.name}`
        );

        const rawSpec = newSpec;
        newSpec = Object.assign({}, newSpec, {
          interfaces: () => {
            const interfacesContext = Object.assign({}, commonContext, {
              Self,
              GraphQLObjectType: rawSpec,
            });
            let rawInterfaces = rawSpec.interfaces || [];
            if (typeof rawInterfaces === "function") {
              rawInterfaces = rawInterfaces(interfacesContext);
            }
            return builder.applyHooks(
              this,
              "GraphQLObjectType:interfaces",
              rawInterfaces,
              interfacesContext,
              `|${getNameFromType(Self)}`
            );
          },
          fields: () => {
            const processedFields = [];
            const fieldsContext = Object.assign({}, commonContext, {
              addDataGeneratorForField,
              recurseDataGeneratorsForField,
              Self,
              GraphQLObjectType: rawSpec,
              fieldWithHooks: ((fieldName, spec, fieldScope) => {
                if (!isString(fieldName)) {
                  throw new Error(
                    "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is current necessary."
                  );
                }
                if (!fieldScope) {
                  throw new Error(
                    "All calls to `fieldWithHooks` must specify a `fieldScope` " +
                      "argument that gives additional context about the field so " +
                      "that further plugins may more easily understand the field. " +
                      "Keys within this object should contain the phrase 'field' " +
                      "since they will be merged into the parent objects scope and " +
                      "are not allowed to clash. If you really have no additional " +
                      "information to give, please just pass `{}`."
                  );
                }

                let argDataGenerators = [];
                fieldArgDataGeneratorsByFieldName[
                  fieldName
                ] = argDataGenerators;

                let newSpec = spec;
                let context = Object.assign({}, commonContext, {
                  Self,
                  addDataGenerator(fn) {
                    return addDataGeneratorForField(fieldName, fn);
                  },
                  addArgDataGenerator(fn) {
                    ensureName(fn);
                    argDataGenerators.push(fn);
                  },
                  getDataFromParsedResolveInfoFragment: (
                    parsedResolveInfoFragment,
                    ReturnType
                  ): DataForType => {
                    const Type: GraphQLNamedType = getNamedType(ReturnType);
                    const data = {};

                    const {
                      fields,
                      args,
                    } = this.simplifyParsedResolveInfoFragmentWithType(
                      parsedResolveInfoFragment,
                      ReturnType
                    );

                    // Args -> argDataGenerators
                    for (const gen of argDataGenerators) {
                      try {
                        mergeData(data, gen, ReturnType, args);
                      } catch (e) {
                        debug(
                          "Failed to execute argDataGenerator '%s' on %s of %s",
                          gen.displayName || gen.name || "anonymous",
                          fieldName,
                          getNameFromType(Self)
                        );
                        throw e;
                      }
                    }

                    // finalSpec.type -> fieldData
                    if (!finalSpec) {
                      throw new Error(
                        "It's too early to call this! Call from within resolve"
                      );
                    }
                    const fieldDataGeneratorsByFieldName = fieldDataGeneratorsByFieldNameByType.get(
                      Type
                    );
                    if (
                      fieldDataGeneratorsByFieldName &&
                      isCompositeType(Type) &&
                      !isAbstractType(Type)
                    ) {
                      const typeFields = Type.getFields();
                      for (const alias of Object.keys(fields)) {
                        const field = fields[alias];
                        const gens = fieldDataGeneratorsByFieldName[field.name];
                        if (gens) {
                          const FieldReturnType = typeFields[field.name].type;
                          for (const gen of gens) {
                            mergeData(data, gen, FieldReturnType, field);
                          }
                        }
                      }
                    }
                    return data;
                  },
                  scope: extend(
                    extend(
                      scope,
                      {
                        fieldName,
                      },
                      `Within context for GraphQLObjectType '${rawSpec.name}'`
                    ),
                    fieldScope,
                    `Extending scope for field '${fieldName}' within context for GraphQLObjectType '${
                      rawSpec.name
                    }'`
                  ),
                });
                if (typeof newSpec === "function") {
                  newSpec = newSpec(context);
                }
                newSpec = builder.applyHooks(
                  this,
                  "GraphQLObjectType:fields:field",
                  newSpec,
                  context,
                  `|${getNameFromType(Self)}.fields.${fieldName}`
                );
                newSpec.args = newSpec.args || {};
                newSpec = Object.assign({}, newSpec, {
                  args: builder.applyHooks(
                    this,
                    "GraphQLObjectType:fields:field:args",
                    newSpec.args,
                    Object.assign({}, context, {
                      field: newSpec,
                      returnType: newSpec.type,
                    }),
                    `|${getNameFromType(Self)}.fields.${fieldName}`
                  ),
                });
                const finalSpec = newSpec;
                processedFields.push(finalSpec);
                return finalSpec;
              }: FieldWithHooksFunction),
            });
            let rawFields = rawSpec.fields || {};
            if (typeof rawFields === "function") {
              rawFields = rawFields(fieldsContext);
            }
            const fieldsSpec = builder.applyHooks(
              this,
              "GraphQLObjectType:fields",
              rawFields,
              fieldsContext,
              `|${rawSpec.name}`
            );
            // Finally, check through all the fields that they've all been processed; any that have not we should do so now.
            for (const fieldName in fieldsSpec) {
              const fieldSpec = fieldsSpec[fieldName];
              if (processedFields.indexOf(fieldSpec) < 0) {
                // We've not processed this yet; process it now!
                fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                  fieldName,
                  fieldSpec,
                  {
                    autoField: true, // We don't have any additional information
                  }
                );
              }
            }
            return fieldsSpec;
          },
        });
      } else if (Type === GraphQLInputObjectType) {
        const commonContext = {
          type: "GraphQLInputObjectType",
          scope,
        };
        newSpec = builder.applyHooks(
          this,
          "GraphQLInputObjectType",
          newSpec,
          commonContext,
          `|${newSpec.name}`
        );
        newSpec.fields = newSpec.fields || {};

        const rawSpec = newSpec;
        newSpec = Object.assign({}, newSpec, {
          fields: () => {
            const processedFields = [];
            const fieldsContext = Object.assign({}, commonContext, {
              Self,
              GraphQLInputObjectType: rawSpec,
              fieldWithHooks: ((fieldName, spec, fieldScope = {}) => {
                if (!isString(fieldName)) {
                  throw new Error(
                    "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is current necessary."
                  );
                }
                let context = Object.assign({}, commonContext, {
                  Self,
                  scope: extend(
                    extend(
                      scope,
                      {
                        fieldName,
                      },
                      `Within context for GraphQLInputObjectType '${
                        rawSpec.name
                      }'`
                    ),
                    fieldScope,
                    `Extending scope for field '${fieldName}' within context for GraphQLInputObjectType '${
                      rawSpec.name
                    }'`
                  ),
                });
                let newSpec = spec;
                if (typeof newSpec === "function") {
                  newSpec = newSpec(context);
                }
                newSpec = builder.applyHooks(
                  this,
                  "GraphQLInputObjectType:fields:field",
                  newSpec,
                  context,
                  `|${getNameFromType(Self)}.fields.${fieldName}`
                );
                const finalSpec = newSpec;
                processedFields.push(finalSpec);
                return finalSpec;
              }: InputFieldWithHooksFunction),
            });
            let rawFields = rawSpec.fields;
            if (typeof rawFields === "function") {
              rawFields = rawFields(fieldsContext);
            }
            const fieldsSpec = builder.applyHooks(
              this,
              "GraphQLInputObjectType:fields",
              rawFields,
              fieldsContext,
              `|${getNameFromType(Self)}`
            );
            // Finally, check through all the fields that they've all been processed; any that have not we should do so now.
            for (const fieldName in fieldsSpec) {
              const fieldSpec = fieldsSpec[fieldName];
              if (processedFields.indexOf(fieldSpec) < 0) {
                // We've not processed this yet; process it now!
                fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                  fieldName,
                  fieldSpec,
                  {
                    autoField: true, // We don't have any additional information
                  }
                );
              }
            }
            return fieldsSpec;
          },
        });
      } else if (Type === GraphQLEnumType) {
        const commonContext = {
          type: "GraphQLEnumType",
          scope,
        };
        newSpec = builder.applyHooks(
          this,
          "GraphQLEnumType",
          newSpec,
          commonContext,
          `|${newSpec.name}`
        );

        newSpec.values = builder.applyHooks(
          this,
          "GraphQLEnumType:values",
          newSpec.values,
          commonContext,
          `|${newSpec.name}`
        );
        const values = newSpec.values;
        newSpec.values = Object.keys(values).reduce((memo, valueKey) => {
          const value = values[valueKey];
          const newValue = builder.applyHooks(
            this,
            "GraphQLEnumType:values:value",
            value,
            commonContext,
            `|${newSpec.name}|${valueKey}`
          );
          memo[valueKey] = newValue;
          return memo;
        }, {});
      }
      const finalSpec: ConfigType = newSpec;

      const Self: T = new Type(finalSpec);
      if (!(Self instanceof GraphQLSchema) && returnNullOnInvalid) {
        try {
          if (
            Self instanceof GraphQLInterfaceType ||
            Self instanceof GraphQLObjectType ||
            Self instanceof GraphQLInputObjectType
          ) {
            const _Self:
              | GraphQLInterfaceType
              | GraphQLInputObjectType
              | GraphQLObjectType = Self;
            if (typeof _Self.getFields === "function") {
              const fields = _Self.getFields();
              if (Object.keys(fields).length === 0) {
                // We require there's at least one field on GraphQLObjectType and GraphQLInputObjectType records
                return null;
              }
            }
          }
        } catch (e) {
          // This is the error we're expecting to handle:
          // https://github.com/graphql/graphql-js/blob/831598ba76f015078ecb6c5c1fbaf133302f3f8e/src/type/definition.js#L526-L531
          const isProbablyAnEmptyObjectError = !!e.message.match(
            /function which returns such an object/
          );
          if (!isProbablyAnEmptyObjectError) {
            this.swallowError(e);
          }
          return null;
        }
      }

      if (finalSpec.name) {
        if (allTypes[finalSpec.name]) {
          throw new Error(
            `Type '${finalSpec.name}' has already been registered!`
          );
        }
        allTypes[finalSpec.name] = Self;
      }
      fieldDataGeneratorsByFieldNameByType.set(
        Self,
        fieldDataGeneratorsByFieldName
      );
      fieldArgDataGeneratorsByFieldNameByType.set(
        Self,
        fieldArgDataGeneratorsByFieldName
      );
      return Self;
    },
    fieldDataGeneratorsByType: fieldDataGeneratorsByFieldNameByType, // @deprecated
    fieldDataGeneratorsByFieldNameByType,
    fieldArgDataGeneratorsByFieldNameByType,
    inflection: {
      pluralize,
      singularize: pluralize.singular,
      upperCamelCase,
      camelCase,
      constantCase,
    },
    swallowError,
  };
}
