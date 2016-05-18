var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    marked = require('marked'),
    pug = require('pug'),
    pugFilters = require('pug-filters'),
    gulpPug = require('gulp-pug'),
    jstransformer = require('jstransformer'),
    jstransformerMarked = require('jstransformer-marked'),
    typescript = require('gulp-typescript'),
    concat = require('gulp-concat'),
    tsProject = typescript.createProject('tsconfig.json'),
    sourcemaps = require('gulp-sourcemaps');

// pug.filters.markdown = function (str, option) {
//   return marked(str, options);
// };

//jstransformer(jstransformerMarked);

gulp.task('stylus', function () {
  return gulp.src('./styles/styl/main.styl')
          .pipe(sourcemaps.init())
          .pipe(stylus())
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest('./styles/css/'));
});

gulp.task('html', function () {
  return gulp.src('./articles/**/*.pug')
          .pipe(gulpPug({
            pug: pug
          }))
          .pipe(gulp.dest('./articles/'));
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

gulp.task('default', ['stylus', 'html', 'scripts']);
