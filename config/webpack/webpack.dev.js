var merge = require('webpack-merge'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require('path'),
    util = require('./util'),
    vars = require('./vars'),
    base_config = require('./webpack.base')

const HTML_ENTRYS = util.getEntrys('html'),
    JS_ENTRYS = util.getEntrys('js'),
    STATIC_PATH = vars.STATIC_PATH,
    SUB_PATH = vars.SUB_PATH,
    BASE_DIR = vars.BASE_DIR

module.exports = merge(base_config, {
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.less$/,
                loader: 'style!css!less'
            }
        ]
    },
    plugins: Object.keys(HTML_ENTRYS).map(function(key) {
        var entry = HTML_ENTRYS[key],
            filename = entry.replace(path.resolve(__dirname, BASE_DIR), '')
        var config = {
            filename: path.join(STATIC_PATH, filename),
            template: entry,
            inject: true
        }
        if (JS_ENTRYS.hasOwnProperty(key)) {
            config.chunks = [key]
        } else {
            config.chunks = []
        }
        return new HtmlWebpackPlugin(config)
    })
})