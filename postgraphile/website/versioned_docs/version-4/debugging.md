---
title: Debugging
toc_max_heading_level: 4
---

When something's wrong with your app it can be hugely frustrating; so we want to
make it as easy as we can for you to get to the bottom of these issues!

### Step 1: check you're requesting what you think you're requesting

Often issues occur because your client code isn't doing what you think it's
doing. The first step here is to determine exactly what's being sent over the
network. If you're building a website you can easily use Google Chrome's Network
Devtools to see exactly what's being sent and received.

1.  Open your website in Chrome
2.  Right click, and select 'Inspect'
3.  Select the 'Network' tab in the developer tools
4.  In the filter box, enter '/graphql' (or whatever path you have configured
    your API to use)
5.  Ensure that 'All' is selected to the right of the filter box
6.  Trigger your GraphQL request (either by reloading the page or by clicking
    the relevant element on the screen)
7.  Review the network requests that have arrived to ensure they're what you'd
    expect, that no variables are unexpectedly null, that the relevant access
    tokens are being set in the request headers, etc

### Step 2: try your query in GraphiQL

It sometimes helps to try doing the same thing a different way, and this is
where GraphiQL comes in handy. Take the query you're running and execute it via
GraphiQL. Is it producing the same issue? Note that you can set headers in
GraphiQL by ensuring that you're using the enhanced GraphiQL
(`--enhance-graphiql` or `enhanceGraphiql: true`) and pressing the `Headers`
button.

### Step 3: increase PostGraphile's logging

Note that the errors are sent through to the GraphQL client (they're not output
on the server by default) so you'll need to reproduce this from your client so
you can see the output (or use a network inspector such as WireShark if
modifying the client is not an option). If you're using PostGraphile as a
library then you can use `handleErrors` to output the error details on the
server side (and to manipulate them before they're returned to the client).

You probably don't want this level of debugging on production as the results are
sent to the client and it may leak implementation details you wish to keep
private.

Use the following CLI options with PostGraphile:

- `--show-error-stack`
- `--extended-errors hint,detail,errcode` (other options available
  [here](https://github.com/brianc/node-postgres/blob/7de137f9f88611b8fcae5539aa90b6037133f1f1/lib/connection.js#L565-L580))
- or

```
--extended-errors severity,code,detail,hint,position,internalPosition,internalQuery,where,schema,table,column,dataType,constraint,file,line,routine
```

or for the library:

- `showErrorStack: true`
- `extendedErrors: ['hint', 'detail', 'errcode']` (other options available
  [here](https://github.com/brianc/node-postgres/blob/7de137f9f88611b8fcae5539aa90b6037133f1f1/lib/connection.js#L565-L580))
- or

```
extendedErrors: ['severity', 'code', 'detail', 'hint', 'position', 'internalPosition', 'internalQuery', 'where', 'schema', 'table', 'column', 'dataType', 'constraint', 'file', 'line', 'routine']
```

- or use a custom `handleErrors` function to explore even more details about the
  errors (or to log them server side), note this overrides the above options.
  You might be interested in the `originalError` property on the GraphQLErrors
  you're handed.

### Step 4: viewing the generated SQL

Assuming that the error is coming from within the database, you can see what SQL
statements PostGraphile is generating.

#### Via PostGraphiQL 'Explain'

One way to do so is via the "Explain" feature available in PostGraphiQL since
PostGraphile v4.5. To use this, you must run PostGraphile with
`--enhance-graphiql --allow-explain` (or for the library
`enhanceGraphiql: true, allowExplain: (req) => { return true; }`). It is
recommended that you do not use this functionality in production; however if you
choose to do so you can use the `allowExplain` callback to determine which
requests can use this functionality.

Once enabled, visit GraphiQL (by default this will be at
http://localhost:5000/graphiql) and click the 'Explain disabled' button to
toggle it into 'Explain ON'. You should see the query that was executed and the
associated query plan:

![PostGraphiQL with Explain ON](https://user-images.githubusercontent.com/129910/68597446-df861a00-0494-11ea-801c-8741362dafa4.png)

#### Via `DEBUG` envvar

Another way is to set the relevant [DEBUG](https://github.com/visionmedia/debug)
environmental variable before running PostGraphile. For example:

```bash
# Bash (Linux, macOS, etc)
export DEBUG="postgraphile:postgres"
postgraphile -c postgres://...

# Windows Console
set DEBUG=postgraphile:postgres & postgraphile -c postgres://...

# Windows PowerShell
$env:DEBUG='postgraphile:postgres'; postgraphile -c postgres://...
```

Note that this works with PostGraphile CLI and also when using PostGraphile as
an express middleware (in which case replace the
`postgraphile -c postgres://...` command with your own server startup command).

To find details of any errors thrown whilst executing SQL, use:

```bash
# Bash (Linux, macOS, etc)
export DEBUG="postgraphile:postgres,postgraphile:postgres:error"
postgraphile -c postgres://...
  # or:
export DEBUG="postgraphile:postgres*"
postgraphile -c postgres://...

# Windows Console
set DEBUG=postgraphile:postgres,postgraphile:postgres:error & postgraphile -c postgres://...
  #or
set DEBUG=postgraphile:postgres* & postgraphile -c postgres://...

# Windows PowerShell
$env:DEBUG = "postgraphile:postgres,postgraphile:postgres:error"; postgraphile -c postgres://...
  #or
$env:DEBUG = "postgraphile:postgres*"; postgraphile -c postgres://...
```

### Other `DEBUG` envvars

We use a lot of DEBUG envvars for different parts of the system. Here's some of
the ones you might care about:

- `postgraphile:cli` - informs about plugins being loaded
- `postgraphile:graphql` - prints out the full GraphQL query after validation
  and before execution
- `postgraphile:request` - prints out statuses during the HTTP request
  life-cycle
- `postgraphile:postgres` - prints out every SQL statement that's issued to the
  database (does not include placeholder values)
- `postgraphile:postgres:notice` - outputs any notices generated whilst
  executing SQL statements (very useful for tracing functions/triggers)
- `postgraphile:postgres:error` - outputs any errors generated whilst executing
  SQL statements
- `graphile-builder` - desperately in need of renaming, this hook is extremely
  useful for understanding the order in which hooks execute, and how hook
  executions can nest - a must for people getting started with graphile-build
  plugins
- `graphile-build-pg` - prints out various things, many of which should not
  occur. Also used to output errors from the update/delete mutations (where
  `null` is returned to GraphQL)
- `graphile-build-pg:warn` - prints out warnings that occur during schema
  generation; these warnings might hint at field conflicts and similar issues
- `graphile-build-pg:sql` - prints out _some_ SQL statements, you probably want
  `postgraphile:postgres` instead
- `graphql-parse-resolve-info` - far more information than you could possibly
  need regarding how we process the resolveInfo / AST

To enable these DEBUG modes, join them with commas when setting a DEBUG envvar,
then run PostGraphile or your Node.js server in the same terminal:

```bash
# Bash (Linux, macOS, etc)
export DEBUG="postgraphile:graphql,postgraphile:request,postgraphile:postgres*"
postgraphile -c postgres://...

# Windows Console
set DEBUG=postgraphile:graphql,postgraphile:request,postgraphile:postgres* & postgraphile -c postgres://...

# Windows PowerShell
$env:DEBUG = "postgraphile:graphql,postgraphile:request,postgraphile:postgres*"; postgraphile -c postgres://...
```

### Advanced: getting your hands dirty

If you're a plugin author, you think you've discovered an issue in PostGraphile,
or you just like seeing how things work, you can use the Chrome Debug tools to
debug the node process - add breakpoints, break on exceptions, and step through
code execution.

1.  Visit `chrome://inspect` in Google Chrome (we can't hyperlink it for
    security reasons).
2.  Select 'Open dedicated DevTools for Node', a new devtools window should
    open - don't close this!
3.  Run your server or PostGraphile via Node.js directly, in `--inspect` mode,
    e.g.:

```bash
# For globally installed PostGraphile:
node --inspect `which postgraphile` -c postgres://...

# or for locally installed PostGraphile:
node --inspect node_modules/.bin/postgraphile -c postgres://...

# or, if you have your own Node.js app in `server.js`:
node --inspect server.js
```
