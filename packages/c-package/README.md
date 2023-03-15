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

## webpack系列基础
[entry&output](https://juejin.cn/post/6915635012536631309)  
[搭建React项目](https://juejin.cn/post/6915638604056231949)  
[devServer](https://juejin.cn/post/6915656442930266119)
[管理模块&css&html&图片&字体](https://juejin.cn/post/6915654869449703437)  
[chunk 和 bundle & output & clean-webpack-plugin](https://juejin.cn/post/6915659007894126599)  
[resolve](https://juejin.cn/post/6915658828268863502)  
[配置TS](https://juejin.cn/post/6915659426850570253)  
[使用 antd](https://juejin.cn/post/6915659846335332360)  
[webpack优化生成代码等](https://juejin.cn/post/6915664669185474574)  

## QA
Q: webpack-dev-server：Error: Cannot find module 'webpack-cli/bin/config-yargs'  
A: 可以尝试在package.json中的npm运行脚本中更改 webpack-dev-server 为webpack serve


Q: 解决jest-babel报错：Requires Babel "^7.0.0-0", but was loaded with "6.26.3".  
A: 和webpack一样，与版本有关系。

Q: [webpack-cli] [Error: EROFS: read-only file system, mkdir '/dist']  
A: https://stackoverflow.com/questions/60020217/npm-error-error-erofs-read-only-file-system-mkdir-npm

Q: 引入REACT & 其他文件 其他umd和cjs报错  
A: [使用户在导入时不用扩展名](https://webpack.js.org/configuration/resolve/#resolveextensions)
```
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json'],
  },
```
