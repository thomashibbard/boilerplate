const gulp = require('gulp')
	, browsersync = require('browser-sync').create()
	, path = require('path')
	, wiredep = require('wiredep').stream
	, inject = require('gulp-inject')
	, webpack = require('webpack-stream')
	, glob = require('glob')
	, gutil = require('gulp-util')
	, sass = require('gulp-sass')
	, autoprefixer = require('gulp-autoprefixer')
	,	jshint = require('gulp-jshint')
	, jshintStylish = require('jshint-stylish')
	,	sourcemaps = require('gulp-sourcemaps')
	,	scsslint = require('gulp-scss-lint')
	, argv = require('yargs').argv;

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

	if(argv.port){
		const PORT = argv.port;
		browsersync.init({
			proxy: 'http://' + config.ip + ':' + PORT + '/'
		});
	}else{
			browsersync.init({
			server: '.',
			files: [
			'./bower_components/**/*.css',
			'./bower_components/**/*.js',
			'./dist/**/*.css',
			'./dist/js/*.*',
			'./**/*.html'
			]
		});
	}


	gulp.watch(src.scss		+ '/**/*.scss', ['sass-lint-compile']);
	gulp.watch(src.js 		+ '/**/*.js', ['js-lint-compile']);

	gulp.watch(paths.path + '/**/*.html').on('change', browsersync.reload);

});

gulp.task('sass-lint-compile', ['scss-lint', 'compile-sass'], function(){
	console.log('completed sass linting and compiling');
});
gulp.task('js-lint-compile', ['js-lint', 'webpack'], function(){
	console.log('completed linting and packing');
})

gulp.task('compile-sass', function() {
	return gulp.src(src.scss + '/main.scss')
	  .pipe(sourcemaps.init())
	  .pipe(sass().on('error', sass.logError))
	  .pipe(sourcemaps.write())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'Explorer 9']
		}))
		.pipe(sass())
		.pipe(gulp.dest(dist.css))
		//.pipe(browsersync.reload({stream: true}));
});

gulp.task('scss-lint', function() {
	return gulp.src(src.scss + '/**/*.scss')
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
		.pipe(jshint.reporter(jshintStylish));
});


gulp.task('wire-vendor', function() {
	gulp.src(src.index)
    .pipe(wiredep({}))
	 .pipe(gulp.dest('.'));
});

gulp.task('wire-own', function() {
	console.log('CSS', dist.css + '/main.css');
	gulp.src(src.index)
	 .pipe(inject(gulp.src([dist.js + '/**/*.js', dist.css + '/main.css'], {read: false})))
	 .pipe(gulp.dest('.'));
});

gulp.task('webpack', function() {

	var webpackConfig = {
	  output: {
	    filename: 'app.bundle.js'
	  },
	  devtool: 'sourcemap',
	  debug: true
	};

	gulp.src(glob.sync(src.js + '/**/*.js'))
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest(dist.js));

});



