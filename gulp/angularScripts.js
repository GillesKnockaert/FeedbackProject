var gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    gulpPrint   = require('gulp-print'),
    jscs        = require('gulp-jscs'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    ngAnnotate  = require('gulp-ng-annotate'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    util        = require('gulp-util'),
    eventStream = require('event-stream'),
    getFolders  = require('./getFolders').getFolders,
    path        = require('path'),
    config        = require('./getConfig').getConfig(),
    exporter      = require('./createExportsObject');

var compileAngularScripts = function() {
  // JS compile function
  // This is the main javascript compilation function.
  // src: the path to the javascript file(s). Optionally a glob pattern
  // filename: the name of the concatenated, optionally minified output file
  // dest: the destination path of the output file
  // Additional options, such as wether to lint, check code style or minify,
  // are supplied with the gulp.config.json file.
  function compileJs(src, filename, dest) {
    return gulp.src(src)
      .pipe(gulpif(config.verbose, gulpPrint(function(filepath) {
        return 'running js-task on: ' + filepath;
      })))
      .pipe(gulpif(config.jscs, jscs()))
      .pipe(gulpif(config.jscs, jscs.reporter()))
      .pipe(gulpif(config.jshint, jshint()))
      .pipe(gulpif(
        config.jshint,
        jshint.reporter('jshint-stylish', { verbose: true }))
      )
      .pipe(gulpif(config.jshint, jshint.reporter('fail')))
      .pipe(concat(filename))
      .pipe(gulpif(config.sourceMaps, sourcemaps.init({ loadMaps: true })))
        .pipe(ngAnnotate())
        .pipe(gulpif(config.minify, uglify()))
        .on('error', util.log)
      .pipe(gulpif(config.sourceMaps, sourcemaps.write('./')))
      .pipe(gulp.dest(dest + '/scripts'));
  }

  // The streams variable will contain all the seperate gulp javascript
  // streams this task will produce. (i.e. seperate streams for each angular
  // module plus a stream for additional js code)
  var streams = [];
  var folders = getFolders(config.angular.angularSrc + '/modules');

  // Config.angular.singleModule determines wether all angular modules should be compiled
  // to a single file (and then minified) or wether we want seperate files for
  // each module. In the latter case, the file name is based on the name of the
  // module folder. See README.md for more details.
  if (config.angular.singleModule) {
    util.log(util.colors.blue('Compiling all angular modules in a single file'));

    var srcArray = [
      config.angular.angularSrc + '/' + config.angular.appName + '.js',
      config.angular.angularSrc + '/common/**/*.js'
    ];

    for (var i = 0; i < folders.length; i++) {
      srcArray.push(path.join(config.angular.angularSrc, folders[i], '*.js'));
    }

    streams.push(compileJs(srcArray, config.angular.appName + '.js', config.defaultDest));
  }
  else {
    // Make a seperate stream for each angular module.
    // Uglify and concat the main angular app
    var mainAngularAppStream = compileJs([
        config.angular.angularSrc + '/' + config.angular.appName + '.js',
        config.angular.angularSrc + '/common/**/*.js'],
        config.angular.appName + '.js',
        config.defaultDest
      );

    streams.push(mainAngularAppStream);

    // Make a gulp stream for each module in the src folder
    folders.map(function(folder) {
      util.log(util.colors.blue('Compiling angular module ' + folder));

      // For each folder in the modules, concat and uglify all the js files and
      // save in a seperate js file.
      streams.push(compileJs(
        path.join(config.angular.angularSrc, 'modules', folder, '**', '*.js'),
        folder + '.js',
        config.defaultDest,
        true
      ));
    });
  }

  return eventStream.merge(streams);
};

module.exports = exporter(compileAngularScripts);
