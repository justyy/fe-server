'use strict'

var path = require('path'),
    swig = require('koa-swig'),
    config = global.getConfig()

module.exports = function(app) {
    app.context.render = swig(config.template)
}
