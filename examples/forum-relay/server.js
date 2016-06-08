import express from 'express'
import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import postgraphql from 'postgraphql'

const APP_PORT = 3000
const CN_STRING = 'postgres://localhost:5432'
const SCHEMA = 'forum_example'

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

// webpack dev server returns an express app
const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  publicPath: '/src/',
  stats: { colors: true },
})

// mount the postgraphql as middleware at `/graphql`
app.use('/graphql', postgraphql(CN_STRING, SCHEMA, {
    development: true,
    log: true,
  }
))

// anything else load the index.html file
app.use('*', (req, res) => {
  res.sendfile(path.resolve(__dirname, 'public/index.html'))
})

app.listen(APP_PORT)
