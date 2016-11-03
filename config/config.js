var path = require('path')

exports = module.exports = {
    entry: '/1.0.0/index.html',
    version: '1.0.0',
    revision: true,
    port: 3000,
    routerPath: path.resolve(__dirname, '../controllers'),
    inject: {
        version: '2.0.0'
    }
}
