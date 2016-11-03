var path = require('path')

exports.default = {
	root: path.join(__dirname, '../../views'),
	autoescape: true,
	ext: 'swig',
	// varControls: ['[[', ']]']
	// locals: locals,
	// filters: filters,
	// tags: tags,
	// extensions: extensions
}

exports.prod = {
    cache: 'memory'
}

exports.dev = {
    cache: false
}