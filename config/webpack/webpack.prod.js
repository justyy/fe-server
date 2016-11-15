var merge = require('webpack-merge'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    webpack = require('webpack'),
    path = require('path'),
    util = require('./util'),
    vars = require('./vars'),
    base_config = require('./webpack.base')

const HTML_ENTRYS = util.getEntrys('html'),
    JS_ENTRYS = util.getEntrys('js'),
    STATIC_PATH = vars.STATIC_PATH,
    SUB_PATH = vars.SUB_PATH

module.exports = merge(base_config, {
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css!autoprefixer')
            },{
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!less?sourceMap')
            }
        ]
    },
    devtool: '#source-map',
    output: {
        filename: path.posix.join(SUB_PATH, 'js/[chunkhash:6].js'),
        chunkFilename: path.posix.join(SUB_PATH, 'js/[chunkhash:6].js')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': 'production'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new ExtractTextPlugin(path.posix.join(SUB_PATH, 'css/[hash:6].css')),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            chunks: Object.keys(JS_ENTRYS),
            minChunks: 2
        })
    ].concat(Object.keys(HTML_ENTRYS).map(function(key) {
        var entry = HTML_ENTRYS[key],
            filename = util.genHtmlFileName(entry)
        var config = {
            filename: path.join(STATIC_PATH, filename),
            template: entry,
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: false
            },
            chunksSortMode: 'dependency'
        }
        if (JS_ENTRYS.hasOwnProperty(key)) {
            config.chunks = ['common', key]
        } else {
            config.chunks = []
        }
        return new HtmlWebpackPlugin(config)
    }))
})

    