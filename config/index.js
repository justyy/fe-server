'use strict'
var path = require('path'),
    fs = require('fs'),
    version = requireMod('version')

const ENV = process.env.NODE_ENV || 'development'

const MAPS = {
    development: 'dev',
    production: 'prod'
} 

var configs = {
    development: require('./config.dev'),
    production: require('./config.prod')
}

var config = require('./config')

var getConfs = function() {
    var confs = {}
    var conf_files = fs.readdirSync(path.resolve(__dirname, './conf'))
    conf_files.forEach(function(key) {
        var conf = require(path.resolve(__dirname, './conf', key))
        key = key.replace(path.extname(key), '')
        if (conf.default) {
            confs[key] = conf.default
        } else {
            confs[key] = {}
        }
        let env_conf = conf[MAPS[ENV]]
        if (env_conf) {
            Object.assign(confs[key], env_conf)
        }
        env_conf = conf = null
    })
    return confs
}

config = exports = module.exports = Object.assign({}, config, configs[ENV])

exports.getConfig = function(key) {
    if (!key) {
        return config
    }
	var module = require(path.resolve(__dirname, './conf', key)),
		conf = {}
	if (module.default) {
		conf = module.default
	}
	var env_conf = module[MAPS[ENV]]
	if (env_conf) {
		Object.assign(conf, env_conf)
	}
	env_conf = module = null
	return conf
}
