var mongoose = require('mongoose'),
    config = getConfig(),
    db = mongoose.connection

var log4js = require('koa-log4'),
    logger = log4js.getLogger('mongo')


db.on('error', function() {
    logger.error('mongoError:\n', 'connection error')
})
db.once('open', function() {
    logger.info('mongo:\n', 'connect!')
})

mongoose.Promise = global.Promise

module.exports = mongoose.connect(config.db)
