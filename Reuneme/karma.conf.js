module.exports = function (config) {
    config.set({
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-coverage'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      reporters: ['progress', 'coverage'],
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage'),
        subdir: '.',
        reporters: [
          { type: 'html' },
          { type: 'text-summary' },
          { type: 'lcovonly' }
        ],
        fixWebpackSourcePaths: true
      },
      browsers: ['ChromeHeadless'],
      singleRun: true,
      restartOnFileChange: false
    });
  };
  