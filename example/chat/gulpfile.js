var gulp = require("gulp");
var jspool = require("gulp-jspool");
var uglify=require("gulp-uglify");
var rename = require('gulp-rename');


gulp.task("wat",function(){
var watcher=gulp.watch(["./src/*","index.js"],function(event){
    gulp.src("./config.json").pipe(jspool()).pipe(gulp.dest("project/js"));
  });
})
