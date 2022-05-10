import "graphile-config";

import {
  defaultPreset as graphileBuildPreset,
  QueryQueryPlugin,
  SwallowErrorsPlugin,
} from "graphile-build";
import { defaultPreset as graphileBuildPgPreset } from "graphile-build-pg";

export const defaultPreset: GraphileConfig.Preset = {
  extends: [graphileBuildPreset, graphileBuildPgPreset],
  plugins: [QueryQueryPlugin, SwallowErrorsPlugin],
};
