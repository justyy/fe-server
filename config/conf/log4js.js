var path = require('path')

exports.default = {
	cwd: path.resolve(__dirname, '../logs'),
	appenders: [
	    { type: 'console' },
	    { type: 'file', filename: path.resolve(__dirname, '../../logs/access.log'), category: 'http' },
		{ type: 'file', filename: path.resolve(__dirname, '../../logs/error.log'), category: 'error' },
		{ type: 'file', filename: path.resolve(__dirname, '../../logs/mongo.log'), category: 'mongo' }
	],
	levels: {
		'[all]': 'INFO',
        http: 'ALL',
        error: 'ERROR'
	}
}