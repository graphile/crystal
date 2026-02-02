import type {
  FieldNode,
  GraphQLFieldMap,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLUnionType,
  SelectionNode,
} from "graphql";

import type { SelectionSetDigest } from "../graphqlCollectFields.ts";
import type { LocationDetails, Maybe } from "../interfaces.ts";
import type { Step } from "../step.ts";
import type { LayerPlan, LayerPlanReasonListItemStream } from "./LayerPlan.ts";
import type { OutputPlan } from "./OutputPlan.ts";

export type StreamDetails = {
  if: Step<boolean>;
  initialCount: Step<number>;
  label: Step<Maybe<string>>;
};

export interface CommonPlanningDetails<
  TType extends
    | GraphQLOutputType
    | GraphQLInterfaceType
    | GraphQLUnionType = GraphQLOutputType,
> {
  /** The output plan that this selection set is being added to */
  outputPlan: OutputPlan;
  // This is the LAYER-RELATIVE path, not the absolute path! It resets!
  /** The path within the outputPlan that we're adding stuff (only for root/object OutputPlans) */
  path: readonly string[];
  planningPath: string;
  polymorphicPaths: ReadonlySet<string> | null;
  /** The step that represents the selection set root */
  parentStep: Step;
  positionType: TType;
  // Typically this is parentOutputPlan.layerPlan; but in the case of
  // mutationFields it isn't; there's probably a lot of other examples too.
  layerPlan: LayerPlan;
}

export interface PlanIntoOutputPlanDetails
  extends CommonPlanningDetails<GraphQLOutputType> {
  resolverEmulation: boolean;
  selections: readonly SelectionNode[] | undefined;
  parentObjectType: GraphQLObjectType | null;
  responseKey: string | null;
  locationDetails: LocationDetails;
  listDepth: number;
  streamDetails: StreamDetails | null;
}

export interface PlanFieldReturnTypeDetails
  extends Omit<PlanIntoOutputPlanDetails, "listDepth"> {
  parentObjectType: GraphQLObjectType;
}

export interface ProcessGroupedFieldSetDetails
  extends CommonPlanningDetails<GraphQLObjectType> {
  objectTypeFields: GraphQLFieldMap<any, any>;
  isMutation: boolean;
  groupedFieldSet: SelectionSetDigest;
}

export interface PlanSelectionSetDetails
  extends CommonPlanningDetails<GraphQLObjectType> {
  resolverEmulation: boolean;
  /** The GraphQL selections (fields, fragment spreads, inline fragments) to evaluate */
  selections: readonly SelectionNode[];
  /** If true this selection set should be executed serially rather than in parallel (each field gets its own LayerPlan) */
  isMutation?: boolean;
}

export interface PlanListItemDetails
  extends CommonPlanningDetails<GraphQLList<GraphQLOutputType>> {
  resolverEmulation: boolean;
  selections: readonly SelectionNode[] | undefined;
  listDepth: number;
  stream: LayerPlanReasonListItemStream | undefined;
  locationDetails: LocationDetails;
}

export interface PolymorphicResolveTypeDetails
  extends CommonPlanningDetails<GraphQLInterfaceType | GraphQLUnionType> {
  resolverEmulation: boolean;
  selections: readonly SelectionNode[];
  allPossibleObjectTypes: readonly GraphQLObjectType<any, any>[];
  locationDetails: LocationDetails;
  parentObjectType: GraphQLObjectType | null; // Used by this.mutateTodos
  responseKey: string | null; // Used by this.mutateTodos
  isNonNull: boolean;

  // Populated by mutateTodos
  stepForType?: ReadonlyMap<GraphQLObjectType, Step | Error>;
}

export interface PolymorphicPlanObjectTypeDetails
  extends CommonPlanningDetails<GraphQLObjectType> {
  resolverEmulation: boolean;
  fieldNodes: readonly FieldNode[];
  locationDetails: LocationDetails;
  isNonNull: boolean;
}
