// @flow
import debugFactory from "debug";

const debugWarn = debugFactory("graphile-build:warn");

export default function swallowError(e: Error): void {
  // BE VERY CAREFUL NOT TO THROW!
  // XXX: Improve this
  if (debugWarn.enabled) {
    // eslint-disable-next-line no-console
    console.warn(`Recoverable error occurred:`);
    debugWarn(e);
  } else {
    const errorSnippet =
      e && typeof e.toString === "function"
        ? String(e)
            .replace(/\n/g, "  ")
            .substr(0, 75)
            .trim()
        : null;
    if (errorSnippet) {
      // eslint-disable-next-line no-console
      console.warn(
        `Recoverable error occurred; use envvar 'DEBUG="graphile-build:warn"' for full error\n> ${errorSnippet}...`
      );
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `Recoverable error occurred; use envvar 'DEBUG="graphile-build:warn"' for error`
      );
    }
    debugWarn(e);
  }
}
