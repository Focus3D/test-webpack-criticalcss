// webpack v4
const path = require('path');
const glob = require('glob-all');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const HtmlCriticalPlugin = require('html-critical-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  }
  return false;
}

module.exports = {
  entry: {
    main: './src/js/main.js',
    info: './src/js/info.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '',
    filename: 'js/[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        js: {
          test: /\.js$/,
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          minSize: 0
        },
         mainStyles: {
          name: 'main',
          test: (m, c, entry = 'main') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true
        },
        infoStyles: {
          name: 'info',
          test: (m, c, entry = 'info') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true
        }
      }
    },
    occurrenceOrder: true // To keep filename consistent between different modes (for example building only)
  },  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
       {
        test: /\.ejs$/,
        exclude: /node_modules/,
        use: {
          loader: 'ejs-loader'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }         
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist/*']),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/html/index.ejs'),
      filename: 'index.html',
      chunks: ['commons', 'main'],
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/html/info.ejs'),
      filename: 'info.html',
      chunks: ['commons', 'info'],
      inject: false
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css'
    }),
    new PurifyCSSPlugin({
      paths: glob.sync([
        path.join(__dirname, './src/html/**/*.ejs'),
        path.join(__dirname, './src/js/*.js')
      ]),
      styleExtensions: ['.css'],
      moduleExtensions: ['.html'],
      verbose: true
    }),
    new HtmlCriticalPlugin({
      base: path.resolve(__dirname, 'dist'),
      src: 'index.html',
      dest: 'index.html',
      inline: true,
      minify: false,
      extract: true,
      width: 375,
      height: 565,
      penthouse: {
        blockJSRequests: false
      }
    }),
    new HtmlCriticalPlugin({
      base: path.resolve(__dirname, 'dist'),
      src: 'info.html',
      dest: 'info.html',
      inline: true,
      minify: false,
      extract: true,
      width: 375,
      height: 565,
      penthouse: {
        blockJSRequests: false
      }
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 0,
      minRatio: 0.8
    }),
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 0,
      minRatio: 0.8
    })
  ]
};