import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import postgraphql from 'postgraphql'

// Load the config from .env file.
dotenv.load()
const {
  APP_PORT,
  DB_STRING,
  DB_SCHEMA,
} = process.env

// Our webpack configuration.
const compiler = webpack({
  entry: path.resolve(__dirname, 'src/main.js'),
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

// This allows use compile the front-end app on the fly.
// Do not use this in production.
const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  publicPath: '/static/',
  noInfo: true,
  stats: { colors: true },
})

// The webpack dev server exposes the `.use` of the express app instance.
// Mount the postgraphql as middleware at `/graphql`.
app.use('/graphql', postgraphql(DB_STRING, DB_SCHEMA, {
    development: true,
    log: true,
  }
))

// Any other path will match this and will load the index.html file.
app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'))
})

// Start the app server.
app.listen(APP_PORT, () => {
  console.log(`Relay app server listening at http://localhost:${APP_PORT}`)
})
