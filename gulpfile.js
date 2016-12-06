var gulp = require("gulp");
var jspool = require("gulp-jspool");
var uglify=require("gulp-uglify");
var rename = require('gulp-rename');



gulp.task("wat",function(){
var watcher=gulp.watch(["./js/*","./js/dom/*","./js/render/*","./js/render/utils/*","./index.js","./js/render/classUpdate/*","./js/render/classUpdate/classupdateRun/*"],function(event){
    gulp.src("./config.json").pipe(jspool()).pipe(gulp.dest("dest")).pipe(uglify()) .pipe(rename(function(path){path.extname=".min.js";})) .pipe(gulp.dest("dest"));
  });
})


gulp.task("pack",function(){
    gulp.src("./config.json").pipe(jspool()).pipe(gulp.dest("dest")).pipe(uglify()) .pipe(rename(function(path){path.extname=".min.js";})) .pipe(gulp.dest("dest"));
})