'use strict'
var path = require('path'),
    fs = require('fs'),
    injection = requireMod('injection'),
    config = getConfig(),
    staticConfig = getConfig('staticConfig'),
    version = requireMod('version')

var cache = requireMod('cache')

var isHtml = function(filename) {
    var ext = path.extname(filename)
    return ext === '.html' || ext === '.htm'
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

var walk = function(dir, ignore) {
    ignore = ignore || []
    var rets = []
    rets = fs.readdirSync(dir)
    rets = rets.filter(function(ret) {
        return version.is(ret) && ret.indexOf(ignore) === -1    
    })
    return rets
}

var getDefaultEntry = function() {
    var static_dir = getConfig('staticConfig').dir
    var versions = walk(static_dir,'.DS_Store')
    return '/' + version.max(versions) + '/index.html' 
}

var default_entry

module.exports = function(app) {
    app.use(function*(next) {
        if (config.revision === false) {
            yield next
        } else {
            var url = this.url
            if (url === '/') {
                url = config.entry
                if (!url) {
                    if (!default_entry) {
                        default_entry = getDefaultEntry()
                    }
                    url = default_entry
                }
                return this.redirect(url)
            }
            if (isHtml(url)) {
                this.type = 'html'
                this.body = getContent.call(this,url)
            } else {
                yield next
            }
        }
    })
}