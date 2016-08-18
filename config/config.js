'use strict'
var _ = require('lodash'),
	path = require('path')

var config = {
	production: {
		db: 'mongodb://127.0.0.1:27017/app',
		mc: '127.0.0.1:11211',
		redis: {
			host: '127.0.0.1',
			port: 6379
		}
	},
	development: {
		db: 'mongodb://127.0.0.1:27017/app',
		mc: '127.0.0.1:11211',
		redis: {
			host: '127.0.0.1',
			port: 6379
		}
	}
}

var log4js = {
	cwd: path.resolve(__dirname, '../logs'),
	appenders: [
	    { type: 'console' },
	    { type: 'file', filename: path.resolve(__dirname, '../logs/access.log'), category: 'http' },
		{ type: 'file', filename: path.resolve(__dirname, '../logs/error.log'), category: 'error' },
		{ type: 'file', filename: path.resolve(__dirname, '../logs/mongo.log'), category: 'mongo' }
	],
	levels: {
		'[all]': 'INFO',
        http: 'ALL',
        error: 'ERROR'
	}
}

var htmlMinifier = {
	collapsesWhitespace: true,
	removeComments: true,
	minifyCSS: true,
	minifyJS: {
		compress: {
			drop_console: true
		}
	}
}

var staticConfig = {
	maxAge: config.env === 'production' ? 24 * 60 * 60 : 0
}

var template = {
	root: path.join(__dirname, '../views'),
	autoescape: true,
	cache: config.env === 'production' ? 'memory' : false,
	ext: 'swig',
	// varControls: ['[[', ']]']
	// locals: locals,
	// filters: filters,
	// tags: tags,
	// extensions: extensions
}

var jwt = {
	secret: 'secret',
	passthrough: true
}

var form = {
	multipart: true,
	formidable: {
		keepExtensions: true,
		hash: 'sha1'
	}
}

var captcha = {
	url: '/captcha.jpg',
	length: 4,
	fontSize: 3,
	width: 100,
	height: 50
}

module.exports = _.assign({}, config[process.env.NODE_ENV || 'development'], {
	env: process.env.NODE_ENV || 'development',
	port: 3000,
	sessionKeys: ['sessionKey'],
	routerPath: path.resolve(__dirname, '../controllers'),
	log4js,
	htmlMinifier,
	staticConfig,
	template,
	jwt,
	form,
	captcha
})
