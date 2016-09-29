/**
 * Heavily derived from [`express-graphql`][1]. In the future we want to create
 * our own custom GraphiQL package with PostGraphQL specific features.
 *
 * [1]: https://github.com/graphql/express-graphql/blob/681b627c1a4bf01ea193ee9fe0077dd8d731bd76/src/renderGraphiQL.js
 */

const graphiqlVersion = '0.7.8'
const reactVersion = '15.3.2'

export default graphqlPath =>
`<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>GraphiQL</title>
    <meta name="robots" content="noindex"/>
    <style>
      html, body, #root {
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
    <div id="root"></div>
    <script>
      function graphQLFetcher (graphQLParams) {
        return fetch('${graphqlPath}', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(graphQLParams),
          credentials: 'include',
        }).then(function (response) {
          return response.text()
        }).then(function (responseBody) {
          try {
            return JSON.parse(responseBody)
          } catch (error) {
            return responseBody
          }
        })
      }

      ReactDOM.render(
        React.createElement(GraphiQL, {
          fetcher: graphQLFetcher,
        }),
        document.getElementById('root')
      )
    </script>
  </body>
</html>
`
