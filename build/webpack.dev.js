const { merge } = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common.js')

// 解析路径
const resolve = (file) => path.resolve(__dirname, file)

module.exports = merge(common, {
  // 模式
  mode: 'development',
  // source-map
  devtool: 'eval-cheap-module-source-map',
  // 开发服务
  devServer: {
    static: resolve('./dist'),
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
