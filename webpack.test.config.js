var path 						= require("path");
var ExtractTextPlugin 			= require('extract-text-webpack-plugin');
var webpack 					= require('webpack');


var appSourcePath = path.resolve(__dirname, './app/')
module.exports = {
 			devtool: 'inline-source-map',
            module: {
                loaders: [
                    {test: /\.js$/, loader: 'babel-loader', exclude: /(\.test.js$|node_modules)/,options:{}},
                    {enforce: "pre", test: /\.js$/, loader: 'istanbul-instrumenter-loader', exclude:/(\-test.js$|mocks.js$)/ , include: /(app)/, options: { esModules: true } },
                    {test: /\.scss$/, loader: ExtractTextPlugin.extract('css-loader!sass-loader') }
                    //{test: /\.css$/, loader: 'style!css'},
                    //{test: /\.tpl.html/, loader: 'html'},
                    //{test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/, loader: 'url?limit=50000'}
                ]
            },
             resolve: {
                modules: [
                  'node_modules',
                  appSourcePath
                ]
             },
            plugins: [
                    new ExtractTextPlugin({filename: '[name].css',  allChunks: true })
            ]
        };