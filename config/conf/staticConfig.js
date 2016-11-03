var path = require('path'),
	config = getConfig()

exports.default = {
	dir: path.join(__dirname, '../../public'),
	alias: {
		'/': config.entry
	}
}

exports.prod = {
    maxAge: 24 * 60 * 60
}

exports.dev = {
    maxAge: 0
}