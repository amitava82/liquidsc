var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var projectRoot = process.cwd(); // Absolute path to the project root
var resolveRoot = path.join(projectRoot, 'node_modules'); // project root/node_modules
var buildPath = './public/build/';

var extractCSS = new ExtractTextPlugin('app.css');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('vendors', 'vendor.js');
var env = new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')});
var plugins = [commonsPlugin, extractCSS];

if(process.env.NODE_ENV == 'production'){
  plugins.push(new webpack.optimize.OccurenceOrderPlugin());
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compressor: { warnings: false }
  }));
  plugins.push(env);
}

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'client/main.js'),
    vendors: ['react', 'react-dom', 'react-redux', 'react-router', 'redux-thunk', 'lodash', 'classnames', 'react-router-scroll',
    'redux', 'autobind-decorator', 'react-bootstrap', 'react-router-redux', 'bluebird', 'redux-form', 'react-select', 'superagent']
  },
  //devtool: 'source-map',
  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: buildPath,
    publicPath: '/public/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [resolveRoot],
        loader: 'babel-loader',
        query: {
          presets: ['es2015', "stage-1", 'react'],
          plugins: ["transform-decorators-legacy"]
        }
      },
      {
        test: /\.scss$|\.css$/,
        loader: extractCSS.extract('style', ['css', 'postcss', 'sass'])
      },
     /// { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff" },

      { test: /\.(ttf|eot|svg|woff)(\?\S*)?$/, loader: "file-loader?name=../build/[name].[ext]" }
    ]
  },
    
  resolve: {
    root: [
      resolveRoot,
      path.join(__dirname, 'node_modules')
    ],
    extensions: ['', '.js', '.json']
  },
  plugins: plugins,
  modulesDirectories: [
    'node_modules'
  ]
};