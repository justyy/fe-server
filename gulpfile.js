var gulp = require('gulp'),
	less = require('gulp-less'),
	nodemon = require('gulp-nodemon')

var LessAutoprefix = require('less-plugin-autoprefix'),
	autoprefixer = new LessAutoprefix({
		browsers: ['Chrome > 1']
	})

gulp.task('nodemon', function() {
	nodemon({
        verbose: true,
        nodeArgs: ['--debug'],
		script: 'index.js',
		execMap: {
			js: 'node' // --harmony
		},
		ext: 'js html swig less',
		env: {
			'NODE_ENV': 'development'
		},
		ignore: ['node_modules/**', 'public/**', 'client/**', 'views/**', 'logs/']
	}).on('restart', function() {
		console.log('restarted!')
	})
})

gulp.task('less',function(){
    return gulp.src('public/static/**.less')
        .pipe(less({
			plugins: [autoprefixer]
		}))
        .pipe(gulp.dest('public/static/'))
})

gulp.task('watch',function(){
    return gulp.watch('public/static/**.less',['less'])
})

gulp.task('default',['nodemon', 'watch', 'less'],function(){

})
