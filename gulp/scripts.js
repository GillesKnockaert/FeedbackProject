var gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    gulpPrint   = require('gulp-print'),
    jscs        = require('gulp-jscs'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    util        = require('gulp-util'),
    changed     = require('gulp-changed'),
    bump        = require('gulp-bump'),
    rev         = require('gulp-rev'),
    config      = require('./getConfig').getConfig(),
    exporter    = require('./createExportsObject');

var compileJs = function() {
  // JS compile function
  // Additional options, such as wether to lint, check code style or minify,
  // are supplied with the gulp.config.json file.
  return gulp.src(config.assetsSrc + '/js/**/*.js')
    .pipe(gulpif(config.verbose, gulpPrint(function(filepath) {
      return 'running js-task on: ' + filepath;
    })))
    .pipe(gulpif(config.jscs, jscs()))
    .pipe(gulpif(config.jscs, jscs.reporter()))
    .pipe(gulpif(config.jshint, jshint()))
    .pipe(gulpif(config.jshint, jshint.reporter('jshint-stylish', { verbose: true })))
    .pipe(concat('scripts.js'))
    .pipe(gulpif(config.sourceMaps, sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(config.minify, uglify()))
      .on('error', util.log)
    .pipe(gulpif(config.sourceMaps, sourcemaps.write('./')))
    //.pipe(rev())
    .pipe(gulp.dest(config.defaultDest + '/scripts'));
};

module.exports = exporter(compileJs);
