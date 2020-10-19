const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const postcssModules = require('postcss-modules');
const postcssImport = require('postcss-import');
const tildeImporter = require('node-sass-tilde-importer');

const tsProject = ts.createProject({
    allowJs: true,
    esModuleInterop: true,
    jsx: 'react',
    resolveJsonModule: true
});

gulp.task('typescript:build', function() {
    return gulp.src('src/ts/**/*.@(ts|tsx)')
        .pipe(tsProject())
        .pipe(gulp.dest('dist/js')) 
});
gulp.task('typescript:clear', function () {
    return del('dist/js/**/*.js');
});
gulp.task('typescript', gulp.series(
    'typescript:clear',
    'typescript:build'
));

gulp.task('sass-modules:build', function() {
    return gulp.src('src/ts/components/**/*.scss')
        .pipe(sass({ importer: tildeImporter }))
        .pipe(postcss([
            postcssImport(),
            postcssModules({ localsConvention: 'camelCaseOnly' })
        ]))
        .pipe(gulp.dest('dist/js/components'));
});
gulp.task('sass-modules:move', function() {
    return gulp.src('src/ts/components/**/*.css.json')
        .pipe(gulp.dest('dist/js/components'));
});
gulp.task('sass-modules:clear', function() {
    return del([
        'dist/js/components/**/*.css*',
        'src/ts/components/**/*.css.json'
    ]);
});
gulp.task('sass-modules', gulp.series(
    'sass-modules:clear',
    'sass-modules:build',
    'sass-modules:move'
));

gulp.task('sass-common', function() {
    return gulp.src('src/scss/**')
        .pipe(sass({ importer: tildeImporter }))
        .pipe(postcss([ postcssImport() ]))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('sass-assemble', function() {
    return gulp.src(['dist/css/**', 'dist/js/components/**/*.css'])
        .pipe(concat('asset.css'))
        .pipe(gulp.dest('dist/assets'))
});

gulp.task('build', gulp.series(
    gulp.parallel('sass-modules', 'sass-common'),
    gulp.parallel('typescript', 'sass-assemble')
));

gulp.task('watch', function() {
    gulp.watch('src/ts/**/*.@(js|jsx|ts|tsx)', gulp.series('typescript'));
    gulp.watch('src/ts/components/**/*.scss', gulp.series('sass-modules', 'sass-assemble'));
    gulp.watch('src/scss/**', gulp.series('sass-common', 'sass-assemble'))
});

gulp.task('default', gulp.series('build', 'watch'));