var User = requireModel('user'),
    logger = global.getLogger('api')
module.exports = function(api) {
    api.use(function*(next) {
        var origin = this.get('origin') || '*'
        var header = {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': origin
          }
        this.set(header)
        yield next
    })
    api.get('/test',function*() {
        this.body = {
            code: 200,
            msg: 'apitest'
        }
    })
    api.get('/get', function*() {
        var ret = yield User.find({
            tags: {
                $in: ['tagA']
            }
        })
        this.body = ret
    })
    api.post('/add', function*() {
        var body = this.request.body
        var user = new User({
            name: body.name,
            age: 20,
            tags: ['tagA','tagB']
        })
        try {
            yield user.validate()
            var ret = yield user.save()
            this.body = ret
        } catch (err) {
            logger.error('APIEroor\n',err)
            this.body = err
        }
    })
}
