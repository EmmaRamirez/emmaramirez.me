var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/scripts/index.ts',
  output: {
    filename: './dist/scripts/bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.styl$/, loader: ExtractTextPlugin.extract('style!css!stylus!') },
      { test: /\.md$/, loader: ExtractTextPlugin.extract("html!markdown") }
    ]

  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new CopyWebpackPlugin([
      { from: './src/index.html', to: './dist/index.html' }
    ]),
    new ExtractTextPlugin('./dist/styles/bundle.css')
  ],
  watch: true
}
