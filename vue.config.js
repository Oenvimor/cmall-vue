module.exports = {
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  publicPath: './',
  devServer: {
    open: true,
    proxy: {
      '^/api': {
        target: 'http://localhost:3000/',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
