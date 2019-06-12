const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var webpackMajorVersion = require('webpack/package.json').version.split('.')[0];

// path: path.join(__dirname, 'dist/webpack-' + webpackMajorVersion),
// path.resolve(__dirname, 'dist'),

module.exports = {
  context: __dirname,
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'dist/bundle.js',
    publicPath: ''
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.(js|jsx)$/
      },
      {
        exclude: /font/,
        loader: 'url-loader',
        test: /\.(png|jpg|jpeg|gif|svg)$/,
      },
      {
        loader: 'json-loader',
        test: /\.json$/
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use : [
            {
              loader: "css-loader"
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                    return [autoprefixer('last 2 versions', 'ie 10')]
                }
              }
            },
            {
              loader: 'resolve-url-loader',
              options: {
                root: path.join(__dirname, 'src')
              }
            },
            {
              loader: "sass-loader",
              options: {
                includePaths: [
                    path.resolve(__dirname, '../sass')
                ]
              }
            },
            {
              loader: "sass-resources-loader",
              options: {
                resources: 'src/globals/scss/resources.scss',
              }
            }
          ]
        })
      },
      {
        test: /\.(woff|eot|ttf|svg|woff2)$/,
        exclude: /img/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
              limit: 100000
            }
          }
        ],
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      path: path.join(__dirname, 'dist'),
      filename: 'app.css',
      disable: false,
      allChunks: true
    }),
    new webpack.SourceMapDevToolPlugin({
      path: path.join(__dirname, 'dist'),
      filename: "app.map"
    }),
    new HtmlWebpackPlugin({
      path: path.join(__dirname, 'dist'),
      filename: 'index.html',
      template: 'template.html'
    })
  ]
};
