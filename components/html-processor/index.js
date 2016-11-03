'use strict'
var path = require('path'),
    fs = require('fs'),
    injection = requireMod('injection'),
    config = getConfig(),
    staticConfig = getConfig('staticConfig'),
    url = require('url')

var cache = requireMod('cache')

var isHtml = function(input) {
    if (!input) return false
    input = url.parse(input)
    if (input = input.pathname) {
        return path.extname(input) === '.html' || path.extname(input) === '.htm'
    } else {
        return false
    }
}

var getContent = function(url) {
    var trueFile = path.join(staticConfig.dir, url)
    if (cache.has(url)) {
        this.set('html-cache', 'hint')
        return cache.get(url)
    } else {
        let html = fs.readFileSync(trueFile,'utf-8')
        html = injection(html)
        cache.set(url, html, {
            config: 'html'
        })
        return html
    }
}

module.exports = function(app) {
    app.use(function*(next) {
        if (config.revision === false) {
            yield next
        } else {
            var route_url = this.url
            if (route_url === '/') {
                route_url = config.entry
                return this.redirect(route_url)
            }
            if (isHtml(route_url)) {
                this.type = 'html'
                this.body = getContent.call(this, url.parse(route_url).pathname)
            } else {
                yield next
            }
        }
    })
}