import { ExecutableStep } from "grafast";

export interface GraphQLDirective {
  name: string;
  arguments?: { [key: string]: any };
}

export interface GraphQLSelectionField {
  kind: "field";
  fieldName: string;
  alias?: string;
  directives: GraphQLDirective[];
  // TODO: CCN
  selections: GraphQLSelection[];
}

export interface GraphQLSelectionInlineFragment {
  kind: "inlineFragment";
  typeSpecifier: string | null;
  directives: GraphQLDirective[];
  // TODO: alias?
  selections: GraphQLSelection[];
}

export type ArgsObject = {
  [key: string]: ExecutableStep | ArgsObject | ArgsList;
};
export type ArgsList = ReadonlyArray<ExecutableStep | ArgsObject | ArgsList>;

export type GraphQLSelection =
  | GraphQLSelectionField
  | GraphQLSelectionInlineFragment;
