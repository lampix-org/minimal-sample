const webpack = require('webpack');
const path = require('path');

const cwd = process.cwd();

module.exports = (options) => ({
  entry: Object.assign({
    app: path.join(cwd, 'src', 'index.js')
  }, options.entry),
  output: Object.assign({}, options.output),
  module: {
    rules: options.module.rules.concat([
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          { loader: 'file-loader?name=[name].[ext]' },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              optipng: {
                optimizationLevel: 7
              },
              mozjpeg: {
                progressive: true
              },
              gifsicle: {
                interlaced: false
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ])
  },
  resolve: Object.assign({
    modules: [
      'src',
      'node_modules'
    ]
  }, options.resolve),
  plugins: options.plugins.concat([
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ])
});
