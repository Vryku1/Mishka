// Packages
var
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	cleanCss = require('gulp-clean-css'),
	del = require('del'),
	gulp = require('gulp'),
	htmlmin = require('gulp-htmlmin'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps');

// Path variables
var path = {
	clean: 'dist',
	html: {
		src: 'app/*.html',
		dest: 'dist',
		watch: 'app/*.html'
	},
	styles: {
		src: 'app/sass/main.scss',
		dest: 'dist/css',
		watch: 'app/sass/**/*.scss'
	},
	fonts: {
		src: 'app/fonts/**/*.{woff, woff2}',
		dest: 'dist/fonts',
		watch: 'app/fonts'
	},
	serve: {
		baseDir: 'dist',
		index: 'index.min.html'
	}
};

// Clean
function clean() {
	return del(path.clean);
}

// HTML
function html() {
	return gulp.src(path.html.src)
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(path.html.dest));
}

// CSS
function styles() {
	return gulp.src(path.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'extended' }).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: [ 'last 2 versions' ],
			cascade: false
		}))
		.pipe(cleanCss({ level: 2 }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.styles.dest));
}

// Fonts
function fonts() {
	return gulp.src(path.fonts.src)
		.pipe(gulp.dest(path.fonts.dest));
}

// Server + watch
function serve() {
	browserSync.init({
		server: {
			baseDir: path.serve.baseDir,
			index: path.serve.index
		},
		notify: false
	});

	gulp.watch(path.html.watch, html);
	gulp.watch(path.styles.watch, styles);
	gulp.watch(path.fonts.watch, fonts);
}

// Build
var build = gulp.series(clean, gulp.parallel(html, styles, fonts));

// Build + serve
var start = gulp.series(build, serve);

// Declare tasks
exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.fonts = fonts;
exports.build = build;
exports.start = start;
exports.default = start;
