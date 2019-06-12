'use strict';

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const environment = process.env.NODE_ENV || 'development';
const WEBPACK_DEV_SERVER = "webpack-dev-server/client?http://localhost:8080";
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const entry = {
  app: [ "./index.js" ]
};
let devtool = 'source-map';

if (environment !== "production") {
  entry.app = entry.app.concat([ WEBPACK_DEV_SERVER ]);
  devtool = 'cheap-module-eval-source-map';
}

// TODO:  modify index.html when build production contenthash version

module.exports = ( env={} ) => {

  console.log("env = " + env);

  const isProd = (env.production === true);

  console.log("Production Environment = " + isProd);

  const getPlugins = (isProd) => {
    var pluginsToInclude = [];

    if( isProd ) {
      pluginsToInclude.push(new webpack.DefinePlugin({
        'process.env':{
            'NODE_ENV': JSON.stringify('production')
      }}));
      pluginsToInclude.push(new ExtractTextPlugin({
        filename: '[name].[md5:contenthash:hex:15].css',
        disable: false,
        allChunks: true
      }));
      pluginsToInclude.push(new UglifyJsPlugin({
        uglifyOptions: {
            output: {
                comments: false
            },
            minify: {},
            compress: {
                booleans: true
            }
        }
      }));
      pluginsToInclude.push(new OptimizeCssAssetsPlugin());
    } else {
      pluginsToInclude.push(new ExtractTextPlugin({
        filename: '[name].css',
        disable: false,
        allChunks: true
      }));
      pluginsToInclude.push(new webpack.SourceMapDevToolPlugin({
        filename: "[file].map"
      }));
    }

    return pluginsToInclude;
  };

  const getOutputFile = (isProd) => {
    if (isProd) {
      return {
        filename: "[name].[chunkhash:15].js"
      }
    }
    else {
      return {
        filename: "[name].js"
      }
    }
  };

  return {
    devtool: devtool,
    entry: entry,
    stats: "errors-only",

    output: getOutputFile(isProd),

    plugins: getPlugins(isProd),

    devServer: {
      stats: 'errors-only',
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
    resolve: {
      modules : [
         path.resolve("./src"),
         path.resolve("./node_modules")
      ],
      extensions: ['*', '.js', '.jsx']
    }
  }
};
