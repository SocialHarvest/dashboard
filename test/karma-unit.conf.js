module.exports = function(config) {
  config.set({
    files : [
      'app/assets/app.js',
      'bower_components/angular-mocks/angular-mocks.js',
      
      'test/unit/**/*.js'
    ],
    basePath: '../',
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['Chrome'],
    autoWatch: false,
    singleRun: true,
    colors: true
  });
};
