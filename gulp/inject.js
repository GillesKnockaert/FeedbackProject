var gulp          = require('gulp'),
    debug         = require('gulp-debug'),
    inject        = require('gulp-inject'),
    gulpif        = require('gulp-if'),
    util          = require('gulp-util'),
    eventStream   = require('event-stream'),
    config        = require('./getConfig').getConfig();

module.exports = {
  injectStylesAndScripts: function() {
    return function() {
      var stylesStream = require('./styles').getStream();

      var scriptStream = require('./scripts').getStream();

      var libsStream = require('./libs').getStream();

      var angularStream;
      if (config.angular.isAngularProject) {
        angularStream = eventStream.merge(
          require('./angularScripts').getStream(),
          require('./templateCache').getStream()
        );
      }

      return gulp.src(config.assetsSrc + '/**/*.html')
        .pipe(inject(libsStream, { name: 'libs' }))
        .pipe(gulpif(config.angular.isAngularProject, inject(angularStream, { name: 'angular' })))
        .pipe(inject(scriptStream))
        .pipe(gulp.dest(config.defaultDest));
    };
  }
};
