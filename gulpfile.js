const {src, dest, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const miniCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

function html() {
  return src('./src/*.html').pipe(dest('./dest'))
    .pipe(browserSync.stream());
}

function css() {
  return src('./src/css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(miniCSS())
    .pipe(dest('./dest/css/'))
    .pipe(browserSync.stream());
}

function js() {
  return src('./src/js/*.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(dest('./dest/js/'))
  .pipe(browserSync.stream());
}

function image() {
  return src('./src/images/*.jpg')
    .pipe(imagemin([imagemin.jpegtran({progressive: true})]))
    .pipe(dest('./dest/images'))
    .pipe(browserSync.stream());
}

function sync() {
  browserSync.init({
    server: {
      baseDir: "./dest"
    }
  });
  watch('./src/*.html').on('change', series(html, browserSync.reload));
  watch('./src/css/**/*.scss').on('change', series(css, browserSync.reload));
  watch('./src/js/*.js').on('change', series(js, browserSync.reload));
  watch('./src/images/*.jpg').on('change', series(image, browserSync.reload));
}

exports.all = series(html, css, js, image, sync);