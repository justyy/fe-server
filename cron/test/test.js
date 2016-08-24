'use strict'

exports.type = 'interval'

exports.config = {
    enable: false,
    delay: 2,
    callback: function() {
        return Promise.reject('xxxx')
    },
    repeat: 3,
    name: 'test cron'
}
