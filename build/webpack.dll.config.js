// webpack.dll.config.js
const path = require('path')
const webpack = require('webpack')

const resolve = (file) => path.resolve(__dirname, file)

module.exports = {
  // 模式
  mode: 'production',

  // source-map
  // devtool: 'source-map',

  // 你想要打包的模块的数组
  entry: {
    vendor: ['vue', 'axios']
  },
  // 出口
  output: {
    path: resolve('./dll/js'), // 打包后文件输出的位置
    filename: '[name].dll.js',
    library: '[name]_library'
    // 这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
  },
  // 插件
  plugins: [
    new webpack.DllPlugin({
      path: resolve('./dll/[name]-manifest.json'),
      name: '[name]_library',
      context: __dirname
    })
  ]
}
