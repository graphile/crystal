import debugFactory from "debug";
import {
  crystalWrapResolve,
  makeCrystalSubscriber,
  objectFieldSpec,
} from "graphile-crystal";
import type {
  GraphQLFieldConfig,
  GraphQLNamedType,
  GraphQLSchemaConfig,
} from "graphql";
import { isNamedType } from "graphql";
import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLUnionType,
} from "graphql";

import type { ScopeForType, SpecForType } from "../global";
import type SchemaBuilder from "../SchemaBuilder";

const recurseDataGeneratorsForFieldWarned = false;

const isString = (str: unknown): str is string => typeof str === "string";
const debug = debugFactory("graphile-build");

function getNameFromType(Type: GraphQLNamedType | GraphQLSchema) {
  if (Type instanceof GraphQLSchema) {
    return "schema";
  } else {
    return Type.name;
  }
}

const knownTypes = [
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLScalarType,
];

const knownTypeNames = knownTypes.map((k) => k.name);

interface MakeNewWithHooksOptions {
  builder: SchemaBuilder<any>;
}

export type NewWithHooksFunction = <
  TType extends GraphQLNamedType | GraphQLSchema,
>(
  build: GraphileEngine.Build,
  klass: { new (spec: SpecForType<TType>): TType },
  spec: SpecForType<TType>,
  scope: ScopeForType<TType>,
) => TType;

export function makeNewWithHooks({ builder }: MakeNewWithHooksOptions): {
  newWithHooks: NewWithHooksFunction;
} {
  const newWithHooks: NewWithHooksFunction = function newWithHooks(
    build,
    Type,
    inSpec,
    inScope,
  ) {
    if (!inScope) {
      // eslint-disable-next-line no-console
      console.warn(
        `No scope was provided to new ${Type.name}${
          "name" in inSpec ? `[name=${inSpec.name}]` : ``
        }, it's highly recommended that you add a scope so other hooks can easily reference your object - please check usage of 'newWithHooks'. To mute this message, just pass an empty object.`,
      );
    }

    if (!Type) {
      throw new Error("No type specified!");
    }

    if (
      knownTypes.indexOf(Type as any) === -1 &&
      knownTypeNames.indexOf(Type.name) >= 0
    ) {
      throw new Error(
        `GraphQL conflict for '${Type.name}' detected! Multiple versions of graphql exist in your node_` +
          /* yarn doctor */ `modules?`,
      );
    }

    const Result = (() => {
      switch (Type) {
        case GraphQLSchema: {
          const rawSpec = inSpec as GraphQLSchemaConfig;
          const scope = (inScope || {}) as GraphileEngine.ScopeGraphQLSchema;
          const context: GraphileEngine.ContextGraphQLSchema = {
            type: "GraphQLSchema",
            scope,
          };
          const finalSpec = builder.applyHooks(
            "GraphQLSchema",
            rawSpec,
            build,
            context,
          );
          const Self = new GraphQLSchema(finalSpec);
          return Self;
        }
        case GraphQLObjectType: {
          const rawSpec = inSpec as GraphileEngine.GraphileObjectTypeConfig<
            any,
            any
          >;
          const scope = (inScope ||
            {}) as GraphileEngine.ScopeGraphQLObjectType;

          const objectContext: GraphileEngine.ContextGraphQLObjectType = {
            type: "GraphQLObjectType",
            scope,
          };

          const baseSpec = builder.applyHooks(
            "GraphQLObjectType",
            rawSpec,
            build,
            objectContext,

            `|${rawSpec.name}`,
          );

          const finalSpec = {
            ...baseSpec,
            interfaces: (): GraphQLInterfaceType[] => {
              const interfacesContext: GraphileEngine.ContextGraphQLObjectTypeInterfaces =
                {
                  ...objectContext,
                  Self,
                };

              let rawInterfaces = rawSpec.interfaces || [];
              if (typeof rawInterfaces === "function") {
                rawInterfaces = rawInterfaces(interfacesContext);
              }
              return builder.applyHooks(
                "GraphQLObjectType:interfaces",
                rawInterfaces,
                build,
                interfacesContext,
                `|${getNameFromType(Self)}`,
              );
            },
            fields: () => {
              const processedFields: GraphQLFieldConfig<any, any>[] = [];
              const fieldWithHooks: GraphileEngine.FieldWithHooksFunction = (
                fieldScope,
                fieldSpec,
              ) => {
                const { fieldName } = fieldScope;
                if (!isString(fieldName)) {
                  throw new Error(
                    "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is current necessary.",
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
                      "information to give, please just pass `{}`.",
                  );
                }

                const fieldContext: GraphileEngine.ContextGraphQLObjectTypeFieldsField =
                  {
                    ...fieldsContext,
                    scope: fieldScope,
                  };

                let finalFieldSpec =
                  typeof fieldSpec === "function"
                    ? fieldSpec(fieldContext)
                    : fieldSpec;
                finalFieldSpec = builder.applyHooks(
                  "GraphQLObjectType:fields:field",
                  objectFieldSpec(finalFieldSpec),
                  build,
                  fieldContext,
                  `|${getNameFromType(Self)}.fields.${fieldName}`,
                );

                finalFieldSpec.args = finalFieldSpec.args || {};
                const argsContext: GraphileEngine.ContextGraphQLObjectTypeFieldsFieldArgs =
                  {
                    ...fieldContext,
                  };
                finalFieldSpec = {
                  ...finalFieldSpec,
                  args: builder.applyHooks(
                    "GraphQLObjectType:fields:field:args",
                    finalFieldSpec.args,
                    build,
                    argsContext,

                    `|${getNameFromType(Self)}.fields.${fieldName}`,
                  ),
                };

                processedFields.push(finalFieldSpec);
                return finalFieldSpec;
              };

              const fieldsContext: GraphileEngine.ContextGraphQLObjectTypeFields =
                {
                  ...objectContext,
                  Self: Self as GraphQLObjectType,
                  fieldWithHooks,
                };

              const rawFields =
                typeof rawSpec.fields === "function"
                  ? rawSpec.fields(fieldsContext)
                  : rawSpec.fields || {};
              const fieldsSpec = builder.applyHooks(
                "GraphQLObjectType:fields",
                build.extend(
                  {},
                  rawFields,
                  `Default field included in newWithHooks call for '${
                    rawSpec.name
                  }'. ${inScope.__origin || ""}`,
                ),
                build,
                fieldsContext,
                `|${rawSpec.name}`,
              );

              // Finally, check through all the fields that they've all been
              // processed; any that have not we should do so now.
              for (const fieldName in fieldsSpec) {
                const fieldSpec = fieldsSpec[fieldName];
                if (processedFields.indexOf(fieldSpec) < 0) {
                  // We've not processed this yet; process it now!
                  fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                    // We don't have any additional information
                    { fieldName },
                    fieldSpec,
                  );
                }
              }

              // Perform the Graphile Crystal magic
              for (const fieldName in fieldsSpec) {
                const { subscribe, resolve } = fieldsSpec[fieldName];
                fieldsSpec[fieldName].resolve = crystalWrapResolve(resolve);
                if (!subscribe && scope.isRootSubscription) {
                  fieldsSpec[fieldName].subscribe = makeCrystalSubscriber();
                }

                // IMPORTANT: **nothing** can modify the resolver from here - i.e.
                // graphql-shield and friends may cause problems
              }

              return fieldsSpec;
            },
          };
          const Self = new GraphQLObjectType(finalSpec);
          return Self;
        }
        default: {
          const never: never = Type;
          throw new Error(`Cannot handle ${Type}`);
        }
      }
    })();

    if (isNamedType(Result)) {
      build.scopeByType.set(Result, inScope);
    }

    return Result;
  };

  return { newWithHooks };
}
