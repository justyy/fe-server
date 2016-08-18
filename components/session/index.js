'use strict'

var redisStore = require('koa-redis'),
    session = require('koa-generic-session')

var config = global.getConfig()

module.exports = function(app) {
    app.keys = config.sessionKeys
    app.use(session({
    	store: redisStore()
    }))
}
