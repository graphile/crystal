import "graphile-config";

import {
  AddNodeInterfaceToSuitableTypesPlugin,
  defaultPreset as graphileBuildPreset,
  MutationPayloadQueryPlugin,
  NodeAccessorPlugin,
  NodePlugin,
  QueryQueryPlugin,
  SwallowErrorsPlugin,
} from "graphile-build";
import {
  defaultPreset as graphileBuildPgPreset,
  PgAllRowsPlugin,
  PgColumnsPlugin,
  PgCustomTypeFieldPlugin,
  PgMutationCreatePlugin,
  PgMutationPayloadEdgePlugin,
  PgMutationUpdateDeletePlugin,
  PgOrderAllColumnsPlugin,
  PgOrderByPrimaryKeyPlugin,
  PgOrderCustomFieldsPlugin,
  PgRelationsPlugin,
  PgRowByUniquePlugin,
} from "graphile-build-pg";

// Shunts the plugins into an order that's more compatible with PostGraphile V4.
export const orderedPlugins: GraphileConfig.Preset = {
  plugins: [
    QueryQueryPlugin,
    AddNodeInterfaceToSuitableTypesPlugin,
    NodePlugin,
    PgAllRowsPlugin,
    PgRowByUniquePlugin,
    PgColumnsPlugin,
    MutationPayloadQueryPlugin,
    PgRelationsPlugin,
    PgMutationCreatePlugin,
    PgMutationUpdateDeletePlugin,
    PgCustomTypeFieldPlugin,
    NodeAccessorPlugin,
    PgOrderAllColumnsPlugin,
    PgOrderCustomFieldsPlugin,
    PgOrderByPrimaryKeyPlugin,
    PgMutationPayloadEdgePlugin,
  ],
};

export const postgraphilePresetAmber: GraphileConfig.Preset = {
  extends: [orderedPlugins, graphileBuildPreset, graphileBuildPgPreset],
  plugins: [SwallowErrorsPlugin],
};

export default postgraphilePresetAmber;
