var path                        = require("path");
var webpack                     = require('./webpack.test.config');
var ExtractTextPlugin           = require('extract-text-webpack-plugin');
var appSourcePath               = path.resolve(__dirname, './app/');

module.exports = function(config) {
    config.set({
        browsers:   ['Chrome'],
        frameworks: ['jasmine'],
        reporters:  ['mocha','coverage'],
        plugins:['karma-webpack', 'karma-coverage', 'karma-jasmine','karma-mocha', 'karma-chrome-launcher', 'karma-mocha-reporter'],
        logLevel: config.LOG_DEBUG,
        autoWatch: true,
        singleRun: false,
        colors: true,
        port: 9876,

        basePath: '',
        files: ['karma.shim.js'],
        preprocessors: { 'karma.shim.js': ['webpack'] },
        exclude: [],
        webpack: webpack,
         // configure the webpack server to not be so verbose
        webpackServer: {
            noInfo: true
        },

        // setup code coverage
        coverageReporter: {
            reporters: [{
                type: 'text-summary',
            }, {
                type: 'html',
                dir: 'coverage/'
            }]
        }
    });
};