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

var proxy = {
    '/admin/plat/10000001/materials/image_text': {
        target: 'http://gateway.dev.terran.wxpai.cn',
        prependPath: false,
        // ignorePath: true,
        changeOrigin: true,
        headers: {
            Cookie:'_jwt=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NzUxMTAwNjQsInVzZXJfbmFtZSI6InNoYWRvdyIsInVzZXJfZGV0YWlsIjoie1widXNlcm5hbWVcIjpcInNoYWRvd1wiLFwidXNlcklkXCI6MTAwNDUsXCJlbnRJZFwiOjEwNTMxfSIsImp0aSI6IjNiMzIxOTRiLWVjNDYtNDU0OC05MGFiLTg3M2NjN2RkZTA0MCIsImNsaWVudF9pZCI6InBpcGx1cy1iYWNrZW5kIiwic2NvcGUiOlsiYWRtaW4iXX0.g9jKC-eXAAUdJA7rk8pPn6y5D8Y79pBtFFPpJUyDpk2r9DIDQO2Vya1pxgnTYVAuOrzuDV-MpxTz8fTd2Cyq1oUj8_c0G9dgmOqdSveiz0gwmd4RQtT9SyJZ1m2ifZLN_rFnd-Az0pqdRV5FjQJprCY2yn46iaqgW6x6Q7vZf5o; _jwt_refresh=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJzaGFkb3ciLCJ1c2VyX2RldGFpbCI6IntcInVzZXJuYW1lXCI6XCJzaGFkb3dcIixcInVzZXJJZFwiOjEwMDQ1LFwiZW50SWRcIjoxMDUzMX0iLCJzY29wZSI6WyJhZG1pbiJdLCJhdGkiOiIzYjMyMTk0Yi1lYzQ2LTQ1NDgtOTBhYi04NzNjYzdkZGUwNDAiLCJleHAiOjE0NzUxMTAwNjQsImp0aSI6ImRlNzA3MmQ3LTU2ZTctNDQwZC04NTAxLWFiYmUyNGZlOWZmNyIsImNsaWVudF9pZCI6InBpcGx1cy1iYWNrZW5kIn0.DnsaW-bCHMKHpSlOgw5Zn-FmUlzDq4sOzXxpm7NgZ1gVVRbJdJ55U5dttTkMQONxw0KnHJ687iOUTYlaHn0Y9pqkFO9X974RfcjZytf2SlBV8rAHOEQGH7PjvUK4YwCZx-iYmZOTf7HB1rkSAxF2SvwLpsW0IG1cfCc8MPdFKno; crowd.token_key=M0dWmTH0ItF1P2DRtDpQLg00'
        }
    }
}

var routerMap = {
	'/adsdad/:id/:fu': function(id,fu) {
		console.log(id,fu)
	},
	'/test/:id?id=:ab': '/$id/llll/$ab'
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
	captcha,
    proxy,
	routerMap
})
