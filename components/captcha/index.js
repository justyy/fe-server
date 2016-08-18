'use strict'

var captcha = require('koa-captcha'),
    config = global.getConfig()

module.exports = function(app) {
    app.use(captcha(config.captcha))
}
