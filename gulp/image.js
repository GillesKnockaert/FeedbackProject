var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    config        = require('./getConfig').getConfig(),
    exporter      = require('./createExportsObject');

var optimize = function() {
  return gulp.src(config.assetsSrc + '/img/**')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(config.defaultDest + '/img'));
};

module.exports = exporter(optimize);
