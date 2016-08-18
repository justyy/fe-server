'use strict'
var koa = require('koa'),
	fs = require('mz/fs'),
	path = require('path'),
	co = require('co'),
	log4js = require('koa-log4'),
	process = require('process'),
	app = koa()

global.getConfig = function() {
	return require('./config/config')
}

global.getLogger = function(cat) {
	return log4js.getLogger(cat)
}

global.requireMod = function(mod) {
	return require('./components/' + mod)
}

global.requireModel = function(model) {
	return require('./model/' + model)
}

var config = global.getConfig()

if (config.env === 'production') {
	app.use(require('koa-etag')())
	app.use(require('koa-fresh')())
	app.use(require('koa-html-minifier')(config.htmlMinifier))
} else {
	app.use(require('koa-livereload')())
}

app.use(require('koa-favicon')(__dirname + '/static/favicon.png'))

if (config.env !== 'production') {
	app.use(require('koa-error')())
	log4js.configure(config.log4js)
	app.use(log4js.koaLogger(log4js.getLogger("http")))
}

requireMod('session')(app)
requireMod('staticServer')(app)
requireMod('form')(app)
requireMod('template')(app)

var ErrorLogger = log4js.getLogger('error')

co(function*() {
	app.context.redis = require('./components/redis')
	yield require('./components/mongoose')
	yield require('./components/router')(app)
	app.listen(config.port)
}).catch(function(err) {
    ErrorLogger.error('koaError:\n', err.stack)
})

process.on('uncaughtException', function (err) {
    ErrorLogger.error('uncaughtException:\n', err.stack)
})
.on('unhandledRejection', function(err) {
    ErrorLogger.error('unhandledRejection:\n', err.stack)
});
