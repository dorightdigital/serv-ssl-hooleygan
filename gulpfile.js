var gulp = require('gulp');

var jslint = require('gulp-jslint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('lint', function() {
  return gulp.src('js/*.js')
    .pipe(jslint());
});

gulp.task('sass', function() {
  return gulp.src(['node_modules/normalize.css/normalize.css', 'scss/*.scss'])
    .pipe(sass())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
  return gulp.src('js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('js/*.js', ['lint', 'scripts']);
  gulp.watch('scss/*.scss', ['sass']);
});

gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
