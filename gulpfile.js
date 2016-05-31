var gulp = require('gulp'),
    clean = require('gulp-clean'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    markdown = require('gulp-markdown'),
    pug = require('gulp-pug'),
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

gulp.task('img', function () {
  return gulp.src('src/img/*.jpg')
          .pipe(gulp.dest('./dist/img'))
})

gulp.task('markdown', function () {
  return gulp.src('src/posts/**/*.pug')
          .pipe(pug({
            pretty: true
          }))
          .pipe(gulp.dest('dist/posts'));
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
          .pipe(concat('bundle.js'))
          .pipe(gulp.dest('dist/scripts'))
});

gulp.task('watch', function () {
  gulp.watch('src/scripts/*.ts', ['scripts']);
  gulp.watch('src/styles/*.styl', ['styles']);
  gulp.watch('src/index.html', ['html']);
  gulp.watch('src/posts/**/*.pug', ['markdown']);
});

gulp.task('default', ['styles', 'scripts', 'html', 'img', 'markdown', 'watch']);
