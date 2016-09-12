import path from 'path'
import { DefinePlugin } from 'webpack'

export default {
  entry: path.resolve(__dirname, '../src/app.js'),
  module: {
    loaders: [{
      test: /\.css$/,
      exclude: /node_modules/,
      loader: 'style-loader!css-loader?modules',
      options: 'modules'
    }, {
      test: /\.css$/,
      include: /node_modules/,
      loader: 'style-loader!css-loader',
    }, {
      test: /\.js$/,
      include: [path.resolve(__dirname, '../src')],
      loader: 'babel-loader',
    }]
  },
  output: {
    filename: 'app.js',
    path: '/',
  },
}
