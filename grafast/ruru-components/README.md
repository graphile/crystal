# ruru-components

The React components behind [ruru][], in case you want to embed Ruru into an
existing React project.

**PRERELEASE**: this is pre-release software; use at your own risk and do not
embed into public-facing projects. This will likely change a lot before it's
ultimately released. The pre-release nature also explains the shocking lack of
documentation.

## Usage

For other usage patterns, please see the main [ruru][] package.

```jsx
import "graphiql/style.css";
import "@graphiql/plugin-explorer/style.css";
import "ruru-components/ruru.css";

// Have Webpack include the Monaco workers
import "graphiql/setup-workers/webpack";
// Or: import "graphiql/setup-workers/vite";
// Or: see "Monaco workers" below

import { Ruru } from "ruru-components";

React.render(<Ruru endpoint="/graphql" />);
```

### Monaco workers

If you can't use `graphiql/setup-workers/webpack` (or
`graphiql/setup-workers/vite` for Vite) to set up the Monaco workers for you,
then instead add this `<script>` block to your HTML above your Ruru import:

```html
<script type="module">
  /* Set up monaco workers */
  import createJSONWorker from "https://esm.sh/monaco-editor/esm/vs/language/json/json.worker.js?worker";
  import createGraphQLWorker from "https://esm.sh/monaco-graphql/esm/graphql.worker.js?worker";
  import createEditorWorker from "https://esm.sh/monaco-editor/esm/vs/editor/editor.worker.js?worker";

  globalThis.MonacoEnvironment = {
    getWorker(_workerId, label) {
      switch (label) {
        case "json":
          return createJSONWorker();
        case "graphql":
          return createGraphQLWorker();
        default:
          return createEditorWorker();
      }
    },
  };
</script>
```

[GNU Terry Pratchett](http://www.gnuterrypratchett.com/)

[ruru]: https://www.npmjs.com/package/ruru
