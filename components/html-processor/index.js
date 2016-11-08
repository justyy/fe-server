'use strict'
var path = require('path'),
    fs = require('fs'),
    injection = requireMod('injection'),
    staticConfig = getConfig('staticConfig'),
    url = require('url'),
    html_processor_config = getConfig('html-processor'),
    config = getConfig()

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
        if (config.livereload) {
            html += '<script src="http://localhost:35729/livereload.js"></script>'
        }
        if (config.env === 'production') {
            cache.set(url, html, {
                config: 'html'
            })
        }
        return html
    }
}

module.exports = function(app) {
    app.use(function*(next) {
        if (html_processor_config.enabled) {
            var route_url = this.url
            if (isHtml(route_url)) {
                this.type = 'html'
                this.body = getContent.call(this, url.parse(route_url).pathname)
            } else {
                yield next
            }
        } else {
            yield next
        }
    })
}