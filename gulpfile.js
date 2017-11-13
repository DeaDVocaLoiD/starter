'use strict';
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    concat = require('gulp-concat'),
    wiredep = require('wiredep')({
        directory: './assets/components'
    });

var PATH = wiredep;

const compatability = [
    'last 2 versions',
    'IOS 7'
];
//Complite sass to css
gulp.task('sass', function () {
    return gulp.src('./assets/src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
                outputStyle: 'compressed',
                includePatch: PATH.scss
            }
        ).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: compatability,
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./assets/dist/css'));


});

gulp.task('browser-sync', function () { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});


gulp.task('javascript', function (cb) {
    pump([
            gulp.src(['assets/src/javascript/plugins/*.js', 'assets/src/javascript/scripts.js'])
                .pipe(concat('global.js')),
            uglify(),
            gulp.dest('./assets/src/javascript')
        ],
        cb
    );
});

gulp.task('default', ['sass', 'javascript', 'browser-sync'], function () {
    gulp.watch('./assets/src/scss/**/*.scss', ['sass']);
    gulp.watch('./assets/src/javascript/script.js', ['javascript']);
});
//-----------------------srart-------------------------//
gulp.task('ja-build', function (cb) {
    return gulp.src(["assets/src/javascript/*{js,json}", "assets/src/javascript//**/*{js,json}"])
        .pipe(sourcemaps.init())
        .pipe(concat({
            "target": "concatenated.js", // Name to concatenate to
            "entry": "./main.js" // Entrypoint for the application, main module
                                 // The `./` part is important! The path is relative to
                                 // whatever gulp decides is the base-path, in this
                                 // example that is `./lib`
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"));
});

//------------------------end-------------------------//