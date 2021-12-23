const path = require('path')
//HTML模板插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// css独立打包插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//vue插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')

//配置vue插件
const vuePlugin = new VueLoaderPlugin()

const resolve = (file) => path.resolve(__dirname, file)

//配置css独立打包插件
const miniCssExtract = new MiniCssExtractPlugin({
  filename: 'css/[name].[contenthash:8].css',
  chunkFilename: 'css/[id].[contenthash:8].css'
})

const IS_PROD = ['production'].includes(process.env.NODE_ENV)

// CDN外链，会插入到index.html中
const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: []
  },
  // 生产环境
  build: {
    css: [],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.24.0/dist/axios.min.js'
    ]
  }
}

module.exports = {
  entry: {
    app: './src/index.js'
  },
  //设置出口文件
  output: {
    //设置路径
    path: resolve('./dist/'),
    // 设置公共路径
    publicPath: '/',
    //设置文件名
    filename: 'js/[name].[chunkhash:8].js',
    // 输出前删除dist
    clean: true,
    // 资源导出名
    assetModuleFilename: 'assets/[hash].[ext]'
  },
  resolve: {
    // 解析别名
    alias: {
      '@': resolve('./src/')
    },
    // 解析后缀
    extensions: ['.js', '.vue', '.json']
  },
  // 模块设置
  module: {
    // 模块解析loader
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.jpg|png|gif|bmp|ttf|eot|svg|woff|woff2$/,
        //自动地在 resource 和 inline 之间进行选择：小于 8kb 的文件，将会视为 inline 模块类型，否则会被视为 resource 模块类型
        type: 'asset',
        // 设置大小限制内视为inline
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/
      }
    ]
  },
  // 插件
  plugins: [
    vuePlugin,
    miniCssExtract,
    new HtmlWebpackPlugin({
      //设置生成预览页面的模板文件
      template: './index.html',
      //设置生成的预览页面名称
      filename: 'index.html',
      // 传入title
      title: 'app',
      // 需要引入的chunk
      chunks: ['app'],
      cdn: IS_PROD ? cdn.build : cdn.dev,
      hash: true,
      // 压缩配置
      minify: {
        // 去除引号
        removeAttributeQuotes: true
      }
    })
  ]
}
