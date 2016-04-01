var gulp          = require('gulp'),
    rename        = require('gulp-rename'),
    config        = require('./getConfig').getConfig(),
    exporter      = require('./createExportsObject');

var moveAdditionalFiles = function() {
  return gulp.src(config.additionalFiles + '/**/*')
    .pipe(gulp.dest(config.defaultDest));
};

module.exports = exporter(moveAdditionalFiles);
