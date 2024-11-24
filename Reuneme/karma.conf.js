module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/reuneme'),
      subdir: '.',
      reporters: [
        { type: 'html' }, // Informe en HTML
        { type: 'lcovonly' }, // Informe lcov.info para SonarQube
        { type: 'text-summary' }, // Resumen en consola
      ],
    },
    browsers: ['ChromeHeadless'], // Usa el navegador sin interfaz gráfica
    singleRun: true, // Cierra Karma automáticamente al finalizar
  });
};
