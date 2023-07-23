const path = require('path')

module.exports = {
  // baseUrl: '/SecurityFrontend/dist',
  // baseUrl: '/SecurityBackend/dist',
  baseUrl: '/dist',
  // baseUrl: '/SecurityFrontend/dist',
  lintOnSave: false,
  devServer: {
    hot: true

  },
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, './src/assets'),
        '@commons': path.resolve(__dirname, './src/commons'),
        '@components': path.resolve(__dirname, './src/components'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@mixins': path.resolve(__dirname, './src/mixins'),
        '@routes': path.resolve(__dirname, './src/routes'),
        '@views': path.resolve(__dirname, './src/views')
      }
    }
  }
}
