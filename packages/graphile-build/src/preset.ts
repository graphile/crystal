import "./interfaces";

import type { Preset } from "graphile-plugin";

import {
  ClientMutationIdDescriptionPlugin,
  CommonTypesPlugin,
  CursorTypePlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
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
  ],
};
