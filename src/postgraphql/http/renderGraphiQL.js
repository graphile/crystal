import { readFileSync } from 'fs'
import { resolve } from 'path'

let html = readFileSync(resolve(__dirname, '../graphiql/index.html'), 'utf-8')

export default (graphqlPath, {
  watchPg,
  jwtSecret,
}) => {
  const graphiqlConfig = JSON.stringify({
    graphqlPath,
    watchPg,
    jwt: !!jwtSecret,
  })

  html = html.replace(/{GRAPHIQL_CONFIG}/, graphiqlConfig)
  return html
}
