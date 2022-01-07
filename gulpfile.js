const gulp = require('gulp');

const concat = require('gulp-concat');
const jeditor = require('gulp-json-editor');
const bump = require('gulp-bump');
const run = require('gulp-run');

// dependencies for npm publishing
const npmDeps = {
    "react-native-reanimated": "~2.3.1"
};

// additional dependencies for expo app
const expoDeps = {
  "expo": "~44.0.0",
  "expo-status-bar": "~1.2.0",
  "react": "17.0.1",
  "react-dom": "17.0.1",
  "react-native": "0.64.3",
  "react-native-web": "0.17.1"  
};

// main for npm publishing
const npmMain = 'index.js';
// main for expo app
const expoMain = 'node_modules/expo/AppEntry.js';

/****package.json stuff****/
gulp.task('test', function() {
  console.log('Hello Master');
});

const updatePackageJSONforNPM = json => {};
// read the package.json and update it for npm publishing
gulp.task('forNPM', done => {
  gulp
    .src('./package.json')
    .pipe(bump())
    .pipe(
      jeditor(function(json) {
        json.dependencies = npmDeps;
        json.main = npmMain;
        return json;
      })
    )
    .pipe(bump({ key: 'version' }))
    .pipe(concat('package.json'))
    .pipe(gulp.dest('./'));
  done();
});

gulp.task('npm-publish', done => {
  return run('npm publish').exec(); // run "npm start".
  done();
});

gulp.task('git-add', done => {
  return run('git add .').exec();
  done();
});

gulp.task('git-commit', done => {
  return run('git commit -m "publishing"').exec();

  done();
});

gulp.task('git-push', done => {
  return run('git push origin main').exec();
  done();
});

gulp.task('forExpo', done => {
  gulp
    .src('./package.json')
    .pipe(
      jeditor({
        dependencies: expoDeps,
        main: expoMain
      })
    )
    .pipe(concat('package.json'))
    .pipe(gulp.dest('./'));
  done();
});


gulp.task(
  'prod',
  gulp.series(
    'forNPM',
    gulp.parallel(
      gulp.series('git-add', 'git-commit', 'git-push'),
      'npm-publish'
    ),
    'forExpo'
  )
);

gulp.task(
  'dev',
  gulp.series(
    'forNPM',
    gulp.parallel(
      gulp.series('git-add', 'git-commit', 'git-push'),
      'npm-publish'
    ),
    'forExpo'
  )
);
