/**
 * Heavily derived from [`express-graphql`][1]. In the future we want to create
 * our own custom GraphiQL package with PostGraphQL specific features.
 *
 * [1]: https://github.com/graphql/express-graphql/blob/681b627c1a4bf01ea193ee9fe0077dd8d731bd76/src/renderGraphiQL.js
 */

const graphiqlVersion = '0.7.8'
const reactVersion = '15.3.2'

// Ensures string values are save to be used within a <script> tag.
function safeSerialize(data) {
  return data ? JSON.stringify(data).replace(/\//g, '\\/') : null
}

export default function renderGraphiQL (data) {
  const queryString = data.query
  const variablesString = data.variables ? JSON.stringify(data.variables, null, 2) : null
  const resultString = data.result ? JSON.stringify(data.result, null, 2) : null
  const operationName = data.operationName
  return `<!--
The request to this GraphQL server provided the header "Accept: text/html"
and as a result has been presented GraphiQL - an in-browser IDE for
exploring GraphQL.
If you wish to receive JSON, provide the header "Accept: application/json" or
add "&raw" to the end of the URL within a browser.
-->
<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>GraphiQL</title>
    <meta name="robots" content="noindex"/>
    <style>
      html, body {
        height: 100%;
        margin: 0;
        overflow: hidden;
        width: 100%;
      }
    </style>
    <link href="//unpkg.com/graphiql@${graphiqlVersion}/graphiql.css" rel="stylesheet"/>
    <script src="//cdn.polyfill.io/v2/polyfill.min.js"></script>
    <script src="//unpkg.com/react@${reactVersion}/dist/react.min.js"></script>
    <script src="//unpkg.com/react-dom@${reactVersion}/dist/react-dom.min.js"></script>
    <script src="//unpkg.com/graphiql@${graphiqlVersion}/graphiql.min.js"></script>
  </head>
  <body>
    <script>
      // Collect the URL parameters
      var parameters = {};
      window.location.search.substr(1).split('&').forEach(function (entry) {
        var eq = entry.indexOf('=');
        if (eq >= 0) {
          parameters[decodeURIComponent(entry.slice(0, eq))] =
            decodeURIComponent(entry.slice(eq + 1));
        }
      });
      // Produce a Location query string from a parameter object.
      function locationQuery(params) {
        return '?' + Object.keys(params).map(function (key) {
          return encodeURIComponent(key) + '=' +
            encodeURIComponent(params[key]);
        }).join('&');
      }
      // Derive a fetch URL from the current URL, sans the GraphQL parameters.
      var graphqlParamNames = {
        query: true,
        variables: true,
        operationName: true
      };
      var otherParams = {};
      for (var k in parameters) {
        if (parameters.hasOwnProperty(k) && graphqlParamNames[k] !== true) {
          otherParams[k] = parameters[k];
        }
      }
      var fetchURL = locationQuery(otherParams);
      // Defines a GraphQL fetcher using the fetch API.
      function graphQLFetcher(graphQLParams) {
        return fetch(fetchURL, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(graphQLParams),
          credentials: 'include',
        }).then(function (response) {
          return response.text();
        }).then(function (responseBody) {
          try {
            return JSON.parse(responseBody);
          } catch (error) {
            return responseBody;
          }
        });
      }
      // When the query and variables string is edited, update the URL bar so
      // that it can be easily shared.
      function onEditQuery(newQuery) {
        parameters.query = newQuery;
        updateURL();
      }
      function onEditVariables(newVariables) {
        parameters.variables = newVariables;
        updateURL();
      }
      function onEditOperationName(newOperationName) {
        parameters.operationName = newOperationName;
        updateURL();
      }
      function updateURL() {
        history.replaceState(null, null, locationQuery(parameters));
      }
      // Render <GraphiQL /> into the body.
      ReactDOM.render(
        React.createElement(GraphiQL, {
          fetcher: graphQLFetcher,
          onEditQuery: onEditQuery,
          onEditVariables: onEditVariables,
          onEditOperationName: onEditOperationName,
          query: ${safeSerialize(queryString)},
          response: ${safeSerialize(resultString)},
          variables: ${safeSerialize(variablesString)},
          operationName: ${safeSerialize(operationName)},
        }),
        document.body
      );
    </script>
  </body>
</html>`
}
