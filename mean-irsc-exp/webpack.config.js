const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry: {
    // 'public/polyfills': './src/app/polyfills.ts',
    // 'public/vendor': './src/app/vendor.ts',
    // 'public/main': './src/app/main.ts',
    'dist/app': './src/app.ts',
    // 'dist/server': './src/server.ts',
  },
  target: 'node',
  "output": {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'ts-loader',
            options: { configFileName: path.join(__dirname, 'tsconfig.json') }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: path.join(__dirname, 'src', 'app'),
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', loader: 'css-loader?sourceMap' })
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src', 'app'),
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    // Workaround for angular/angular#11580
    // new webpack.ContextReplacementPlugin(
    //   // The (\\|\/) piece accounts for path separators in *nix and Windows
    //   /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
    //   path.join(__dirname, 'src', 'app'), // location of your src
    //   {} // a map of your routes
    // ),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['public/main', 'public/vendor', 'public/polyfills']
    // }),
    new HtmlWebpackPlugin({
      template: 'src/app/index.html',
      filename: 'app/index.html'
    })
  ]
};
