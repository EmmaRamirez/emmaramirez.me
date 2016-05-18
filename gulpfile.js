var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('stylus', function () {
  return gulp.src('./styles/styl/main.styl')
          .pipe(sourcemaps.init())
          .pipe(stylus())
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest('./styles/css/'));
});

//gulp.task('sroucemaps')

gulp.task('default', ['stylus'])
