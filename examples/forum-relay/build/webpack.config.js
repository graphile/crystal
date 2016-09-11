import path from 'path'
import { DefinePlugin } from 'webpack'

export default {
  entry: path.resolve(__dirname, '../src/app.js'),
  module: {
    loaders: [{
      test: /\.css$/,
      exclude: /node_modules/,
      loaders: ['style', 'css'],
      options: 'modules'
    }, {
      test: /\.css$/,
      include: /node_modules/,
      loaders: ['style', 'css'],
    }, {
      test: /\.js$/,
      include: [path.resolve(__dirname, '../src')],
      loader: 'babel',
    }]
  },
  output: {
    filename: 'app.js',
    path: '/',
  },
  plugins: [
    new DefinePlugin({
      AUTH_URL: JSON.stringify('http://localhost:3000/authenticate'),
    })
  ],
  resolve: {
    modules: ['src', 'node_modules'],
  },
}
