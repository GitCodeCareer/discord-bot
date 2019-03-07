const { src, dest, parallel, watch } = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
 
function scripts() {
   return src(['src/*.ts', 'src/**/*.ts'])
        .pipe(sourcemaps.init()) 
        .pipe(ts({
            declaration: true
        }))
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../src' }))
        .pipe(dest('dist/'));
}

function run() {
   watch(['src/*.ts', 'src/**/*.ts'], {ignoreInitial: false}, scripts);
}

exports.scripts = scripts;
exports.watch = run;