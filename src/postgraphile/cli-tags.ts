import { readFileSync, Stats, readFile, watchFile, unwatchFile } from 'fs';
import { makeJSONPgSmartTagsPlugin, JSONPgSmartTags } from 'graphile-utils';
import * as JSON5 from 'json5';

const TAGS_FILE = process.cwd() + '/postgraphile.tags.json5';

function handleTagsError(err: Error): void {
  console.error(`Failed to process '${TAGS_FILE}': ${err.message}`);
}

let initialTagsJSON: JSONPgSmartTags | null = null;
try {
  initialTagsJSON = JSON5.parse(readFileSync(TAGS_FILE, 'utf8'));
} catch (e) {
  if (e['code'] !== 'ENOENT') {
    handleTagsError(e);
  }
}

let tagsListener: null | ((current: Stats, previous: Stats) => void) = null;
export default makeJSONPgSmartTagsPlugin(initialTagsJSON, updateJSON => {
  if (!initialTagsJSON) {
    /*
     * Watch mode on the tags file is non-trivial, so only engage it if the file
     * exists when PostGraphile starts.
     */
    return;
  }
  if (tagsListener) {
    unwatchFile(TAGS_FILE, tagsListener);
    tagsListener = null;
  }
  if (updateJSON) {
    tagsListener = (_current, _previous): void => {
      readFile(TAGS_FILE, 'utf8', (err, data) => {
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

    watchFile(TAGS_FILE, { interval: 507 }, tagsListener);
  }
});
