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

import type { SelectionSetDigest } from "../graphqlCollectFields";
import type { LocationDetails, Maybe } from "../interfaces";
import type { Step } from "../step";
import type { LayerPlan, LayerPlanReasonListItemStream } from "./LayerPlan";
import type { OutputPlan } from "./OutputPlan";

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
  outputPlan: OutputPlan;
  path: readonly string[];
  planningPath: string;
  polymorphicPaths: ReadonlySet<string> | null;
  parentStep: Step;
  positionType: TType;
  layerPlan: LayerPlan;
}

export interface PlanIntoOutputPlanDetails
  extends CommonPlanningDetails<GraphQLOutputType> {
  resolverEmulation: boolean;
  // This is the LAYER-RELATIVE path, not the absolute path! It resets!
  // Typically this is parentOutputPlan.layerPlan; but in the case of mutationFields it isn't.
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
  selections: readonly SelectionNode[];
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
  stepForType?: ReadonlyMap<GraphQLObjectType, Step>;
}

export interface PolymorphicPlanObjectTypeDetails
  extends CommonPlanningDetails<GraphQLObjectType> {
  resolverEmulation: boolean;
  fieldNodes: readonly FieldNode[];
  locationDetails: LocationDetails;
  isNonNull: boolean;
}
