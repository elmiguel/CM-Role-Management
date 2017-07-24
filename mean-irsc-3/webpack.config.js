const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const OUTPUT_DIR = path.join(__dirname, 'dist', 'public')

// const extractSass = new ExtractTextPlugin({
//     filename: "[name].[contenthash].css",
//     disable: process.env.NODE_ENV === "development"
// })

module.exports = {
  entry: path.join(__dirname, 'src', 'frontend', 'main.ts'),
  output: {
    path: path.resolve(OUTPUT_DIR),
    filename: 'js/[name].js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ],
    // rules: [
    //   {
    //     test: /\.scss$/,
    //     loader: new ExtractTextPlugin.extract({
    //       loader: [
    //         { loader: "css-loader" },
    //         { loader: "sass-loader" }
    //       ],
    //       // use style-loader in development
    //       fallbackLoader: "style-loader"
    //     })
    //   }
    // ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      filename: path.resolve(OUTPUT_DIR, 'index.html'),
      template: 'src/frontend/index.html'
    })
    // extractSass
  ]
}
