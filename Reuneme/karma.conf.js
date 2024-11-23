module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-jasmine-html-reporter'), // Necesario para la interfaz gráfica
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    reporters: ['progress', 'kjhtml', 'coverage'], // Añadir 'kjhtml' para el visor en navegador
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' },
      ],
      fixWebpackSourcePaths: true,
    },
    browsers: ['Chrome'], // Cambia a 'Chrome' para abrir el navegador
    singleRun: false, // Mantén las pruebas corriendo para observar cambios
    restartOnFileChange: true, // Reinicia automáticamente al cambiar archivos
    client: {
      clearContext: false, // Mantén la interfaz de pruebas visible en el navegador
    },
  });
};
