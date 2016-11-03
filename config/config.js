var path = require('path')

exports = module.exports = {
    entry: '',
    revision: true,
    port: 3000,
    routerPath: path.resolve(__dirname, '../controllers'),
    inject: {
        version: '2.0.0'
    }
}
