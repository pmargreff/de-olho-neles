var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');


var jsFiles = 'js/*.js',  
    jsDest = 'js/min';

gulp.task('min', function() {  
    return gulp.src(jsFiles)
        .pipe(rename(function(path){
        	console.log(path);
    		path.basename += ".min";
    		path.extname = ".js"
        }))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});
