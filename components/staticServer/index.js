'use strict'

var config = getConfig('staticConfig'),
    staticServe = require('koa-static-cache')

module.exports = function(app) {
    app.use(staticServe(config))
}
