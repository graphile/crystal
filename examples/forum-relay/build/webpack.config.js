import path from 'path'
import { DefinePlugin } from 'webpack'

export default {
  entry: path.resolve(__dirname, '../src/main.js'),
  module: {
    loaders: [{
      include: [path.resolve(__dirname, '../src')],
      loader: 'babel',
      test: /\.js$/,
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
}
