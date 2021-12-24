const path = require('path')
// const webpack = require('webpack')

//HTML模板插件
const HtmlWebpackPlugin = require('html-webpack-plugin')

// // 复制文件插件
// const CopyPlugin = require('copy-webpack-plugin')

// css独立打包插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

//vue插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// 解析路径
const resolve = (file) => path.resolve(__dirname, file)

// 是否是生成环境打包
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
      // 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js',
      // 'https://cdn.jsdelivr.net/npm/axios@0.24.0/dist/axios.min.js'
    ]
  }
}

//配置vue插件
const vuePlugin = new VueLoaderPlugin()

//配置css独立打包插件
const miniCssExtract = new MiniCssExtractPlugin({
  filename: 'css/[name].[contenthash:8].css',
  chunkFilename: 'css/[id].[contenthash:8].css'
})

// 配置html插件
const htmlWebpackOne = new HtmlWebpackPlugin({
  //设置生成预览页面的模板文件
  template: './index.html',
  //设置生成的预览页面名称
  filename: 'index.html',
  // 传入title
  title: 'app',
  // 需要引入的chunk
  chunks: ['app'],
  // 配置cdn
  cdn: IS_PROD ? cdn.build : cdn.dev,
  // 配置dll
  dll: true,
  // 配置hash
  hash: true,
  // 压缩配置
  minify: {
    // 去除引号
    removeAttributeQuotes: true
  }
})

module.exports = {
  // 设置入口
  entry: {
    app: resolve('../src/index.js')
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
    clean: true
    // // 资源导出名
    // assetModuleFilename: 'assets/[hash].[ext]'
  },
  resolve: {
    // 解析别名
    alias: {
      '@': resolve('../src/')
    },
    // 告诉 webpack 优先 src 目录下查找需要解析的文件，会大大节省查找时间
    modules: [resolve('src'), 'node_modules'],
    // 解析后缀
    extensions: ['.js', '.vue', '.json'],
    // 为了scope hosting配置的 针对 npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
  // 解析loader的顺序
  resolveLoader: {
    modules: ['node_modules', resolve('../src/loader')]
  },
  // 模块设置
  module: {
    // 模块解析loader
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'cache-loader', 'css-loader', 'postcss-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'cache-loader', 'css-loader', 'postcss-loader', 'less-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [MiniCssExtractPlugin.loader, 'cache-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(jpe?g|png|gif|bmp|svg)$/,
        //自动地在 resource 和 inline 之间进行选择：小于 8kb 的文件，将会视为 inline 模块类型，否则会被视为 resource 模块类型
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: 'assets/images/[name][hash:8][ext]'
        },
        // 设置大小限制内视为inline
        parser: {
          dataUrlCondition: {
            maxSize: 5 * 1024 // 4kb
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        //自动地在 resource 和 inline 之间进行选择：小于 8kb 的文件，将会视为 inline 模块类型，否则会被视为 resource 模块类型
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          filename: 'assets/fonts/[name][hash:8][ext]'
        },
        // 设置大小限制内视为inline
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 4kb
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          // 开启多进程打包
          // {
          //   loader: 'thread-loader',
          //   options: {
          //     worker: 3
          //   }
          // },
          //开启了缓存
          'babel-loader?cacheDirectory=true'
        ]
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
    htmlWebpackOne

    // dll--------------------------------------------------------
    // // 配置dll插件
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('./dll/vendor-manifest.json')
    // }),
    // //配置拷贝插件 拷贝生成的文件到dist目录 这样每次不必手动去cv
    // new CopyPlugin({
    //   patterns: [{ from: resolve('dll/js'), to: 'js' }]
    // })
  ]
}
