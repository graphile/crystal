import * as graphql from "graphql";
import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
  getAliasFromResolveInfo as rawGetAliasFromResolveInfo,
} from "graphql-parse-resolve-info";
import debugFactory from "debug";
import { ResolveTree } from "graphql-parse-resolve-info";
import pluralize = require("pluralize");
import LRU from "@graphile/lru";
import * as semver from "semver";
import { upperCamelCase, camelCase, constantCase } from "./utils";
import swallowError from "./swallowError";
import resolveNode from "./resolveNode";
import { LiveCoordinator } from "./Live";

import SchemaBuilder, {
  BuildBase,
  ResolvedLookAhead,
  ContextGraphQLSchema,
  ContextGraphQLUnionType,
  ContextGraphQLUnionTypeTypes,
  GraphileUnionTypeConfig,
  ContextGraphQLEnumType,
  ContextGraphQLInputObjectType,
  ContextGraphQLInputObjectTypeFields,
  ContextGraphQLInputObjectTypeFieldsField,
  ContextGraphQLObjectTypeInterfaces,
  ContextGraphQLObjectType,
  ContextGraphQLObjectTypeFields,
  GraphileObjectTypeConfig,
  ContextGraphQLObjectTypeBase,
  ContextGraphQLObjectTypeFieldsField,
  ContextGraphQLObjectTypeFieldsFieldArgs,
  ScopeGraphQLObjectTypeFieldsField,
  ScopeGraphQLInputObjectTypeFieldsField,
  ArgDataGeneratorFunction,
  DataGeneratorFunction,
  Build,
} from "./SchemaBuilder";

import extend, { indent } from "./extend";
import chalk from "chalk";
import { createHash } from "crypto";

// @ts-ignore
import { version } from "../package.json";

const makeInitialInflection = () => ({
  pluralize,
  singularize: pluralize.singular,
  upperCamelCase,
  camelCase,
  constantCase,

  /**
   * Built-in names (allows you to override these in the output schema)
   *
   * e.g.:
   *
   * graphile-build:
   *
   * - Query
   * - Mutation
   * - Subscription
   * - Node
   * - PageInfo
   *
   * graphile-build-pg:
   *
   * - Interval
   * - BigInt
   * - BigFloat
   * - BitString
   * - Point
   * - Date
   * - Datetime
   * - Time
   * - JSON
   * - UUID
   * - InternetAddress
   *
   * Other plugins may add their own builtins too; try and avoid conflicts!
   */
  builtin: (name: string): string => name,

  /**
   *  When converting a query field to a subscription (live query) field, this allows you to rename it
   */
  live: name => name,

  /**
   * Try and make something a valid GraphQL 'Name'.
   *
   * Name is defined in GraphQL to match this regexp:
   *
   * /^[_A-Za-z][_0-9A-Za-z]*$/
   *
   * See: https://graphql.github.io/graphql-spec/June2018/#sec-Appendix-Grammar-Summary.Lexical-Tokens
   */
  coerceToGraphQLName: (name: string) => {
    let resultingName = name;

    /*
     * If our 'name' starts with a digit, we must prefix it with
     * something. We'll just use an underscore.
     */
    if (resultingName.match(/^[0-9]/)) {
      resultingName = "_" + resultingName;
    }

    /*
     * Fields beginning with two underscores are reserved by the GraphQL
     * introspection systems, trim to just one.
     */
    resultingName = resultingName.replace(/^__+/g, "_");

    return resultingName;
  },
});

export type InflectionBase = ReturnType<typeof makeInitialInflection>;

let recurseDataGeneratorsForFieldWarned = false;

const isString = str => typeof str === "string";
const isDev = ["test", "development"].indexOf(process.env.NODE_ENV || "") >= 0;
const debug = debugFactory("graphile-build");

/*
 * This should be more than enough for normal usage. If you come under a
 * sophisticated attack then the attacker can empty this of useful values (with
 * a lot of work) but because we use SHA1 hashes under the covers the aliases
 * will still be consistent even after the LRU cache is exhausted. And SHA1 can
 * produce half a million hashes per second on my machine, the LRU only gives
 * us a 10x speedup!
 */
const hashCache = new LRU({ maxLength: 100000 });

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

type FieldSpec = graphql.GraphQLFieldConfig<any, any>;

export type GetDataFromParsedResolveInfoFragmentFunction = (
  parsedResolveInfoFragment: ResolveTree,
  Type: graphql.GraphQLOutputType
) => ResolvedLookAhead;

export type FieldWithHooksFunction = (
  fieldName: string,
  spec:
    | FieldSpec
    | ((context: ContextGraphQLObjectTypeFieldsField) => FieldSpec),
  fieldScope: Omit<ScopeGraphQLObjectTypeFieldsField, "fieldName">
) => graphql.GraphQLFieldConfig<any, any>;

export type InputFieldWithHooksFunction = (
  fieldName: string,
  spec:
    | graphql.GraphQLInputFieldConfig
    | ((
        ContextGraphQLInputObjectTypeFieldsField
      ) => graphql.GraphQLInputFieldConfig),
  fieldScope: Omit<ScopeGraphQLInputObjectTypeFieldsField, "fieldName">
) => graphql.GraphQLInputFieldConfig;

function getNameFromType(
  Type: graphql.GraphQLNamedType | graphql.GraphQLSchema
) {
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
  GraphQLUnionType,
  getNamedType,
  isCompositeType,
  isAbstractType,
} = graphql;

function mergeData(
  data: ResolvedLookAhead,
  gen: DataGeneratorFunction,
  ReturnType: graphql.GraphQLOutputType,
  arg: ResolveTree
): void;
function mergeData(
  data: ResolvedLookAhead,
  gen: ArgDataGeneratorFunction,
  ReturnType: graphql.GraphQLOutputType,
  arg: { [fieldName: string]: unknown }
): void;
function mergeData(
  data: ResolvedLookAhead,
  gen: DataGeneratorFunction | ArgDataGeneratorFunction,
  ReturnType: graphql.GraphQLOutputType,
  arg: any
): void {
  const results: Array<ResolvedLookAhead> | void = ensureArray<
    ResolvedLookAhead
  >(gen(arg, ReturnType, data));

  if (!results) {
    return;
  }
  for (
    let resultIndex = 0, resultCount = results.length;
    resultIndex < resultCount;
    resultIndex++
  ) {
    const result: ResolvedLookAhead = results[resultIndex];
    const keys = Object.keys(result);
    for (let i = 0, l = keys.length; i < l; i++) {
      const k = keys[i];
      data[k] = data[k] || [];
      const value: unknown = result[k];
      const newData: Array<unknown> | void = ensureArray<unknown>(value);
      if (newData) {
        data[k].push(...newData);
      }
    }
  }
}

const knownTypes = [
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLUnionType,
];

const knownTypeNames = knownTypes.map(k => k.name);

/**
 * In v4 if you're not using TypeScript we allow users to return arrays of the
 * valid LookAheadData types from data generator functions. We don't really
 * want this; but alas it was in 4.0.0, so we must support it... At least until
 * v5.
 *
 * TODO:v5: remove this!
 */
function ensureArray<T>(val: null | T | Array<T>): void | Array<T> {
  if (val == null) {
    return;
  } else if (Array.isArray(val)) {
    return val;
  } else {
    return [val];
  }
}

// eslint-disable-next-line no-unused-vars
let ensureName = _fn => {};
if (["development", "test"].indexOf(process.env.NODE_ENV || "") >= 0) {
  ensureName = fn => {
    // $FlowFixMe: displayName
    if (isDev && !fn.displayName && !fn.name && debug.enabled) {
      // eslint-disable-next-line no-console
      console.trace(
        "WARNING: you've added a function with no name as an argDataGenerator, doing so may make debugging more challenging"
      );
    }
  };
}

export default function makeNewBuild(builder: SchemaBuilder): BuildBase {
  const allTypes = {
    Int: graphql.GraphQLInt,
    Float: graphql.GraphQLFloat,
    String: graphql.GraphQLString,
    Boolean: graphql.GraphQLBoolean,
    ID: graphql.GraphQLID,
  };

  const allTypesSources = {
    Int: "GraphQL Built-in",
    Float: "GraphQL Built-in",
    String: "GraphQL Built-in",
    Boolean: "GraphQL Built-in",
    ID: "GraphQL Built-in",
  };

  // Every object type gets fieldData associated with each of its
  // fields.

  // When a field is defined, it may add to this field data.

  // When something resolves referencing this type, the resolver may
  // request the fieldData, e.g. to perform optimisations.

  // fieldData is an object whose keys are the fields on this
  // GraphQLObjectType and whose values are an object (whose keys are
  // arbitrary namespaced keys and whose values are arrays of
  // information of this kind)
  const fieldDataGeneratorsByFieldNameByType = new Map<
    graphql.GraphQLNamedType,
    { [fieldName: string]: DataGeneratorFunction[] }
  >();
  const fieldArgDataGeneratorsByFieldNameByType = new Map<
    graphql.GraphQLNamedType,
    { [fieldName: string]: ArgDataGeneratorFunction[] }
  >();

  const newWithHooks: any = function newWithHooks<
    T extends
      | graphql.GraphQLSchema
      | graphql.GraphQLScalarType
      | graphql.GraphQLObjectType
      | graphql.GraphQLInterfaceType
      | graphql.GraphQLUnionType
      | graphql.GraphQLEnumType
      | graphql.GraphQLInputObjectType
  >(
    this: Build,
    Type: { new (...args: any[]): T },
    spec: any,
    inScope: any,
    performNonEmptyFieldsCheck: boolean
  ): T | null | undefined {
    const scope = inScope || {};
    if (!inScope) {
      // eslint-disable-next-line no-console
      console.warn(
        `No scope was provided to new ${Type.name}[name=${spec.name}], it's highly recommended that you add a scope so other hooks can easily reference your object - please check usage of 'newWithHooks'. To mute this message, just pass an empty object.`
      );
    }
    if (!Type) {
      throw new Error("No type specified!");
    }
    if (!this.newWithHooks) {
      throw new Error(
        "Please do not generate the schema during the build building phase, use 'init' instead"
      );
    }
    const fieldDataGeneratorsByFieldName: {
      [fieldName: string]: DataGeneratorFunction[];
    } = {};
    const fieldArgDataGeneratorsByFieldName: {
      [fieldName: string]: ArgDataGeneratorFunction[];
    } = {};
    let newSpec = spec;
    if (
      knownTypes.indexOf(Type as any) === -1 &&
      knownTypeNames.indexOf(Type.name) >= 0
    ) {
      throw new Error(
        `GraphQL conflict for '${Type.name}' detected! Multiple versions of graphql exist in your node_modules?`
      );
    }
    if (Type === GraphQLSchema) {
      const context: ContextGraphQLSchema = {
        type: "GraphQLSchema",
        scope,
      };
      newSpec = builder.applyHooks(
        this,
        "GraphQLSchema",
        (newSpec as unknown) as graphql.GraphQLSchemaConfig,
        context
      );
    } else if (Type === GraphQLObjectType) {
      const addDataGeneratorForField = (
        fieldName: string,
        fn: DataGeneratorFunction
      ): void => {
        // $FlowFixMe: displayName
        fn.displayName =
          // $FlowFixMe: displayName
          fn.displayName ||
          `${getNameFromType(Self)}:${fieldName}[${fn.name || "anonymous"}]`;
        fieldDataGeneratorsByFieldName[fieldName] =
          fieldDataGeneratorsByFieldName[fieldName] || [];
        fieldDataGeneratorsByFieldName[fieldName].push(fn);
      };
      const recurseDataGeneratorsForField = (
        fieldName: string,
        iKnowWhatIAmDoing?: boolean
      ): void => {
        /*
         * Recursing data generators is not safe in general; however there
         * are certain exceptions - for example when you know there are no
         * "dynamic" data generator fields - e.g. where the GraphQL alias is
         * not used at all. In PostGraphile the only case of this is the
         * PageInfo object as none of the fields accept arguments, and they
         * do not rely on the GraphQL query alias to store the result.
         */
        if (!iKnowWhatIAmDoing && !recurseDataGeneratorsForFieldWarned) {
          recurseDataGeneratorsForFieldWarned = true;
          // eslint-disable-next-line no-console
          console.error(
            "Use of `recurseDataGeneratorsForField` is NOT SAFE. e.g. `{n1: node { a: field1 }, n2: node { a: field2 } }` cannot resolve correctly."
          );
        }
        const fn: DataGeneratorFunction = (
          parsedResolveInfoFragment,
          ReturnType,
          data,
          ...rest
        ) => {
          const { args } = parsedResolveInfoFragment;
          const { fields } = this.simplifyParsedResolveInfoFragmentWithType(
            parsedResolveInfoFragment,
            ReturnType
          );

          const results: any[] = [];
          const StrippedType = getNamedType(ReturnType);
          if (!StrippedType) {
            throw new Error("Could not determine GraphQL type");
          }
          const fieldDataGeneratorsByFieldName = fieldDataGeneratorsByFieldNameByType.get(
            StrippedType
          );

          const argDataGeneratorsForSelfByFieldName = fieldArgDataGeneratorsByFieldNameByType.get(
            Self as graphql.GraphQLObjectType
          );

          if (argDataGeneratorsForSelfByFieldName) {
            const argDataGenerators =
              argDataGeneratorsForSelfByFieldName[fieldName];
            for (
              let genIndex = 0, genCount = argDataGenerators.length;
              genIndex < genCount;
              genIndex++
            ) {
              const gen = argDataGenerators[genIndex];
              const local = ensureArray(gen(args, ReturnType, data, ...rest));
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
            const keys = Object.keys(fields);
            for (
              let keyIndex = 0, keyCount = keys.length;
              keyIndex < keyCount;
              keyIndex++
            ) {
              const alias = keys[keyIndex];
              const field = fields[alias];
              // Run generators with `field` as the `parsedResolveInfoFragment`, pushing results to `results`
              const gens = fieldDataGeneratorsByFieldName[field.name];
              if (gens) {
                for (
                  let genIndex = 0, genCount = gens.length;
                  genIndex < genCount;
                  genIndex++
                ) {
                  const gen = gens[genIndex];
                  const local = ensureArray(
                    gen(field, typeFields[field.name].type, data, ...rest)
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

      const commonContext: ContextGraphQLObjectTypeBase = {
        type: "GraphQLObjectType",
        scope,
      };

      const objectSpec: GraphileObjectTypeConfig<any, any> = newSpec;
      const objectContext: ContextGraphQLObjectType = {
        ...commonContext,
        addDataGeneratorForField,
        recurseDataGeneratorsForField,
      };
      newSpec = builder.applyHooks(
        this,
        "GraphQLObjectType",
        objectSpec,
        objectContext,

        `|${newSpec.name}`
      );

      const rawSpec = newSpec;
      newSpec = {
        ...newSpec,
        interfaces: () => {
          const interfacesContext: ContextGraphQLObjectTypeInterfaces = {
            ...commonContext,
            Self: Self as graphql.GraphQLObjectType,
            GraphQLObjectType: rawSpec,
          };

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
          const processedFields: graphql.GraphQLFieldConfig<any, any>[] = [];
          const fieldWithHooks: FieldWithHooksFunction = (
            fieldName,
            spec,
            fieldScope
          ) => {
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

            const argDataGenerators: ArgDataGeneratorFunction[] = [];
            fieldArgDataGeneratorsByFieldName[fieldName] = argDataGenerators;

            let newSpec = spec;
            const context: ContextGraphQLObjectTypeFieldsField = {
              ...commonContext,
              Self: Self as graphql.GraphQLObjectType,
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
              ): ResolvedLookAhead => {
                const Type = getNamedType(ReturnType as graphql.GraphQLType);
                const data: ResolvedLookAhead = {};

                const {
                  fields,
                  args,
                } = this.simplifyParsedResolveInfoFragmentWithType(
                  parsedResolveInfoFragment,
                  ReturnType
                );

                // Args -> argDataGenerators
                for (
                  let dgIndex = 0, dgCount = argDataGenerators.length;
                  dgIndex < dgCount;
                  dgIndex++
                ) {
                  const gen = argDataGenerators[dgIndex];
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
                  const keys = Object.keys(fields);
                  for (
                    let keyIndex = 0, keyCount = keys.length;
                    keyIndex < keyCount;
                    keyIndex++
                  ) {
                    const alias = keys[keyIndex];
                    const field = fields[alias];
                    const gens = fieldDataGeneratorsByFieldName[field.name];
                    if (gens) {
                      const FieldReturnType = typeFields[field.name].type;
                      for (let i = 0, l = gens.length; i < l; i++) {
                        mergeData(data, gens[i], FieldReturnType, field);
                      }
                    }
                  }
                }
                return data;
              },
              scope: extend(
                extend(
                  { ...scope },
                  {
                    fieldName,
                  },

                  `Within context for GraphQLObjectType '${rawSpec.name}'`
                ),

                fieldScope,
                `Extending scope for field '${fieldName}' within context for GraphQLObjectType '${rawSpec.name}'`
              ),
            };

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
            const argsContext: ContextGraphQLObjectTypeFieldsFieldArgs = {
              ...context,
              field: newSpec,
              returnType: newSpec.type,
            };
            newSpec = {
              ...newSpec,
              args: builder.applyHooks(
                this,
                "GraphQLObjectType:fields:field:args",
                newSpec.args,
                argsContext,

                `|${getNameFromType(Self)}.fields.${fieldName}`
              ),
            };

            const finalSpec = newSpec;
            processedFields.push(finalSpec);
            return finalSpec;
          };
          const fieldsContext: ContextGraphQLObjectTypeFields = {
            ...commonContext,
            addDataGeneratorForField,
            recurseDataGeneratorsForField,
            Self: Self as graphql.GraphQLObjectType,
            GraphQLObjectType: rawSpec,
            fieldWithHooks,
          };

          let rawFields = rawSpec.fields || {};
          if (typeof rawFields === "function") {
            rawFields = rawFields(fieldsContext);
          }
          const fieldsSpec = builder.applyHooks(
            this,
            "GraphQLObjectType:fields",
            this.extend(
              {},
              rawFields,
              `Default field included in newWithHooks call for '${
                rawSpec.name
              }'. ${inScope.__origin || ""}`
            ),

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
      };
    } else if (Type === GraphQLInputObjectType) {
      const commonContext: ContextGraphQLInputObjectType = {
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
      newSpec = {
        ...newSpec,
        fields: () => {
          const processedFields: graphql.GraphQLInputFieldConfig[] = [];
          const fieldWithHooks: InputFieldWithHooksFunction = (
            fieldName,
            spec,
            fieldScope = {}
          ) => {
            if (!isString(fieldName)) {
              throw new Error(
                "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is current necessary."
              );
            }
            const context: ContextGraphQLInputObjectTypeFieldsField = {
              ...commonContext,
              Self: Self as graphql.GraphQLInputObjectType,
              scope: extend(
                extend(
                  { ...scope },
                  {
                    fieldName,
                  },

                  `Within context for GraphQLInputObjectType '${rawSpec.name}'`
                ),

                fieldScope,
                `Extending scope for field '${fieldName}' within context for GraphQLInputObjectType '${rawSpec.name}'`
              ),
            };

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
          };
          const fieldsContext: ContextGraphQLInputObjectTypeFields = {
            ...commonContext,
            Self: Self as graphql.GraphQLInputObjectType,
            GraphQLInputObjectType: rawSpec,
            fieldWithHooks,
          };

          let rawFields = rawSpec.fields;
          if (typeof rawFields === "function") {
            rawFields = rawFields(fieldsContext);
          }
          const fieldsList: typeof rawFields = this.extend(
            {},
            rawFields,
            `Default field included in newWithHooks call for '${
              rawSpec.name
            }'. ${inScope.__origin || ""}`
          );
          const fieldsSpec = builder.applyHooks(
            this,
            "GraphQLInputObjectType:fields",
            fieldsList,
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
      };
    } else if (Type === GraphQLEnumType) {
      const commonContext: ContextGraphQLEnumType = {
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
    } else if (Type === GraphQLUnionType) {
      const commonContext: ContextGraphQLUnionType = {
        type: "GraphQLUnionType",
        scope,
      };

      newSpec = builder.applyHooks(
        this,
        "GraphQLUnionType",
        newSpec,
        { ...commonContext },
        `|${newSpec.name}`
      );

      const rawSpec = newSpec as GraphileUnionTypeConfig<any, any>;
      newSpec = {
        ...newSpec,
        types: () => {
          const typesContext: ContextGraphQLUnionTypeTypes = {
            ...commonContext,
            Self: Self as graphql.GraphQLUnionType,
            GraphQLUnionType: rawSpec,
          };

          let rawTypes = rawSpec.types || [];
          if (typeof rawTypes === "function") {
            rawTypes = rawTypes(typesContext);
          }
          return builder.applyHooks(
            this,
            "GraphQLUnionType:types",
            rawTypes,
            typesContext,
            `|${getNameFromType(Self)}`
          );
        },
      };
    }

    const finalSpec = newSpec;

    const Self: T = new Type(finalSpec);
    if (graphql.isNamedType(Self) && performNonEmptyFieldsCheck) {
      try {
        if (
          Self instanceof GraphQLInterfaceType ||
          Self instanceof GraphQLObjectType ||
          Self instanceof GraphQLInputObjectType
        ) {
          if (typeof Self.getFields === "function") {
            const fields = Self.getFields();
            if (Object.keys(fields).length === 0) {
              // We require there's at least one field on GraphQLObjectType and GraphQLInputObjectType records
              return null;
            }
          }
        }
      } catch (e) {
        // This is the error we're expecting to handle:
        // https://github.com/graphql/graphql-js/blob/831598ba76f015078ecb6c5c1fbaf133302f3f8e/src/type/definition.js#L526-L531
        if (inScope && inScope.isRootQuery) {
          throw e;
        }
        const isProbablyAnEmptyObjectError = !!e.message.match(
          /function which returns such an object/
        );

        if (!isProbablyAnEmptyObjectError) {
          this.swallowError(e);
        }
        return null;
      }
    }

    if (graphql.isNamedType(Self)) {
      this.scopeByType.set(Self, scope);
    }

    if (graphql.isNamedType(Self)) {
      this.addType(
        Self,
        scope.__origin ||
          (this
            ? `'newWithHooks' call during hook '${this.status.currentHookName}'`
            : null)
      );
    }
    if (Type !== GraphQLSchema) {
      fieldDataGeneratorsByFieldNameByType.set(
        Self as graphql.GraphQLNamedType,
        fieldDataGeneratorsByFieldName
      );

      fieldArgDataGeneratorsByFieldNameByType.set(
        Self as graphql.GraphQLNamedType,
        fieldArgDataGeneratorsByFieldName
      );
    }

    return Self;
  };

  return {
    options: builder.options,
    graphileBuildVersion: version,
    versions: {
      graphql: require("graphql/package.json").version,
      "graphile-build": version,
    },

    hasVersion(
      packageName: string,
      range: string,
      options: { includePrerelease?: boolean } = { includePrerelease: true }
    ): boolean {
      const packageVersion = this.versions[packageName];
      if (!packageVersion) return false;
      return semver.satisfies(packageVersion, range, options);
    },
    graphql,

    _pluginMeta: {},

    parseResolveInfo,
    simplifyParsedResolveInfoFragmentWithType,
    getSafeAliasFromAlias,
    ...({ getAliasFromResolveInfo: getSafeAliasFromResolveInfo } as {}), // DEPRECATED: do not use this!
    getSafeAliasFromResolveInfo,
    resolveAlias(data, _args, _context, resolveInfo) {
      const alias = getSafeAliasFromResolveInfo(resolveInfo);
      return data[alias];
    },
    addType(
      type: graphql.GraphQLNamedType,
      origin?: string | null | undefined
    ): void {
      if (!type.name) {
        throw new Error(
          `addType must only be called with named types, try using require('graphql').getNamedType`
        );
      }
      const newTypeSource =
        origin ||
        // 'this' is typically only available after the build is finalized
        (this
          ? `'addType' call during hook '${this.status.currentHookName}'`
          : null);
      if (allTypes[type.name]) {
        if (allTypes[type.name] !== type) {
          const oldTypeSource = allTypesSources[type.name];
          const firstEntityDetails = !oldTypeSource
            ? "The first type was registered from an unknown origin."
            : `The first entity was:\n\n${indent(
                chalk.magenta(oldTypeSource)
              )}`;
          const secondEntityDetails = !newTypeSource
            ? "The second type was registered from an unknown origin."
            : `The second entity was:\n\n${indent(
                chalk.yellow(newTypeSource)
              )}`;
          throw new Error(
            `A type naming conflict has occurred - two entities have tried to define the same type '${chalk.bold(
              type.name
            )}'.\n\n${indent(firstEntityDetails)}\n\n${indent(
              secondEntityDetails
            )}`
          );
        }
      } else {
        allTypes[type.name] = type;
        allTypesSources[type.name] = newTypeSource;
      }
    },
    getTypeByName(typeName) {
      return allTypes[typeName];
    },
    extend,

    newWithHooks,

    /**
     * @deprecated
     */
    fieldDataGeneratorsByType: fieldDataGeneratorsByFieldNameByType,

    fieldDataGeneratorsByFieldNameByType,
    fieldArgDataGeneratorsByFieldNameByType,
    scopeByType: new Map(),

    inflection: makeInitialInflection(),

    swallowError,
    // resolveNode: EXPERIMENTAL, API might change!
    resolveNode,
    status: {
      currentHookName: null,
      currentHookEvent: null,
    },

    liveCoordinator: new LiveCoordinator(),
  };
}
