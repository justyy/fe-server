'use strict'

var Memcached = require('co-memcached'),
    config = global.getConfig()

module.exports = new Memcached(config.mc)
