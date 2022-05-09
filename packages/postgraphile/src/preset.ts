import {
  defaultPreset as graphileBuildPreset,
  QueryQueryPlugin,
  SwallowErrorsPlugin,
} from "graphile-build";
import { defaultPreset as graphileBuildPgPreset } from "graphile-build-pg";
import "graphile-plugin";

export const defaultPreset: GraphilePlugin.Preset = {
  extends: [graphileBuildPreset, graphileBuildPgPreset],
  plugins: [QueryQueryPlugin, SwallowErrorsPlugin],
};
