import type { AsyncHooks } from "graphile-config";

import type { EXPORTABLE } from "./utils.js";

/**
 * The details in the 'info' object passed as the first argument to all gather
 * hooks and helpers.
 */
export interface GatherPluginContext<
  TState extends { [key: string]: any },
  TCache extends { [key: string]: any },
> {
  /** Libraries and modules to save importing */
  lib: GraphileConfig.Lib;

  /**
   * The (completed) inflection object, to help you name things your data
   * gathering produces.
   */
  inflection: GraphileBuild.Inflection;

  /**
   * The 'gather' phase options from the resolved preset.
   */
  options: GraphileBuild.GatherOptions;

  /**
   * The full resolved preset (generally you'll want `options` instead).
   */
  resolvedPreset: GraphileConfig.ResolvedPreset;

  /**
   * The `helpers` that all the gather plugins make available to you.
   */
  helpers: GraphileConfig.GatherHelpers;

  /**
   * The state for this plugin specifically. State exists only for a single
   * 'gather' phase and is then discarded.
   */
  state: TState;

  /**
   * The cache for this plugin specifically. The cache persists between
   * multiple 'gather' phases and can be a useful place to cache expensive
   * computation so later builds are faster. NOTE: cache is _not_ persisted, it
   * only exists whilst the code is in memory.
   */
  cache: TCache;

  /**
   * Triggers the given hook with the given event (used to broadcast to other
   * gather plugins so they can make their own changes/additions).
   */
  process: AsyncHooks<GraphileConfig.GatherHooks>["process"];

  /**
   * A copy of `import * from "grafast"` to avoid having to add grafast as a
   * dependency.
   *
   * @deprecated Use `lib.grafast` instead.
   */
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  grafast: typeof import("grafast");

  /**
   *
   * @deprecated Use `lib.graphileBuild.EXPORTABLE` instead.
   */
  EXPORTABLE: typeof EXPORTABLE;
}
