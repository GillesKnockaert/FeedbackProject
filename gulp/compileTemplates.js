var gulp      = require('gulp'),
    config    = require('./getConfig').getConfig(),
    exporter  = require('./createExportsObject');

var compileTemplates = function() {
  return gulp.src(config.angular.angularSrc + '/templates/**/*.html')
    .pipe(gulp.dest('tmp'));
};

module.exports = exporter(compileTemplates);
