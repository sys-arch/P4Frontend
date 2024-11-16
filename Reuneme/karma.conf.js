module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    reporters: ['progress', 'coverage'], // Agregar cobertura
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/reuneme'), // Directorio de salida
      subdir: '.', // Genera archivos directamente en ./coverage/reuneme
      reporters: [
        { type: 'html' },       // Informe HTML
        { type: 'text-summary' }, // Resumen de consola
        { type: 'lcovonly' }    // Clave: Generar archivo lcov.info
      ],
      fixWebpackSourcePaths: true
    },
    browsers: ['ChromeHeadless'], // Ejecuta en segundo plano
    singleRun: true, // Karma se detendrá después de ejecutar las pruebas
    restartOnFileChange: false
  });
};
