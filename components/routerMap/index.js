'use strict'
var util = require('util')
var routerMap = getConfig('routerMap')

function makeReg(str) {
    var vars = []
    str = str.replace(/\?/g,'\\?')
    str = str.replace(/:[A-Za-z]*/g,function(key) {
        vars.push(key.slice(1))
        return '([^\/]*)'
    })
    return {
        reg: new RegExp(str),
        vars
    }
}

function replaceParams(redirectUrl, vars) {
    Object.keys(vars).forEach(function(key) {
        redirectUrl = redirectUrl.replace('$' + key, vars[key])
    })
    return redirectUrl
}

function getRouterVars(vars, matched) {
    var ret = {}
    vars.forEach(function(key, index) {
        ret[key] = matched[index]
    })
    return ret
}

module.exports = function* (next) {
    var req = this.request,
        url = req.url
    for (var i in routerMap) {
        if (routerMap.hasOwnProperty(i)) {
            var result = makeReg(i),
                reg = result.reg,
                vars = result.vars,
                matched = reg.exec(url)
            if (matched) {
                if (util.isFunction(routerMap[i])) {
                    routerMap[i].apply(this, matched.slice(1))
                } else if (util.isString(routerMap[i])) {
                    var vars = getRouterVars(vars, matched.slice(1))
                    this.redirect(replaceParams(routerMap[i], vars))
                }
                break
            }
        }
    }
    yield next
}
