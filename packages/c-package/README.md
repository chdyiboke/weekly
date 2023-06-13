# 组件打包

## 目标

组件打包 esm/cjs/umd

## 启动

```
// 安装依赖
yarn
// dev 开发
yarn start
// 打包所有
yarn build
```

## UMD/commonjs/es

ES 风靡的今天，AMD CDM 早已退出历史舞台

什么是 UMD
所谓 UMD (Universal Module Definition)，就是一种 javascript 通用模块定义规范，让你的模块能在 javascript 所有运行环境中发挥作用。

umd 是包含 commonjs amd cmd

commonjs

var x = 5;
module.exports.x = x;

var example = require('./example.js');
console.log(example.x); // 5

```
所有代码都运行在模块作用域，不会污染全局作用域。
模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
模块加载的顺序，按照其在代码中出现的顺序。
```

## webpack 系列基础

[entry&output](https://juejin.cn/post/6915635012536631309)  
[搭建 React 项目](https://juejin.cn/post/6915638604056231949)  
[devServer](https://juejin.cn/post/6915656442930266119)
[管理模块&css&html&图片&字体](https://juejin.cn/post/6915654869449703437)  
[chunk 和 bundle & output & clean-webpack-plugin](https://juejin.cn/post/6915659007894126599)  
[resolve](https://juejin.cn/post/6915658828268863502)  
[配置 TS](https://juejin.cn/post/6915659426850570253)  
[使用 antd](https://juejin.cn/post/6915659846335332360)  
[webpack 优化生成代码等](https://juejin.cn/post/6915664669185474574)

## QA

Q: webpack-dev-server：Error: Cannot find module 'webpack-cli/bin/config-yargs'  
A: 可以尝试在 package.json 中的 npm 运行脚本中更改 webpack-dev-server 为 webpack serve

Q: 解决 jest-babel 报错：Requires Babel "^7.0.0-0", but was loaded with "6.26.3".  
A: 和 webpack 一样，与版本有关系。

Q: [webpack-cli] [Error: EROFS: read-only file system, mkdir '/dist']  
A: https://stackoverflow.com/questions/60020217/npm-error-error-erofs-read-only-file-system-mkdir-npm

Q: 引入 REACT & 其他文件 其他 umd 和 cjs 报错  
A: [使用户在导入时不用扩展名](https://webpack.js.org/configuration/resolve/#resolveextensions)

```
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json'],
  },
```
