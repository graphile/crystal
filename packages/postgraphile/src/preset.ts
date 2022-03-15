import {
  defaultPreset as graphileBuildPreset,
  QueryQueryPlugin,
  SwallowErrorsPlugin,
} from "graphile-build";
import { defaultPreset as graphileBuildPgPreset } from "graphile-build-pg";
import type { Preset } from "graphile-plugin";

export const defaultPreset: Preset = {
  extends: [graphileBuildPreset, graphileBuildPgPreset],
  plugins: [QueryQueryPlugin, SwallowErrorsPlugin],
};
