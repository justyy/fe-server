var mongoose = require('mongoose')

var User = mongoose.Schema({
    name: {
        type: String,
        validate: {
            validator(value) {
                return /[\u4e00-\u9faf]{1,20}/.test(value)
            },
            message: '{VALUE} is unvalid'
        },
        required: [true, 'name is required']
    },
    age: Number,
    tags: {
        type: Array,
        default: []
    }
})

User.methods.test = function() {}

User.static.name = 'user'

module.exports = mongoose.model('User', User)
