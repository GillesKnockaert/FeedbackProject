var gulp        = require('gulp'),
    cache       = require('gulp-cache'),
    path        = require('path'),
    painter     = require('./gulp/painter'),
    config      = require('./gulp/getConfig').getConfig(),
    getFolders  = require('./gulp/getFolders').getFolders,
    del         = require('del'),
    taskListing = require('gulp-task-listing');

// Move html to the tmp folder. If it's an angular project, all angular html templates
// will be compiled to a templatecache linked to that module, depending on folder name.
gulp.task('compile-templates', require('./gulp/compileTemplates').getTask());

// Compile sass to css
gulp.task('compile-sass', require('./gulp/styles').getTask());

// Optimize images
gulp.task('optimize-images', require('./gulp/image').getTask());

// Concat and uglify the angular app, modules, scripts and libs
gulp.task('compile-scripts', require('./gulp/scripts').getTask());

if (config.angular.isAngularProject) {
  gulp.task('compile-angular-scripts', require('./gulp/angularScripts').getTask());
  gulp.task('compile-template-cache', ['compile-templates'],  require('./gulp/templateCache').getTask());
}

gulp.task('bundle-libs', require('./gulp/libs').getTask());

gulp.task('move-additional-files', require('./gulp/moveAdditional').getTask());

// Gulp task for unit testing and E2E testing
//gulp.task('test', getTask('test'));

// Html injection task. Injects the css and script tags in the index.html
gulp.task('build-inject', ['compile-templates'], require('./gulp/inject').injectStylesAndScripts());

gulp.task('move-html', function() {
  return gulp.src(config.assetsSrc + '/index.html')
    .pipe(gulp.dest(config.defaultDest));
});

// Clean the public folder of everything except images.
gulp.task('clean', function() {
  del.sync(
    ['public/scripts', 'public/styles', 'public/templates', 'public/*.html']
  );
});

var buildTasks = [
  'optimize-images',
  'move-additional-files'
];

if (config.useHtmlInjection) {
  buildTasks.push('build-inject');
}
else {
  buildTasks.push('bundle-libs');
  buildTasks.push('compile-sass');
  buildTasks.push('compile-scripts');
  buildTasks.push('move-html');
  if (config.angular.isAngularProject) {
    buildTasks.push('compile-angular-scripts');
    buildTasks.push('compile-template-cache');
  }
}

// jscs:disable
gulp.task('build', buildTasks, function () {
  del('tmp');
  painter.paintBazookas();
});

gulp.task('serve', ['build'], require('./gulp/serve-frontend').getTask());

gulp.task('help', taskListing);

gulp.task('default', ['help']);
