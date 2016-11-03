'use strict'
var httpProxy = require('http-proxy'),
    config = getConfig('proxy')
var proxy = httpProxy.createProxyServer()

proxy.on('proxyReq', function(proxyReq, req, res, options) {

})

module.exports = function(app) {
    app.use(function*(next) {
        var req = this.req,
            res = this.res
        if (config[this.path]) {
            let option = config[this.path]
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