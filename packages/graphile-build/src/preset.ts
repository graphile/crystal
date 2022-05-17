import "./interfaces.js";
import "graphile-config";

import {
  AddNodeInterfaceToSuitableTypesPlugin,
  BuiltinScalarConnectionsPlugin,
  ClientMutationIdDescriptionPlugin,
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
  SubscriptionPlugin,
  TrimEmptyDescriptionsPlugin,
} from "./plugins/index.js";

// TODO: version this
export const defaultPreset: GraphileConfig.Preset = {
  plugins: [
    QueryPlugin,
    MutationPlugin,
    SubscriptionPlugin,
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
  ],
};
