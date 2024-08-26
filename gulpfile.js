import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';
import browser from 'browser-sync';// Stylesexport const styles = () => {
return gulp.src('source/sass/style.scss', { sourcemaps: true })
  .pipe(plumber())
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([
    autoprefixer(),
    csso()
  ]))
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
  .pipe(browser.stream());
// HTMLconst html = () => {
return gulp.src('source/*.html')
  .pipe(gulp.dest('build'));
// Scriptsconst scripts = () => {
return gulp.src('source/js/script.js')
  .pipe(gulp.dest('build/js'))
  .pipe(browser.stream());
// Imagesconst optimizeImages = () => {
return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
const copyImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(gulp.dest('build/img'))
}// WebPconst createWebp = () => {
return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'))
// SVGconst svg = () =>
gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img')); const sprite = () => {
    return gulp.src('source/img/icons/*.svg')
      .pipe(svgo())
      .pipe(svgstore({
        inlineSvg: true
      }))
      .pipe(rename('sprite.svg'))
      .pipe(gulp.dest('build/img'));
  }
gulp.src([
  'source/fonts/*.{woff2,woff}',
  'source/*.ico',
], {
  base: 'source'
})
  .pipe(gulp.dest('build'))
done();
// Cleanconst clean = () => {
return del('build');
;// Serverconst server = (done) => {
browser.init({
  server: {
    baseDir: 'build'
  },
  cors: true,
  notify: false,
  ui: false,
});
done();
// Reloadconst reload = (done) => {
browser.reload();
done();
// Watcherconst watcher = () => {
gulp.watch('source/sass/**/*.scss', gulp.series(styles));
gulp.watch('source/js/script.js', gulp.series(scripts));
gulp.watch('source/*.html', gulp.series(html, reload));
// Buildexport const build = gulp.series(
clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  );
export default gulp.series(
    clean,
    copy,
    copyImages,
    gulp.parallel(
      html,
      styles,
      js,
      makeSprite,
      images2WebP,
      server,
      watcher
    )
  );
// Styles

const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemaps.write("."))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(browser.stream());
}

// HTML
const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
}

// JS
const js = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
}

//Images
const optimizeImages = () => {
  return gulp.src(['source/img/**/*.{jpg,png,svg}', '!source/img/sprite.svg'])
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('build/img'))
}

export const moveSprite = () => {
  return gulp.src(['source/img/sprite.svg'])
    .pipe(gulp.dest('build/img'))
}

const images2WebP = () => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicons/*.png'])
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('build/img'))
}

// SVG

const makeSprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgo())
    .pipe(svgstore())
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img/icons'))
}

// Copy
const copy = (done) => {
  return gulp.src(['source/fonts/**/*.{woff2,woff}', 'source/*.ico'], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
}

// Clean
export const clean = (done) => {
  return deleteAsync('build')
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// // Watcher

const reload = (done) => {
  browser.reload();
  done();
}

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(js))
  gulp.watch('source/*.html').on('change', gulp.series(html, reload));
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    js,
    makeSprite,
    moveSprite,
    images2WebP
  )
)


