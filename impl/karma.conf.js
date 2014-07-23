// Karma configuration
// Generated on Tue Jul 22 2014 20:28:37 GMT-0300 (BRT)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['qunit'],
    plugins: ['karma-qunit', 'karma-phantomjs-launcher'],
    files: [
      'test/*/*Test.js',
      'test/*Test.js'
    ],
    exclude: [
    ],
    preprocessors: {
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
