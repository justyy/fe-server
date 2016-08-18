'use strict'
var mongodb = require('mongodb').MongoClient,
	config = global.getConfig()

module.exports = {
	connect: function*() {
		if (!this.db) {
			this.db = yield mongodb.connect(config.db)
		}
		return this.db
	}
}
