var gulp 	= require("gulp");
var ts 		= require("gulp-typescript");
var tslint 	= require("gulp-tslint");
var watch 	= require("gulp-watch");
var server 	= require('gulp-develop-server');
var cache   = require('gulp-cached');
var clean 	= require('gulp-clean');

var tsProject = ts.createProject("tsconfig.json");

var sourceFilePath = "src/**/*";
var distFolder = "dist";

gulp.task("compile", ['tslint'], function () {
	// Copy js files to dist
	gulp.src(sourceFilePath + ".js")
		.pipe(cache('copying'))
		.pipe(gulp.dest(distFolder));

	// Compile typescript files and copy to dist
    return tsProject.src()
    	.pipe(cache('compiling'))
        .pipe(tsProject())
        .js.pipe(gulp.dest(distFolder))
});

gulp.task("tslint", function() {
	tsProject.src()
		.pipe(cache('linting'))
		.pipe(tslint({
			configuration: "tslint.json"
		}))
		.pipe(tslint.report())
});

gulp.task("clean", function() {
	return gulp.src(distFolder, {read: false})
        .pipe(clean());
});

gulp.task("watch", function() {
	gulp.watch(sourceFilePath, ['tslint', 'compile']);
});

gulp.task('server:start', function() {
    server.listen( { path: './bin/start.js' } );
});

gulp.task('server:livereload', function() {
    gulp.watch(sourceFilePath, ['tslint', 'compile', server.restart]);
});

gulp.task('start', ['compile', 'server:start', 'server:livereload']);