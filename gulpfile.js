var gulp = require('gulp');
var inject = require('gulp-inject');
var config = require('./gulp.config')();
var es = require('event-stream');
var csslint = require('gulp-csslint');
var jshint = require('gulp-jshint');
var path = require('path');
var less = require('gulp-less');
var concat = require('gulp-concat');
var bower = require('bower-files')();
var $ = require('gulp-load-plugins')({
    lazy: true
});
//gulp task to wiredep css,js and bower dependencies inside index.htnl file
gulp.task('wiredep', function() {

    var cssFiles = gulp.src(config.css, {
        read: false
    });
    var jsFiles = gulp.src(config.js, {
        read: false
    });
    var target = gulp.src(config.index);
    return target
        .pipe(inject(es.merge(
            cssFiles,
            jsFiles), {
            addPrefix: ''
        }))
        .pipe(gulp.dest(config.root));

});


//gulp task for css error check
gulp.task('cssLint', function() {
    gulp.src(config.css)
        .pipe(csslint())
        .pipe(csslint.reporter());
});
//gulp task for js error check
gulp.task('jsHint', function() {
    return gulp.src(config.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {verbose: true}));
});

//gulp task to convert sass files to css

gulp.task('less', function () {
  return gulp.src(config.less)
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./src/styles/css'));
});3

gulp.task('minifyVendorScripts', function() {
    return gulp.src(bower.ext('js').match(config.excludeBower).files)
        .pipe(concat('vendor.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('./dist/'));

});
