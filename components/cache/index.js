var LRU = require('lru-cache'),
    cache_config = getConfig('cache')

var CACHE = {}

var Cache = {
    has: function(key) {
        return CACHE.hasOwnProperty(key)
    },
    get: function(key) {
        if (!CACHE[key]) return
        return CACHE[key].get(key)
    },
    set: function(key,val,extra) {
        extra = extra || {}
        var config
        if (extra.config) {
            config = cache_config[extra.config.toLowerCase()]
        } else {
            config = cache_config[key.toLowerCase()]
        }
        if (!config) {
            config = cache_config.default || {
                max: 1000,
                maxAge: 1000 * 60 * 60
            }
        }
        CACHE[key] = LRU(config)
        CACHE[key].set(key,val)
        return CACHE[key]
    },
    del: function(key) {
        if (!CACHE[key]) return
        CACHE[key].clear()
        CACHE[key] = null
        delete CACHE[key]
    }
}

module.exports = Cache