import "./interfaces";

import type { Preset } from "graphile-plugin";

import {
  ClientMutationIdDescriptionPlugin,
  CommonTypesPlugin,
  CursorTypePlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
  PageInfoStartEndCursorPlugin,
  ConnectionPlugin,
  QueryPlugin,
  SubscriptionPlugin,
} from "./plugins/index.js";

export const defaultPreset: Preset = {
  plugins: [
    QueryPlugin,
    MutationPlugin,
    SubscriptionPlugin,
    ClientMutationIdDescriptionPlugin,
    MutationPayloadQueryPlugin,
    CursorTypePlugin,
    CommonTypesPlugin,
    ConnectionPlugin,
    PageInfoStartEndCursorPlugin,
  ],
};
