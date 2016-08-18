'use strict'

var config = global.getConfig(),
    staticServe = require('koa-static-cache')

module.exports = function(app) {
    app.use(staticServe('./public/', config.staticConfig))
}
