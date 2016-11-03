'use strict'
var config = getConfig('staticConfig'),
    path = require('path'),
    fs = require('fs')

var cache = requireMod('cache')

const CACHE_KEY = 'FAVICON'

module.exports = function(app) {
    app.use(function*(next) {
        var url = this.url,
            ret
        if (url === '/favicon.ico') {
            if (cache.has(CACHE_KEY)) {
                this.set('cache','hint')
                ret = cache.get(CACHE_KEY)
            } else {
                ret = fs.readFileSync(path.resolve(config.dir, 'favicon.ico'))
                cache.set(CACHE_KEY, ret)
            }
            this.type = 'image/x-icon'
            this.body = ret
        } else {
            yield next
        }
    })
}
