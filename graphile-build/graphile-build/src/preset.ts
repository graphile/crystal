import "./interfaces.js";
import "graphile-config";

import * as grafast from "grafast";
import * as graphql from "grafast/graphql";

import {
  AddInterfaceSubtypesToTypesPlugin,
  AddNodeInterfaceToSuitableTypesPlugin,
  BuiltinScalarConnectionsPlugin,
  ClientMutationIdDescriptionPlugin,
  CollectReferencedTypesPlugin,
  CommonBehaviorsPlugin,
  CommonTypesPlugin,
  ConnectionPlugin,
  CursorTypePlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
  NodeAccessorPlugin,
  NodeIdCodecBase64JSONPlugin,
  NodeIdCodecPipeStringPlugin,
  NodePlugin,
  PageInfoStartEndCursorPlugin,
  QueryPlugin,
  RegisterQueryNodePlugin,
  // StreamDeferPlugin,
  SubscriptionPlugin,
  TrimEmptyDescriptionsPlugin,
} from "./plugins/index.js";
import {
  EXPORTABLE,
  EXPORTABLE_OBJECT_CLONE,
  exportNameHint,
} from "./utils.js";
import { version } from "./version.js";

declare global {
  namespace GraphileConfig {
    interface Lib {
      graphql: typeof graphql;
      grafast: typeof grafast;
      graphileBuild: {
        EXPORTABLE: typeof EXPORTABLE;
        EXPORTABLE_OBJECT_CLONE: typeof EXPORTABLE_OBJECT_CLONE;
        exportNameHint: typeof exportNameHint;
      };
    }
  }
}

export const GraphileBuildLibPreset: GraphileConfig.Preset = {
  lib: {
    versions: {
      grafast: grafast.version,
      graphql: graphql.version,
      "graphile-build": version,
    },
    graphql,
    grafast,
    graphileBuild: {
      EXPORTABLE,
      EXPORTABLE_OBJECT_CLONE,
      exportNameHint,
    },
  },
};

// TODO: version this
export const defaultPreset: GraphileConfig.Preset = {
  extends: [GraphileBuildLibPreset],
  plugins: [
    // Must come first
    CollectReferencedTypesPlugin,
    QueryPlugin,
    MutationPlugin,
    SubscriptionPlugin,
    // StreamDeferPlugin,
    CommonBehaviorsPlugin,
    ClientMutationIdDescriptionPlugin,
    MutationPayloadQueryPlugin,
    CursorTypePlugin,
    CommonTypesPlugin,
    NodePlugin,
    ConnectionPlugin,
    PageInfoStartEndCursorPlugin,
    BuiltinScalarConnectionsPlugin,
    TrimEmptyDescriptionsPlugin,
    AddNodeInterfaceToSuitableTypesPlugin,
    NodeIdCodecBase64JSONPlugin,
    NodeIdCodecPipeStringPlugin,
    RegisterQueryNodePlugin,
    NodeAccessorPlugin,
    AddInterfaceSubtypesToTypesPlugin,
  ],
};
