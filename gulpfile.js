var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    typescript = require('gulp-typescript'),
    concat = require('gulp-concat'),
    tsProject = typescript.createProject('tsconfig.json'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('stylus', function () {
  return gulp.src('./styles/styl/main.styl')
          .pipe(sourcemaps.init())
          .pipe(stylus())
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest('./styles/css/'));
});

gulp.task('scripts', function () {
  var typescriptResult = tsProject.src()
      .pipe(typescript(tsProject))
      .pipe(sourcemaps.init())
      .pipe(typescript({
        sortOutput: true
      }));
  return typescriptResult.js.pipe(concat('bundle.js'))
                            .pipe(sourcemaps.write())
                            .pipe(gulp.dest('dist/js'));
})

//gulp.task('sroucemaps')

gulp.task('default', ['stylus', 'scripts']);
