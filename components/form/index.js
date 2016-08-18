'use strict'
var koaBody = require('koa-body'),
    config = global.getConfig()

module.exports = function(app) {
    app.use(koaBody(config.form))
}
