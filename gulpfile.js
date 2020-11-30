const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemap = require("gulp-sourcemaps");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");

const html = () => {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build/"))
    .pipe(sync.stream());
};

const js = () => {
  return gulp.src("source/js/*.js")
    .pipe(gulp.dest("build/js/"))
    .pipe(sync.stream());
};

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};


const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
};


const copy = () => {
  return gulp.src([
    "source/fonts/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
};


const clean = () => {
  return del("build");
};

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};


const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("html"));
  gulp.watch("source/js/*.js", gulp.series("js"));
};

const build = gulp.series(clean, copy, styles, html, js);

exports.html = html;
exports.js = js;
exports.styles = styles;
exports.server = server;
exports.images = images;
exports.copy = copy;
exports.clean = clean;
exports.watcher = watcher;
exports.build = build;

exports.default = gulp.series(
  styles, html, server, watcher
);