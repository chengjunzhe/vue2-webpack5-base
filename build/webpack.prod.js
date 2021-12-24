const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

// 混淆插件
const TerserPlugin = require('terser-webpack-plugin')
// 打包分析插件
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// 压缩css插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(common, {
  // 模式
  mode: 'production',

  // 消耗很大
  // devtool: 'source-map',

  // 使用cdn时去除扩展包
  // externals: {
  //   vue: 'Vue',
  //   axios: 'axios'
  // },

  // 优化
  optimization: {
    // 开启压缩
    minimize: true,
    // 配置对应压缩器
    minimizer: [
      // 添加 css 压缩配置
      new OptimizeCssAssetsPlugin({}),
      // 添加 js 压缩配置
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
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: 20,
          enforce: true
        },
        // 共享块
        commons: {
          name: 'chunk-common',
          chunks: 'all',
          minChunks: 2, // 拆分前必须共享模块的最小 chunks 数。
          minSize: 0, // 生成 chunk 的最小体积（≈ 20kb)
          enforce: true,
          maxInitialRequests: 5, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
          // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          reuseExistingChunk: true,
          // 优先级
          priority: 10
        }
      }
    }
  },
  // 插件
  plugins: [
    // 打包分析
    new BundleAnalyzerPlugin({
      analyzerHost: 'localhost',
      analyzerPort: 5000
    })
  ]
})
