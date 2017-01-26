const webpack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  entry: './src/graphiql.js',
  output: {
    path: './',
    filename: 'graphiql.dist.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.css$/, include: [/node_modules/, /global/], loader: "style!css" },
      { test: /\.css$/, exclude: [/node_modules/, /global/], loader: "style!css?modules" },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
  ],
}

if (!isDev) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    })
  )
}

module.exports = config
