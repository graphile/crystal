import { readFileSync, Stats, readFile, watchFile, unwatchFile } from 'fs';
import { makeJSONPgSmartTagsPlugin, JSONPgSmartTags } from 'graphile-utils';
import * as JSON5 from 'json5';
import { Plugin } from 'postgraphile-core';

export const makePgSmartTagsFromFilePlugin = (
  tagsFile = process.cwd() + '/postgraphile.tags.json5',
): Plugin => {
  /*
   * We're wrapping the `smartTagsPlugin` defined below with a plugin wrapper
   * so that any errors from reading the smart tags file are thrown when the
   * plugin is *loaded* rather than from when it is defined.
   */
  const plugin: Plugin = (builder, options) => {
    function handleTagsError(err: Error): void {
      console.error(`Failed to process smart tags file '${tagsFile}': ${err.message}`);
    }

    const initialTagsJSON: JSONPgSmartTags = JSON5.parse(readFileSync(tagsFile, 'utf8'));

    let tagsListener: null | ((current: Stats, previous: Stats) => void) = null;
    const smartTagsPlugin = makeJSONPgSmartTagsPlugin(initialTagsJSON, updateJSON => {
      if (tagsListener) {
        unwatchFile(tagsFile, tagsListener);
        tagsListener = null;
      }
      if (updateJSON) {
        tagsListener = (_current, _previous): void => {
          readFile(tagsFile, 'utf8', (err, data) => {
            if (err) {
              if (err['code'] === 'ENOENT') {
                updateJSON(null);
              } else {
                handleTagsError(err);
              }
              return;
            }
            try {
              updateJSON(JSON5.parse(data));
            } catch (e) {
              handleTagsError(e);
            }
          });
        };

        watchFile(tagsFile, { interval: 507 }, tagsListener);
      }
    });
    return smartTagsPlugin(builder, options);
  };
  return plugin;
};

export const PostGraphileTagsPlugin = makePgSmartTagsFromFilePlugin();
