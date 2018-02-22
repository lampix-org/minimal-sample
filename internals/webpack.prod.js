const webpack = require('webpack');
const path = require('path');
const baseConfig = require('./webpack.base');
const vendors = require('./vendors.json');

require('dotenv').config();

const cwd = process.cwd();

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = baseConfig({
  entry: {
    vendor: vendors
  },
  output: {
    filename: 'app.[chunkhash].js',
    path: path.join(cwd, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: Object.assign({
                minimize: true
              }, !process.env.CSS_MODULES_DISABLED ? {
                modules: true,
                localIdentName: '[name]__[local]__[hash:base64:5]',
                camelCase: true
              } : {}),
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([path.join(cwd, 'dist')], { root: cwd }),
    new ExtractTextPlugin({
      filename: '[name].[chunkhash].css'
    }),
    // Extract vendor code to own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].[chunkhash].js',
      minChunks: Infinity
    }),
    new UglifyJsPlugin({
      test: /\.js($|\?)/i,
      uglifyOptions: {
        compress: {
          warnings: false
        }
      }
    }),
    // Extract app code to own file
    new HtmlWebpackPlugin({
      template: path.join(cwd, 'src', 'index.html')
    })
  ]
});
