var _ 							= require('lodash');
var chalk 						= require('chalk');
var webpack 					= require('webpack');
var path 						= require("path");
var DashboardPlugin 			= require('webpack-dashboard/plugin');
var CopyWebpackPlugin 			= require('copy-webpack-plugin')
var ExtractTextPlugin 			= require('extract-text-webpack-plugin');
var HtmlWebpackPlugin 			= require('html-webpack-plugin');
var CleanWebpackPlugin 			= require('clean-webpack-plugin');
var OpenBrowserWebpackPlugin 	= require('open-browser-webpack-plugin');


var appSourcePath 		= path.resolve(__dirname, './app/');
var appDistPath 		= path.resolve(__dirname, './dist/');
var appBuildPath 		= path.resolve(__dirname, './build/')

var PARAMS_DEFAULT = {
    entry: {
        vendor: ['angular', 'angular-route', 'angular-mocks'],
        app: './app.js'	
    },
    output: {
        filename: '[name].[chunkhash].js',
        sourceMapFilename: '[name].[chunkhash].map'
    },
    plugins: [
    new DashboardPlugin(),
        new HtmlWebpackPlugin({ template: './index.html', inject: 'body' }),
        //new webpack.ProvidePlugin({ 'window.jQuery': 'jquery', 'jQuery': 'jquery' }),
        new CopyWebpackPlugin([{ context: appSourcePath, from: '**/*.{html,css}' }]),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({filename: '[name].css',  allChunks: true })
    ],
    devServer: {
        port: 8081
    }
};


var PARAMS_PER_TARGET = {
    DEV: {
        devtool: 'inline-source-map',
        output: {
            filename: '[name].js'
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: 'vendor.js'
            }),
            new OpenBrowserWebpackPlugin({
                url: 'http://localhost:' + PARAMS_DEFAULT.devServer.port
            })
        ]
    },
    BUILD: {
        output: {
            path: appBuildPath
        },
        devtool: 'source-map',
        plugins: [
            new CleanWebpackPlugin([appBuildPath]),
            new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.[chunkhash].js', minChunks: Infinity })
        ]
    },
    DIST: {
        output: {
            path: appDistPath,
            publicPath: '/',
        },
        plugins: [
            new CleanWebpackPlugin([appDistPath]),
            new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.[chunkhash].js', minChunks: Infinity }),
            new webpack.optimize.UglifyJsPlugin({  mangle: false })
        ]
    }
};

var TARGET = process.env.NODE_ENV || 'BUILD';
var params = _.mergeWith(PARAMS_DEFAULT, PARAMS_PER_TARGET[TARGET], _mergeArraysCustomizer);

_printBuildInfo(params);

module.exports = {
	context: appSourcePath,	
    resolve: params.resolve,
    entry: params.entry,
    output: params.output,
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/,  loader: "eslint-loader", enforce: "pre", options: { fix: true }},
            {test: /\.js$/, loader: 'babel-loader', exclude: /(\.test.js$|node_modules)/},
            {test: /\.scss$/, loader: ExtractTextPlugin.extract('css-loader!sass-loader') },
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.tpl.html/, loader: 'html-loader'},
            {test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/, loader: 'url-loader?limit=50000'}
        ]
    },
    plugins: params.plugins,
    devServer: params.devServer,
    devtool: params.devtool
};

function _printBuildInfo(params) {
    console.log('\nStarting ' + chalk.bold.green('"' + TARGET + '"') + ' build');
    if (TARGET === 'DEV') {
        console.log('Dev server: ' +
            chalk.bold.yellow('http://localhost:' + params.devServer.port + '/index.html') + '\n\n');
    } else {
        console.log('\n\n');
    }
}

function _mergeArraysCustomizer(a, b) {
    if (_.isArray(a)) {
        return a.concat(b);
    }
}