var gulp 	= require("gulp");
var ts 		= require("gulp-typescript");
var tslint 	= require("gulp-tslint");
var watch 	= require("gulp-watch");
var server 	= require('gulp-develop-server');
var cache   = require('gulp-cached');
var clean 	= require('gulp-clean');

var tsProject = ts.createProject("tsconfig.json");
var rollup = require ('rollup');
var rollupTypescript2 = require('rollup-plugin-typescript2');
var resolve = require ('rollup-plugin-node-resolve');
var commonjs = require ('rollup-plugin-commonjs');
var includePaths = require('rollup-plugin-includepaths');
var json = require('rollup-plugin-json');
var sourceFilePath = "src/**/*";
var distFolder = "dist";

var includePathOptions = {
    include: {},
    paths: ['dist/**'],
    external: [],
    extensions: ['.js', '.json',]
};

gulp.task("compile", ['tslint'], function () {
	// Copy js files to dist
	gulp.src(sourceFilePath + ".{js,json}")
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

gulp.task('bundle', ['compile'], function () {
	return rollup.rollup({
	  entry: 'bin/entry.js',
	  format: 'cjs',
	  dest: "deploy/serverbundle.js",
	  plugins: [
	  includePaths(includePathOptions), 
		  commonjs({
		      // non-CommonJS modules will be ignored, but you can also
		      // specifically include/exclude files
		      include: [ "dist/**"],  // Default: undefined

		      // search for files other than .js files (must already
		      // be transpiled by a previous plugin!)
		      extensions: [ '.js' ],  // Default: [ '.js' ]

		      // if true then uses of `global` won't be dealt with by this plugin
		      ignoreGlobal: false,  // Default: false

		      // if false then skip sourceMap generation for CommonJS modules
		      sourceMap: false,  // Default: true

		      // explicitly specify unresolvable named exports
		      // (see below for more details)
		      //namedExports: { './module.js': ['foo', 'bar' ] },  // Default: undefined

		      // sometimes you have to leave require statements
		      // unconverted. Pass an array containing the IDs
		      // or a `id => boolean` function. Only use this
		      // option if you know what you're doing!
		     // ignore: [ 'conditional-runtime-dependency' ]
		    }),
		    json()
	    ]
	
	}).then(function (bundle) {
		bundle.write({
			format: "cjs",
			moduleName: "serverbundle",
			dest: "./deploy/serverbundle.js"
		});
	})
});