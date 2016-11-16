'use strict'
var util = require('util')
var routerMap = getConfig('routerMap'),
    pathToRegexp = require('path-to-regexp')

var config = getConfig()

function replaceParams(redirectUrl, vars) {
    var reg = new RegExp('\\$', 'g'),
        vars = Object.assign({}, config, vars)
    redirectUrl = redirectUrl.replace(reg, ':')
    return pathToRegexp.compile(redirectUrl)(vars)
}

function getRouterVars(vars, matched) {
    var ret = {}
    vars.forEach(function(key, index) {
        ret[key] = matched[index]
    })
    return ret
}

const ROUTER_MAP_REGS = {}

Object.keys(routerMap).forEach(function(key) {
    ROUTER_MAP_REGS[key] = pathToRegexp(key)
})

module.exports = function(app) {
    app.use(function* (next) {
        var req = this.request,
            url = req.url
        if (url === '/') {
            if (!config.entry) {
                yield next
            } else {
                this.redirect(config.entry)
            }
            return
        }
        for (var i in ROUTER_MAP_REGS) {
            if (ROUTER_MAP_REGS.hasOwnProperty(i)) {
                var reg = ROUTER_MAP_REGS[i],
                    vars = reg.keys.map(function(key) {
                        return key.name
                    }),
                    matched = url.match(reg)
                if (matched) {
                    if (util.isFunction(routerMap[i])) {
                        routerMap[i].apply(this, matched.slice(1))
                    } else if (util.isString(routerMap[i])) {
                        vars = getRouterVars(vars, matched.slice(1))
                        this.redirect(replaceParams(routerMap[i], vars))
                    }
                    break
                }
            }
        }
        yield next
    })
}
