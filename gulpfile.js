var gulp = require('gulp');

var jslint = require('gulp-jslint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var jasmine = require('gulp-jasmine');

gulp.task('lint', function() {
  return gulp.src('js/*.js')
    .pipe(jslint({
      predef: ['JsConfig', 'jQuery', '$', 'google', '_', 'window'],
      indent: 2,
      nomen: true
    }));
});

gulp.task('sass', function() {
  return gulp.src(['node_modules/normalize.css/normalize.css', 'scss/*.scss'])
    .pipe(sass())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
  return gulp.src([
    'node_modules/lodash/index.js',
    'node_modules/moment/moment.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/js-config/src/JsConfig.js',
    'node_modules/builder-builder/src/builderBuilder.js',
    'js/*.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('js/*.js', ['lint', 'scripts']);
  gulp.watch('scss/*.scss', ['sass']);
  gulp.watch(['js/*.js', 'spec/*.js'], ['jasmine']);
});

gulp.task('jasmine', function () {
  return gulp.src('spec/*.js')
    .pipe(jasmine());
});

gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
gulp.task('build', ['sass', 'scripts']);
gulp.task('test', ['lint', 'jasmine']);
