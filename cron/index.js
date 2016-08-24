'use strict'

var cron = requireMod('cron'),
    fs = require('fs'),
    path = require('path')

function getEntry(dir, result) {
    var fss = fs.readdirSync(dir)
    fss.forEach(function(f) {
        f = path.join(dir,f)
        var stat = fs.statSync(f)
        if (stat.isDirectory()) {
            getEntry(f,result)
        } else {
            var ext = path.extname(f)
            if (ext !== '.js') return
            if (path.basename(f).replace(ext, '') === path.dirname(f).split(path.sep).pop()) {
                result.push(f)
            }
        }
    })
}

var result = []

getEntry(__dirname,result)

result.forEach(function(entry) {
    var task = require(entry) || {}
    if (!task.enable) return
    if (task.type) {
        switch (task.type) {
            case 'interval':
                cron.interval(task.config)
                break
            case 'schedule':
                cron.schedule(task.config)
                break
        }
    }
})

// cron.interval({
//     delay: 1000,
//     callback: function() {
//         return Promise.reject('xxxx')
//     },
//     repeat: 3,
//     name: 'test cron'
// })

// cron.schedule({
//     delay: 10,
//     args: [1,2],
//     callback: function(a,b) {
//         console.log('hello',a,b)
//     }
// })
