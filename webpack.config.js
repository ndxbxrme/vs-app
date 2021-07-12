const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'app'),
	filename: '[name].[hash].js'
  },
  devServer: {
    contentBase: path.join(__dirname, "app"),
    historyApiFallback: true,
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: '8080',
    proxy: {
      '/api/**': {
        target: 'http://localhost:23232/',
        secure: false,
        changeOrigin: true
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html")
    })
  ],
  devtool: 'source-map',
  node: {
    fs: 'empty'
  },
  module: {
      rules: [
          {
              test: /\.js/,
              exclude: /node_modules/,
              use: [
                {
                  loader: 'ng-annotate-loader',
                  options: {
                    ngAnnotate: "ng-annotate-patched",
                    es6: true,
                    explicitOnly: false
                  }
                }
              ]
          },
          {
              test: /\.(styl|stylus)$/,
              use: [
                  "style-loader",
                  "css-loader",
                  "stylus-loader"
              ]
          },
          {
              test: /\.css/,
              use: [
                  "style-loader",
                  "css-loader"
              ]
          },
          {
              test: /\.(pug|jade)$/,
              use: "pug-loader"
          },
          {
              test: /\.(html|ttf|woff|woff2|eot)$/,
              use: "raw-loader"
          },
          {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
              'file-loader',
              {
                loader: 'image-webpack-loader',
                options: {
                  disable: true
                },
              },
            ],
          }
      ]
  }
};