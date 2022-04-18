import gulp from 'gulp';
import babel from 'gulp-babel';
import terser from 'gulp-terser';
import less from 'gulp-less';
import htmlmin from 'gulp-htmlmin';
import sync from 'browser-sync';
import cleanCSS from "gulp-clean-css";
import fileinclude from "gulp-file-include";
import del  from "del";
import sourcemaps  from "gulp-sourcemaps";

// HTML

export const html = () => {
	return gulp.src('src/index.html')
		.pipe(
			fileinclude({
				prefix: "@",
				basepath: "@file",
			})
		)
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true,
		}))
		.pipe(gulp.dest('dist'))
		.pipe(sync.stream());
};

// Styles



export const styles = () => {
	return gulp.src('src/less/*.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(
			cleanCSS({
				level: 2,
			})
		)
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('dist/css'))
		.pipe(sync.stream());
};
// Scripts

export const scripts = () => {
	return gulp.src('src/js/main.js')
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(terser())
		.pipe(gulp.dest('dist/js'))
		.pipe(sync.stream());
};

export const clean = () => {
	return del(["dist"]);
};

// Watch

export const watch = () => {
	sync.init({
		ui: false,
		notify: false,
		server: {
			baseDir: 'dist'
		}
	});
	gulp.watch('src/*.html', gulp.series(html));
	gulp.watch('src/less/*.less', gulp.series(styles));
	gulp.watch('src/js/*.js', gulp.series(scripts));
};

// Default

export default gulp.series(clean,
	gulp.parallel(
		html,
		styles,
		scripts,
	),
	watch
);