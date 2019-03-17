const { src, dest, parallel, watch } = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const strip = require('gulp-strip-comments');
 
function typescripts() {
   var tsconfig = require("./tsconfig.json");
   return src(['src/*.ts', 'src/**/*.ts'])
        .pipe(sourcemaps.init()) 
        .pipe(ts(tsconfig.compilerOptions))
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../src' }))
        .pipe(dest('dist/'));
}

function javascripts() {
   return src(['src/**/*.js'])
        .pipe(strip())
        .pipe(dest('dist/'));
}

function run() {
   watch(['src/*.ts', 'src/**/*'], {ignoreInitial: false}, parallel([typescripts, javascripts]));
}

exports.scripts = parallel([typescripts, javascripts]);
exports.watch = run;