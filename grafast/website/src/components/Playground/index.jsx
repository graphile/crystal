import { Ruru } from "@grafast/ruru";
import * as Grafast from "grafast";
import { grafast, lambda, makeGrafastSchema } from "grafast";
import { GraphQLError } from "graphql";
import React, { useCallback, useMemo, useState } from "react";

import styles from "./styles.module.css";

const INITIAL_TYPEDEFS = `\
type Query {
  addTwoNumbers(a: Int!, b: Int!): Int
}
`;
const INITIAL_CODE = `\
const plans = {
  Query: {
    addTwoNumbers(_, args) {
      const $a = args.get("a");
      const $b = args.get("b");
      return lambda([$a, $b], ([a, b]) => a + b);
    },
  },
};
`;

const plans = {
  Query: {
    addTwoNumbers(_, args) {
      const $a = args.get("a");
      const $b = args.get("b");
      return lambda([$a, $b], ([a, b]) => a + b);
    },
  },
};

export default function Playground() {
  const [typeDefs, setTypedefs] = useState(INITIAL_TYPEDEFS);
  const [code, setCode] = useState(INITIAL_CODE);
  const schema = useMemo(() => {
    try {
      const plans = new Function(
        "Grafast",
        `\
const {
  __InputListStep,
  __InputObjectStep,
  __InputStaticLeafStep,
  __ItemStep,
  __ListTransformStep,
  __TrackedObjectStep,
  __ValueStep,
  $$bypassGraphQL,
  $$data,
  $$eventEmitter,
  $$extensions,
  $$idempotent,
  $$verbatim,
  access,
  AccessStep,
  ActualKeyByDesiredKey,
  ArgumentApplyPlanResolver,
  ArgumentInputPlanResolver,
  arrayOfLength,
  arraysMatch,
  assertListCapableStep,
  BaseEventMap,
  BaseGraphQLArguments,
  BaseGraphQLContext,
  BaseGraphQLRootValue,
  BaseGraphQLVariables,
  BaseStep,
  connection,
  ConnectionCapableStep,
  ConnectionStep,
  constant,
  ConstantStep,
  context,
  debugPlans,
  defer,
  Deferred,
  each,
  EdgeCapableStep,
  EdgeStep,
  EnumPlans,
  EnumValueApplyPlanResolver,
  error,
  ErrorStep,
  EventCallback,
  EventMapKey,
  ExecutableStep,
  execute,
  ExecutionEventEmitter,
  ExecutionEventMap,
  ExecutionExtra,
  FieldArgs,
  FieldInfo,
  FieldPlanResolver,
  FieldPlans,
  filter,
  FilterPlanMemo,
  first,
  FirstStep,
  getEnumValueConfig,
  GrafastArgumentExtensions,
  GrafastEnumValueExtensions,
  GrafastError,
  GrafastExecuteOptions,
  GrafastFieldExtensions,
  grafastGraphql,
  grafastGraphqlSync,
  GrafastInputFieldExtensions,
  GrafastObjectTypeExtensions,
  GrafastPlans,
  grafastPrint,
  GrafastResultsList,
  GrafastResultStreamList,
  GrafastSubscriber,
  GrafastValuesList,
  GraphileArgumentConfig,
  GraphileFieldConfig,
  GraphileFieldConfigArgumentMap,
  GraphileInputFieldConfig,
  GraphileInputFieldConfigMap,
  GraphileInputObjectType,
  GraphileObjectType,
  GraphQLItemHandler,
  graphqlItemHandler,
  GraphQLPolymorphicUnwrap,
  graphqlPolymorphicUnwrap,
  graphqlResolver,
  GraphQLResolverStep,
  groupBy,
  GroupByPlanMemo,
  InputObjectFieldApplyPlanResolver,
  InputObjectFieldInputPlanResolver,
  inputObjectFieldSpec,
  InputObjectPlans,
  InputObjectTypeInputPlanResolver,
  InputObjectTypeSpec,
  InputStep,
  InterfaceOrUnionPlans,
  isDev,
  isExecutableStep,
  isGrafastError,
  isListCapableStep,
  isModifierStep,
  isObjectLikeStep,
  isPromiseLike,
  isStreamableStep,
  lambda,
  LambdaStep,
  last,
  LastStep,
  list,
  ListCapableStep,
  listen,
  ListenStep,
  ListStep,
  listTransform,
  ListTransformItemPlanCallback,
  ListTransformOptions,
  ListTransformReduce,
  loadMany,
  LoadManyCallback,
  loadManyCallback,
  LoadManyOptions,
  LoadManySingleRecordStep,
  LoadManyStep,
  loadOne,
  LoadOneCallback,
  loadOneCallback,
  LoadOneOptions,
  LoadOneStep,
  makeGrafastSchema,
  makeMapper,
  map,
  MapStep,
  ModifierStep,
  newGraphileFieldConfigBuilder,
  newInputObjectTypeBuilder,
  newObjectTypeBuilder,
  node,
  NodeIdCodec,
  NodeIdHandler,
  NodeStep,
  noop,
  object,
  objectFieldSpec,
  ObjectLikeStep,
  ObjectPlanMeta,
  ObjectPlans,
  objectSpec,
  ObjectStep,
  ObjectTypeFields,
  ObjectTypeSpec,
  OperationPlan,
  operationPlan,
  OutputPlanForType,
  PageInfoCapableStep,
  partitionByIndex,
  PolymorphicData,
  PolymorphicStep,
  polymorphicWrap,
  PrintPlanGraphOptions,
  PromiseOrDirect,
  resolveType,
  reverse,
  reverseArray,
  ReverseStep,
  ScalarPlanResolver,
  ScalarPlans,
  setter,
  SetterCapableStep,
  SetterStep,
  specFromNodeId,
  stepADependsOnStepB,
  stepAMayDependOnStepB,
  StepOptimizeOptions,
  stepsAreInSamePhase,
  StepStreamOptions,
  StreamableStep,
  stringifyPayload,
  stripAnsi,
  subscribe,
  TypedEventEmitter,
} = Grafast;
${code};
return plans;
`,
      )(Grafast);
      return makeGrafastSchema({
        typeDefs,
        plans,
      });
    } catch (e) {
      return e;
    }
  }, [code, typeDefs]);
  const fetcher = useCallback(
    ({ query, operationName, variables }) => {
      if (schema instanceof Error) {
        return {
          errors: [new GraphQLError(schema)],
        };
      }
      return grafast({
        schema,
        source: query,
        operationName,
        variableValues: variables,
      });
    },
    [schema],
  );
  return (
    <div className={styles.container}>
      <div className={styles.ruru}>
        <Ruru fetcher={fetcher} />
      </div>
      <div className={styles.editor}>editor</div>
    </div>
  );
}
