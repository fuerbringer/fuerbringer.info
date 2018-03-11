'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('./public/styles/**/*.scss')
    .pipe(sass.sync({ outputStyle: 'compressed' })
      .on('error', sass.logError))
    .pipe(gulp.dest('./public/styles/min'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./public/styles/**/*.sass', ['sass']);
});
