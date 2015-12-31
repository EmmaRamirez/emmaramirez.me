var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('styles', function() {
  gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
    .pipe(gulp.dest('./css'));
});

gulp.task('babel', () => {
  return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', function(){
  gulp.watch('sass/**/.scss', ['styles']);
  gulp.watch('src/**/*.js', ['babel']);
});

browserSync.init({
    server: "./"
});
browserSync.stream();
