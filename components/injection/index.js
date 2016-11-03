var fs = require('fs'),
    path = require('path'),
    config = getConfig()

var isObject = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

var replaceVars = function(html) {
    var inject = config.inject
    Object.keys(inject).forEach(function(key) {
        var data = inject[key]
        if (isObject(data)) {
            data = JSON.stringify(data)
        }
        html = html.replace('{{' + key +'}}', data)
    })
    return html
}

module.exports = replaceVars