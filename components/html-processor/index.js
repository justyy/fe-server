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

var fileExists = function(route_url) {
    route_url = url.parse(route_url).pathname
    var trueFile = path.join(staticConfig.dir, route_url)
    try {
        fs.accessSync(trueFile)
    } catch (e) {
        return false
    }
    return true
}

var isPath = function(route_url) {
    route_url = path.join(staticConfig.dir, route_url)
    try {
        var stat = fs.statSync(route_url)
        return stat.isDirectory()
    } catch (e) {
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
            // 如果是根目录，判断目录下是否有index.html文件
            // todo 增加动态路由过滤
            if (isPath(route_url)) {
                if (!route_url.endsWith('/')) {
                    route_url += '/'
                }
                route_url += 'index.html'
            }
            if (isHtml(route_url)) {
                if (fileExists(route_url)) {
                    this.type = 'html'
                    this.body = getContent.call(this, url.parse(route_url).pathname)
                } else {
                    yield next
                }
            } else {
                yield next
            }
        } else {
            yield next
        }
    })
}