const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

// 混淆插件
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  // 消耗很大
  devtool: 'source-map',
  // 去除扩展包
  externals: {
    vue: 'Vue',
    axios: 'axios'
  },
  // 优化
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // 压缩注释
        extractComments: false,
        // 启用/禁用多进程并发运行功能
        parallel: true,
        terserOptions: {
          format: {
            // 去除注释
            comments: false
          },
          compress: {
            // 在删除没用到代码时 不输出警告
            warnings: false,
            // 删除console
            drop_console: true,
            // 把定义一次的变量，直接使用，取消定义变量
            collapse_vars: true,
            // 合并多次用到的值，定义成变量
            reduce_vars: true
          }
        }
      })
    ],
    // 分离代码块
    splitChunks: {
      // 分组
      cacheGroups: {
        // 第三方包
        libs: {
          // chunk名
          name: 'chunk-libs',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          priority: 20
        },
        // 共享块
        commons: {
          name: 'chunk-common',
          chunks: 'all',
          minChunks: 2,
          // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          reuseExistingChunk: true,
          // 优先级
          priority: 10
        }
      }
    }
  }
})
