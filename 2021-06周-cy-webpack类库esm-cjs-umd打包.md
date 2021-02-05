# 组件打包

我们要发布npm 组件包，怎么样才能实现打包多个模块规范输出呢？如何实现的？基于webpack配置output.library和output.libraryTarget提供的功能。

var - 默认值

### ES6 module
```
import demo from 'demo';
demo();
```

### commonjs 方式
```
const demo = require('demo');
demo();
```
libraryTarget: "commonjs" - 将库的返回值分配给exports对象的由output.library指定的属性。

### UMD
```
(function webpackUniversalModuleDefinition(root, factory) {
if(typeof exports === 'object' && typeof module === 'object')
  module.exports = factory();
else if(typeof define === 'function' && define.amd)
  define([], factory);
else if(typeof exports === 'object')
  exports["MyLibrary"] = factory();
else
  root["MyLibrary"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return _entry_return_;
});
```
libraryTarget: "umd" - 这个选项会尝试把库暴露给前使用的模块定义系统，这使其和CommonJS、AMD兼容或者暴露为全局变量。
## 目标
组件打包 esm/cjs/umd 3种主流方式。

## ems
es怎么实现？
思考题哈哈哈。


## cjs
libraryTarget: "commonjs"

## umd
libraryTarget: "umd"

## 参考
[demo: c-package](https://github.com/chdyiboke/c-package)
[详解webpack的out.libraryTarget属性](https://blog.csdn.net/frank_yll/article/details/78992778)