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
  return gulp.src('styles/index.styl')
          .pipe(sourcemaps.init())
          .pipe(stylus())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest('dist/styles'))
});


gulp.task('index', function () {
  return gulp.src('index.pug')
              .pipe(pug({
                pretty: true
              }))
              .pipe(gulp.dest('.'));
});

gulp.task('about', function () {
  return gulp.src('about/index.pug')
              .pipe(pug({
                pretty: true
              }))
              .pipe(gulp.dest('./about'));
});

gulp.task('img', function () {
  return gulp.src(['img/*.jpg', 'img/*.png', 'img/*.JPG'])
          .pipe(gulp.dest('./dist/img'));
});

gulp.task('markdown', function () {
  return gulp.src('posts/**/*.pug')
          .pipe(pug({
            pretty: true
          }))
          .pipe(gulp.dest('posts'));
});

gulp.task('webserver', function () {
  gulp.src('index.html')
      .pipe(webserver({
        livereload: true,
        port: 8080,
        directoryListing: true,
        open: true
      }));
});

gulp.task('scripts', function () {
  return gulp.src('scripts/*.ts')
          .pipe(sourcemaps.init())
          .pipe(ts({
            noImplicitAny: true
          }))
          .pipe(sourcemaps.write())
          .pipe(concat('bundle.js'))
          .pipe(gulp.dest('dist/scripts'))
});

gulp.task('watch', function () {
  gulp.watch('scripts/*.ts', ['scripts']);
  gulp.watch('styles/*.styl', ['styles']);
  gulp.watch('index.pug', ['index']);
  gulp.watch('about/index.pug', ['about']);
  gulp.watch('posts/**/*.pug', ['markdown', 'img']);
});

gulp.task('default', ['styles', 'scripts', 'img', 'markdown', 'about', 'index', 'watch']);
