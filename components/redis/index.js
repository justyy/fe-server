'use strict'

var redis = require('redis'),
    config = global.getConfig(),
    logger = global.getLogger('redis')

var client = module.exports = require('co-redis')(redis.createClient(config.redis))

client.on('connect', function() {
    logger.info('Redis:\n','connect!')
})
