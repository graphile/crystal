# ruru-components

The React components behind [ruru][], in case you want to embed Ruru into an
existing React project.

**PRERELEASE**: this is pre-release software; use at your own risk and do not
embed into public-facing projects. This will likely change a lot before it's
ultimately released. The pre-release nature also explains the shocking lack of
documentation.

## Usage

For other usage patterns, please see the main [ruru][] package.

```js
import { Ruru } from "ruru-components";
import "graphiql/style.css";
import "@graphiql/plugin-explorer/dist/style.css";
import "ruru-components/ruru.css";

React.render(<Ruru endpoint="/graphql" />);
```

[GNU Terry Pratchett](http://www.gnuterrypratchett.com/)

[ruru]: https://www.npmjs.com/package/ruru
