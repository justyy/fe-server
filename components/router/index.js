'use strict'
var fs = require('mz/fs'),
    path = require('path'),
    router = require('koa-router')()

var config = global.getConfig()

const CONTROLLER_PATH = config.routerPath

module.exports = function*(app) {
    var routers = {}
    var controllers = yield fs.readdir(CONTROLLER_PATH)
    for (var i = 0, l = controllers.length; i < l; i++) {
        var dir = path.join(CONTROLLER_PATH, controllers[i])
        var stat = yield fs.stat(dir)
        if (stat.isDirectory()) {
            var ns = path.basename(controllers[i])
            var controller = path.join(CONTROLLER_PATH, controllers[i], ns + '.js')
            var exists = yield fs.exists(controller)
            if (exists) {
                let subRouter = require('koa-router')()
                routers[ns] = subRouter
                controller = require(controller)
                if (typeof controller === 'function') {
                    controller(subRouter)
                }
                controller = null
            }
        } else if (stat.isFile() && path.extname(dir) === '.js') {
            var controller = require(dir)
            if (typeof controller === 'function') {
                controller(router)
            }
            controller = null
        }
    }
    Object.keys(routers).forEach(function(ns) {
        var subRouter = routers[ns]
        router.use('/' + ns, subRouter.routes(), subRouter.allowedMethods())
    })
	app.use(router.routes(), router.allowedMethods())
    routers = null
}
