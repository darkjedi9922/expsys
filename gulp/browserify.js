'use strict';

const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const globby = require('globby');
const through = require('through2');
const log = require('gulplog');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');

module.exports = function(globs, distFolder, outFileName) {
    // gulp expects tasks to return a stream, so we create one here.
    var bundledStream = through();

    bundledStream
        // turns the output bundle stream into a stream containing
        // the normal attributes gulp plugins expect.
        .pipe(source(outFileName))
        // the rest of the gulp task, as you would normally write it.
        // here we're copying from the Browserify + Uglify2 recipe.
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        // Add gulp plugins to the pipeline here.
        // Terser is a new gulp-uglify
        // .pipe(terser())
        .on('error', log.error)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${distFolder}/`));

    // "globby" replaces the normal "gulp.src" as Browserify
    // creates it's own readable stream.
    globby(globs).then(function (entries) {
        // create the Browserify instance.
        var b = browserify({
            entries: entries,
            debug: true,
            ignoreMissing: true,
            transform: []
        });

        // pipe the Browserify stream into the stream we created earlier
        // this starts our gulp pipeline.
        b.bundle().pipe(bundledStream);
    }).catch(function (err) {
        // ensure any errors from globby are handled
        bundledStream.emit('error', err);
    });

    // finally, we return the stream, so gulp knows when this task is done.
    return bundledStream;
};