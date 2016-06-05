import express from 'express'
import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import postgraphql from 'postgraphql'

const APP_PORT = 3000

// webpack configuration
const compiler = webpack({
  entry: path.resolve(__dirname, 'src/app.js'),
  module: {
    loaders: [{
      include: [path.resolve(__dirname, 'src')],
      loader: 'babel',
      test: /\.js$/,
    }]
  },
  output: {
    filename: 'app.js',
    path: '/',
  },
})

// webpack dev server return an express app
const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  publicPath: '/src/',
  stats: { colors: true },
})

app.use('/graphql', postgraphql(
  'postgres://localhost:5432', 'forum_example', {
    development: true,
    log: true,
  }
))

app.use('/', express.static(
  path.resolve(__dirname, 'public')
))

app.listen(APP_PORT)
