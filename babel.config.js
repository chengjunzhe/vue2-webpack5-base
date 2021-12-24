module.exports = {
  presets: [
    //基本预设
    [
      '@babel/preset-env',
      {
        // 防止 tree-shaking失效 防止把es6模块转换为commonjs
        modules: false,
        // useBuiltIns: false 默认值，无视浏览器兼容配置，引入所有 polyfill
        // useBuiltIns: entry 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
        // useBuiltIns: usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
        useBuiltIns: 'entry',
        targets: {
          chrome: '58',
          ie: '11'
        }
      }
    ]
    // "@babel/preset-react"//react预设
  ],
  plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
}
