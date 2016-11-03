'use strict'
var co = require('co'),
    shortid = require('shortid'),
    config = getConfig(),
    logger = getLogger('cron')
const CRON_KEY = '__cron'

var schedules = {}

var subscriberClient = require('co-redis')(require('redis').createClient(config.redis))
subscriberClient.psubscribe('__keyevent@' + 1 + '__:expired')
subscriberClient.on('pmessage', function(pattern, channel, expiredKey) {
    co(function*() {
        expiredKey = expiredKey.split(':')
        var eventType = expiredKey[0]
        switch (eventType) {
            case CRON_KEY:
                let key = expiredKey[1],
                    schedule = schedules[key]
                yield schedule.fn.apply(null, schedule.args || [])
                schedules[key] = null
                delete schedules[key]
                break
        }
    }).catch(function(err) {
        logger.error('Cron:schedule\n', err)
    })
})

var interval = function(opt) {
    opt = opt || {}
    var delay = opt.delay * 1e3
    var callback = opt.callback()
    if (typeof callback.then === 'function') {
        callback.then(function() {
            setTimeout(function() {
                interval(opt)
            }, delay)
        },function() {
            logger.error('Cron:interval\n', opt.name)
            opt.callback._errorcount = opt.callback._errorcount || 0
            ++opt.callback._errorcount
            if (opt.repeat) {
                if (opt.callback._errorcount > opt.repeat) {
                    return
                }
            }
            setTimeout(function() {
                interval(opt)
            }, delay)
        })
    } else {
        setTimeout(function() {
            interval(opt)
        }, delay)
    }
}

var schedule = function(opt) {
    opt = opt || {}
    var cronId = shortid.generate()
    var delay = opt.delay * 1e3
    if (delay < 0) {
        delay = 1
    }
    co(function* () {
        var scheduleRedis = require('co-redis')(require('redis').createClient(config.redis))
        yield scheduleRedis.select(1)
        yield scheduleRedis.del(CRON_KEY + ':' + cronId)
        schedules[cronId] = {}
        if (opt.args) {
            schedules[cronId].args = opt.args
        }
        schedules[cronId].fn = opt.callback
        yield scheduleRedis.psetex(CRON_KEY + ':' + cronId, delay, '')
    }).catch(function(err) {
        logger.error('Cron:schedule\n', err)
    })
}

module.exports = {
    schedule,
    interval
}
