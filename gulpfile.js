/* eslint-disable no-var,comma-dangle */
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

// config
var entry = 'javascript/src/webvrr.js';

gulp.task('default', ['build']);

// eslint-disable-next-line prefer-arrow-callback
gulp.task('build', function build() {
  return browserify(
    entry,
    {
      extensions: ['es6'],
    }
  ).transform('babelify')
    .bundle()
    .pipe(source('webvrr.js'))
    .pipe(gulp.dest('./inst/htmlwidgets'));
});
