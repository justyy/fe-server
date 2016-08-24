'use strict'
var httpProxy = require('http-proxy'),
    config = global.getConfig()
var proxy = httpProxy.createProxyServer()

proxy.on('proxyReq', function(proxyReq, req, res, options) {

})

module.exports = function(app) {
    app.use(function*(next) {
        var proxyConfig = config.proxy
        var req = this.req,
            res = this.res
        if (proxyConfig[this.path]) {
            let option = proxyConfig[this.path]
            yield new Promise(function(resolve,reject) {
                proxy.web(req, res, option,function(err) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(null)
                    }
                })
            })
        } else {
           yield next 
        }
    })
}