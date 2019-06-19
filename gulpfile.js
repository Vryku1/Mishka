// Packages
var
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	cleanCss = require('gulp-clean-css'),
	del = require('del'),
	gulp = require('gulp'),
	htmlmin = require('gulp-htmlmin'),
	imagemin = require('gulp-imagemin'),
	imageminPngquant = require('imagemin-pngquant'),
	imageminMozjpeg = require('imagemin-mozjpeg'),
	imageminWebp = require('imagemin-webp'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	svgstore = require('gulp-svgstore'),
	uglify = require('gulp-uglify');

// Paths
var path = {
	clean: {
		del: 'dist'
	},
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
	scripts: {
		src: 'app/js/*.js',
		dest: 'dist/js',
		watch: 'app/js/*.js'
	},
	libs: {
		src: 'app/libs/*.js',
		dest: 'dist/js',
		watch: 'app/libs/*.js'
	},
	images: {
		src: 'app/img/**/*.{png,jpg,jpeg}',
		dest: 'dist/img',
		watch: 'app/img/**/*.{png,jpg,jpeg}'
	},
	svg: {
		src: [
			'app/img/*.svg',
			'!app/img/icon-*.svg'
		],
		dest: 'dist/img',
		watch: [
			'app/img/*.svg',
			'!app/img/icon-*.svg'
		]
	},
	sprite: {
		src: 'app/img/icon-*.svg',
		dest: 'dist/img',
		watch: 'app/img/icon-*.svg'
	},
	fonts: {
		src: 'app/fonts/*.{woff,woff2}',
		dest: 'dist/fonts',
		watch: 'app/fonts/*.{woff,woff2}'
	},
	server: {
		baseDir: 'dist',
		directory: true
	}
};

// Clean
function clean() {
	return del(path.clean.del);
}

// HTML
function html() {
	return gulp.src(path.html.src)
		.pipe(htmlmin({
			collapseWhitespace: true,
			minifyCSS: true,
			minifyJS: true
		}))
		.pipe(gulp.dest(path.html.dest))
		.pipe(browserSync.reload({
			stream: true
		}));
}

// Styles
function styles() {
	return gulp.src(path.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'extended'
		}).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cleanCss({
			level: 2
		}))
		.pipe(rename({
			basename: 'styles'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.styles.dest))
		.pipe(browserSync.stream());
}

// Scripts
function scripts() {
	return gulp.src(path.scripts.src)
		.pipe(sourcemaps.init())
		.pipe(uglify({
			toplevel: true
		}))
		.pipe(rename({
			basename: 'scripts'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.scripts.dest))
		.pipe(browserSync.reload({
			stream: true
		}));
}

// Libs
function libs() {
	return gulp.src(path.libs.src)
		.pipe(sourcemaps.init())
		.pipe(uglify({
			toplevel: true
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.libs.dest))
		.pipe(browserSync.reload({
			stream: true
		}));
}

// Images (PNG, JPG, JPEG, WebP)
function images() {
	return gulp.src(path.images.src)
		.pipe(imagemin([
			imagemin.optipng({
				optimizationLevel: 3
			}),
			imageminPngquant({
				quality: [0.95, 1],
				speed: 1
			}),
			imagemin.jpegtran({
				progressive: true
			}),
			imageminMozjpeg({
				quality: 90
			})
		]))
		.pipe(gulp.dest(path.images.dest))
		.pipe(imagemin([
			imageminWebp({
				quality: 90
			})
		]))
		.pipe(rename({
			extname: '.webp'
		}))
		.pipe(gulp.dest(path.images.dest));
}

// SVG
function svg() {
	return gulp.src(path.svg.src)
		.pipe(imagemin([
			imagemin.svgo()
		]))
		.pipe(gulp.dest(path.svg.dest));
}

// SVG-sprite
function sprite() {
	return gulp.src(path.sprite.src)
		.pipe(imagemin([
			imagemin.svgo()
		]))
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(rename({
			basename: 'sprite'
		}))
		.pipe(gulp.dest(path.sprite.dest));
}

// Fonts
function fonts() {
	return gulp.src(path.fonts.src)
		.pipe(gulp.dest(path.fonts.dest));
}

// Server + watch
function serve() {
	browserSync.init({
		server: path.server,
		notify: false,
		tunnel: true
	});

	gulp.watch(path.html.watch, html);
	gulp.watch(path.styles.watch, styles);
	gulp.watch(path.scripts.watch, scripts);
	gulp.watch(path.libs.watch, libs);
	gulp.watch(path.images.watch, images);
	gulp.watch(path.svg.watch, svg);
	gulp.watch(path.sprite.watch, sprite);
	gulp.watch(path.fonts.watch, fonts);
}

// Build
var build = gulp.series(clean, gulp.parallel(html, styles, scripts, libs, images, svg, sprite, fonts));

// Build + serve
var start = gulp.series(build, serve);

// Declare tasks
exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.libs = libs;
exports.images = images;
exports.svg = svg;
exports.sprite = sprite;
exports.fonts = fonts;
exports.serve = serve;
exports.build = build;
exports.start = start;
exports.default = start;
