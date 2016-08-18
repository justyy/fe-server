'use strict'

var jwt = require('koa-jwt'),
    config = global.getConfig()

module.exports = function(app) {
    app.use(jwt(config.jwt))
}
