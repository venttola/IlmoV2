var gulp 	= require("gulp");
var ts 		= require("gulp-typescript");
var tslint 	= require("gulp-tslint");
var watch 	= require("gulp-watch");
var server 	= require('gulp-develop-server');
var cache   = require('gulp-cached');

var tsProject = ts.createProject("tsconfig.json");

var sourceFilePath = "src/**/*.ts";

gulp.task("compile", ['tslint'], function () {
    return tsProject.src()
    	.pipe(cache('compiling'))
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"))
        
});

gulp.task("tslint", function(){
	tsProject.src()
		.pipe(cache('linting'))
		.pipe(tslint({
			configuration: "tslint.json"
		}))
		.pipe(tslint.report())
});

gulp.task("watch", function(){
	gulp.watch(sourceFilePath, ['tslint', 'compile']);
});

gulp.task('server:start', function() {
    server.listen( { path: './bin/start.js' } );
});

gulp.task('server:livereload', function() {
    gulp.watch(sourceFilePath, ['tslint', 'compile', server.restart]);
});

gulp.task('start', ['server:start', 'server:livereload']);