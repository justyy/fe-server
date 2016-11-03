'use strict'

var path = require('path'),
    swig = require('koa-swig'),
    config = getConfig('template')

module.exports = function(app) {
    app.context.render = swig(config)
}
