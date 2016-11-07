var path = require('path')

exports.default = {
	root: path.join(__dirname, '../../views'),
	layout: 'template',
	viewExt: 'html'
}

exports.prod = {
    cache: false,
	debug: true
}

exports.dev = {
    cache: true
}