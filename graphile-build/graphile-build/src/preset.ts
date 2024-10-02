import "./interfaces.js";
import "graphile-config";

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

// TODO: version this
export const defaultPreset: GraphileConfig.Preset = {
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
