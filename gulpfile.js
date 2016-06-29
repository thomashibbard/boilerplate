const gulp = require('gulp')
	, browsersync = require('browser-sync').create()
	, path = require('path')
	, wiredep = require('wiredep').stream
	, inject = require('gulp-inject')
	, webpack = require('webpack-stream')
	, sass = require('gulp-sass')
	, autoprefixer = require('gulp-autoprefixer')
	,	jshint = require('gulp-jshint')
	,	sourcemaps = require('gulp-sourcemaps')
	,	scsslint = require('gulp-scss-lint');

var config = {
	ip: '10.101.24.47',
	port: '4444'
};

var paths = {
	path: '.'
};

var src = {
	scss: paths.path + '/src/scss',
	js: paths.path + '/src/js',
	index: './index.html',
	html: './app/*.html'
};
var dist = {
	css: paths.path + '/dist/css',
	js: paths.path + '/dist/js'
};
gulp.task('serve', function () {

	browsersync.init({
		proxy: 'http://' + config.ip + ':' + config.port + '/'
	});

	gulp.watch(paths.path + '/**/*.scss', ['sass']);
	gulp.watch(paths.path + '/**/*.css').on('change', browsersync.reload);
	gulp.watch(paths.path + '/**/*.html').on('change', browsersync.reload);

});

gulp.task('sass', function(){
	console.log('watching ', src.scss + '/**/*.scss')
	gulp.watch([src.scss + '/**/*.scss'], ['compile-sass', 'scss-lint']);
})

gulp.task('compile-sass', function() {
	console.log('sass @', src.scss + '/main.scss');
	return gulp.src(src.scss + '/main.scss')
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'Explorer 9']
		}))
		.pipe(sass())
		.pipe(gulp.dest(dist.css))
		.pipe(browsersync.reload({stream: true}));
});

gulp.task('scss-lint', function() {
	return gulp.src(src.scss + '/**/*.scss')
		//.pipe(scssCache('scsslint'))
		.pipe(scsslint())
		.pipe(scsslint.failReporter('E'));
});

gulp.task('js-lint', function() {
	return gulp.src(src.js + '/**/*.js')
		.pipe(jshint({
			expr: true,
			jquery: true,
			curly: true
		}))
		.pipe(jshint.reporter('default'));
});


gulp.task('wire-vendor', function() {
  gulp.src(src.index)
   .pipe(wiredep({}))
   .pipe(gulp.dest('.'));
});

gulp.task('wire-own', function() {
	console.log('CSS', dist.css + '/main.css');
  gulp.src(src.index)
   .pipe(inject(gulp.src([src.js + '/**.*js', dist.css + '/main.css'], {read: false})))
   .pipe(gulp.dest('.'));
});





