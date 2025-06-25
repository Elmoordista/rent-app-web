const path = require('path');
module.exports = {
  transpileDependencies: [
    'vuetify',
    'apexcharts'
  ],
  configureWebpack: {
    resolve: {
      alias: {
         '@': path.resolve(__dirname, 'src'), // points @ to entire src folder
      }
    }
  }
}
