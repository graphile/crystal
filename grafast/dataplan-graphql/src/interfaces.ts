import type { Step } from "grafast";

export interface GraphQLDirective {
  name: string;
  args?: { [key: string]: any };
}

export interface GraphQLVariable {
  kind: "variable";
  name: string;
}

export type GraphQLArgumentValue = GraphQLVariable | { kind: never };

export interface GraphQLSelectionField {
  kind: "field";
  alias?: string;
  fieldName: string;
  args?: { [key: string]: GraphQLArgumentValue };
  directives?: GraphQLDirective[];
  selections?: GraphQLSelection[];
}

export interface GraphQLSelectionInlineFragment {
  kind: "inlineFragment";
  typeSpecifier: string | null;
  directives?: GraphQLDirective[];
  // TODO: alias?
  selections: GraphQLSelection[];
}

export type ArgsObject = {
  [key: string]: Step | ArgsObject | ArgsList;
};
export type ArgsList = ReadonlyArray<Step | ArgsObject | ArgsList>;

export type GraphQLSelection =
  | GraphQLSelectionField
  | GraphQLSelectionInlineFragment;
