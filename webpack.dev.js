const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: './dist',
    // 端口
    port: 8080,
    // 主机
    host: 'localhost',
    // 启用 gzip compression
    compress: true,
    // 自动打开
    open: true,
    // 启用 webpack 的 热模块替换 特性
    hot: true,
    //代理
    proxy: {
      // 替换地址
      '/apis': {
        target: 'http://101.200.76.112',
        // 隐藏主机
        changeOrigin: true,
        // 覆盖路径
        pathRewrite: { '^/apis': '' }
      }
    },
    // HTML5 historyAPI
    historyApiFallback: { from: /.*/, to: '/index.html' }
  }
})
