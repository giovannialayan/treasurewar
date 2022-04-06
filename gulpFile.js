const gulp = require('gulp');
const webpack = require('webpack-stream');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint-new');
const webpackConfig = require('./webpack.config');

const jsTask = (done) => {
    webpack(webpackConfig)
        .pipe(gulp.dest('./hosted'));

    done();
};

const lintTask = (done) => {
    gulp.src('./server/**/*')
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());

    done();
};

const build = gulp.parallel(jsTask, lintTask);

const watch = (done) => {
    gulp.watch('./client', jsTask); //you can also do gulp.watch(['./client/*.js', './client/*.jsx'], jsTask); if you only want certain file types to be watched

    nodemon({
        script: './server/app.js',
        tasks: ['lintTask'], //note lintTask must be exported for this to work
        watch: ['./server'],
        done: done,
    });
};

module.exports = {
    jsTask,
    lintTask,
    build,
    watch,
};