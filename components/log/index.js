var log4js = require('koa-log4'),
    config = getConfig()

log4js.configure(getConfig('log4js'))

module.exports = function(app) {
    if (config.env !== 'production') {
        app.use(log4js.koaLogger(log4js.getLogger('http'),{level: 'auto'}))
    }
}