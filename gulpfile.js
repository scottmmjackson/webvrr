var browserify = require('browserify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream');

// config
var entry = 'javascript/src/webvrr.js';

gulp.task('default', ['build']);

gulp.task('build', function() {
  return browserify(
    entry,
    {
      extensions: ['es6']
    }
  ).transform(
    'babelify',
    { presets: ['es2015', 'es2016', 'es2017', 'stage-2', 'stage-1']}
  ).bundle()
  .pipe(source('webvrr.js'))
  .pipe(gulp.dest('./inst/htmlwidgets'));
})
