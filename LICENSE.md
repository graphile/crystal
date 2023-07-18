This repository is a monorepo containing a number of packages (as defined by
folders containing a `package.json` file). Each package has its own license (see
the LICENSE.md file within the package's root folder); all of these except for
`utils/graphile/` are the MIT license.

# Everything except `utils/graphile/` is MIT licensed

Any file not inside the `utils/graphile/` subfolder is released under the terms
of the MIT license. Thus the following packages are all MIT licensed:

- grafast
- @dataplan/json
- @dataplan/pg
- grafserv
- @grafserv/persisted
- postgraphile
- ruru
- ruru-components
- graphile-export
- eslint-plugin-graphile-export
- pg-sql2
- pg-introspection
- tamedevil
- graphile-build
- graphile-build-pg
- graphile-utils
- @graphile/simplify-inflection
- pgl
- graphile-config
- @graphile/lru
- jest-serializer-graphql-schema
- jest-serializer-simple

## The MIT License (MIT)

Copyright © `2023` Benjie Gillam

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Files under `utils/graphile/` are not OSS

The folder `utils/graphile/` is **not open source software**, instead it is
**sponsors-only source-available** software. This is where the `graphile`
command lives; please see
[the `graphile` command's LICENSE.md file](./utils/graphile/LICENSE.md) for full
details.
