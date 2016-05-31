var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    ts = require('gulp-typescript'),
    tsProject = ts.createProject('tsconfig.json'),
    stylus = require('gulp-stylus'),
    webserver = require('gulp-webserver'),
    uglify = require('gulp-uglify');


gulp.task('styles', function () {
  return gulp.src('src/styles/index.styl')
          .pipe(sourcemaps.init())
          .pipe(stylus())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest('dist/styles'))
});

gulp.task('html', function () {
  return gulp.src('src/index.html')
          .pipe(gulp.dest('./dist'))
});

gulp.task('webserver', function () {
  gulp.src('dist')
      .pipe(webserver({
        livereload: true,
        port: 8080,
        directoryListing: true,
        open: true
      }));
});

gulp.task('scripts', function () {
  return gulp.src('src/scripts/*.ts')
          .pipe(sourcemaps.init())
          .pipe(ts({
            noImplicitAny: true
          }))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest('dist/scripts'))
});

gulp.task('watch', function () {
  gulp.watch('src/scripts/*.ts', ['scripts']);
  gulp.watch('src/styles/*.styl', ['styles']);
  gulp.watch('src/index.html', ['html']);
});

gulp.task('default', ['styles', 'scripts', 'html', 'watch']);
