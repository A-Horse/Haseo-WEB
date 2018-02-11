var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

const pkgPath = path.join(__dirname, 'package.json');
const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {};

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.less'],
    modules: [path.resolve('.'), 'node_modules']
  },
  devtool: 'source-map',
  devServer: {
    port: 9000,
    publicPath: '/assets/',
    proxy: {
      // NOTITE: // order is important
      '/api': 'http://localhost:8075',
      '/ws': {
        target: 'ws://localhost:8075',
        ws: true
      }
    }
  },
  entry: ['babel-polyfill', './src/index'],
  output: {
    path: path.join(__dirname, 'dist/assets'),
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          },
          {
            loader: 'autoprefixer-loader'
          }
        ]
      },
      {
        test: /.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      }
    ]
  }
};
