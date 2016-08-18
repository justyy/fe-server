var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	livereload = require('gulp-livereload')

var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')

gulp.task('nodemon', function() {
	nodemon({
		script: 'index.js',
		execMap: {
			js: "node" // --harmony
		},
		ext: 'js html swig scss',
		env: {
			'NODE_ENV': 'development'
		},
		ignore: ['node_modules/**', 'static/**']
	}).on('restart', function() {
		console.log('restarted!')
	})
})

gulp.task('sass',function(){
    return gulp.src('public/**.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['Chrome > 1'],
            cascade: true
        }))
        .pipe(gulp.dest('public/style/'))
        .pipe(livereload())
})

gulp.task('watch',function(){
    return gulp.watch('public/style/**.scss',['sass'])
})

gulp.task('default',['nodemon','watch'],function(){

})
