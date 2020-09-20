# Node模块规范

## 背景：CJS 和 ESM 是什么？


Node 从诞生开始就使用了 CJS 规范来编写模块。我们用 require() 引用模块，用 exprts 来定义对外暴露的方法，有 module.exports.foo = 'bar' 或者 module.exports = 'baz'。 


在 Node 14 的项目里，我们依然能看到混杂着 CommonJS（CJS） 和 ES Modules（ESM） 风格的代码。

```
'use strict';
 
const React = require('./src/React');
console.log('react 源码测试入口',React)
// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest.
module.exports = React.default || React;
```

## ESM 和 CJS 设计差异


### 三个重大差异

1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
3. CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。（更灵活）

下面说一下第三个差异。

CJS 的 require() 是`同步下载`的，实际执行的时候会从磁盘或者网络中读取文件，然后立即返回执行结果。被读取的模块有自己的执行逻辑，执行完成后通过 module.exports 返回结果。


ESM 的模块加载是基于 Top-level await 设计的，首先解析 import 和 export 指令，再执行代码，所以可以在执行代码之前检测到错误的依赖。
ESM 模块加载器在解析当前模块依赖之后，会下线这些依赖模块并在此解析，构建一个模块依赖图，直到依赖全部加载完成。最后，按照编写的代码，顺序执行对应的依赖。
根据 ESM 约定，这些依赖的 ES 模块都是`并行下载`最后顺序执行。


## Node 默认 CJS 规范是因为 ESM 的不兼容变更

ESM 对于 JavaScript 来说是一个巨大的规范变化。


CJS 无法 require() ESM 模块，最简单的原因就是 ESM 支持 Top-level await，但是 CJS 不支持。
Top-level await 支持在非 async 函数中使用 await。

```
export const foo = await fetch('./data.json');

```
ESM 支持多重解析的加载器，在不带来更多问题的情况下，让 Top-level await 变得可能。引用 V8 团队博客的内容，表达了一系列对于 Top-level await 的担忧，并抵制 JavaScript 实现这个特性。担忧包括：

Top-level await 可能会中断执行。
Top-level await 可能会终端资源下载。
无法和 CJS 模块互通。
提议的 stage 3 版本直接回应了这些问题：

只要模块能够被执行，就不会有中断的问题。
Top-level await 在解析模块依赖图的阶段执行。在这个阶段，所有字段都已经下载并建立对应关系，并不会阻断资源下载。
Top-level await 限定在 ESM 模块下，不会支持 CJS 模块（没有互通的必要）。
（Rich 现在已经接受了目前的 Top-level await 实现）
由于 CJS 不支持 top-level await，所以基本也无法把 ESM 的 top-level await 编译成 CJS 代码。

如果你深入了解，会发现 top-level await 并不是唯一的问题。

## 同时支持 CJS 和 ESM 包最佳实践

如果你当前维护了一个同时支持 CJS 和 ESM 的库，你可以根据下面的指南做的更好。

### 提供一个 CJS 版本
这样可以确保你的库在旧版本 Node 下跑的更好。
（如果你写的是 TypeScript 或者其他需要编译到 JS 的语言，那么编译到 CJS。）

### 基于 CJS 封装到 ESM 版本
（将 CJS 封装到 ESM 很容易，但是 ESM 库是没法封装到 CJS 库的。）

```
import cjsModule from '../index.js';
export const foo = cjsModule.foo;
```
把 ESM 封装放到 esm 子目录下，同时在 package.json 里声明 {"type": "module"} 。

（在 Node 14 下你也可以用 .mjs 后缀，不过有一些工具不一定支持 .mjs 文件，建议还是用子目录的方式） 

.mjs文件总是以 ES6 模块加载，.cjs文件总是以 CommonJS 模块加载，
.js文件的加载取决于package.json里面type字段的设置。

### 在 package.json 里增加 exports 映射
如下：

```
"exports": {  "require": "./index.js",  "import": "./esm/wrapper.js" }
```
注意：增加 exports 映射是一个不兼容变更。

exports 映射确保了开发者只能引用到明确的入口文件。这样很好，但是确实是一个不兼容变更。
（如果你本来就允许开发者来引用更多的文件，那么可以设置多个入口


## node 使用 import 的2种方式

1. babel-***-import-node
2. 在 package.json 里声明 {"type": "module"} 

参考文献：

https://mp.weixin.qq.com/s/M8c38T453DVLniYIjArriQ

http://nodejs.cn/api/esm.html#esm_modules_ecmascript_modules

http://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html

https://es6.ruanyifeng.com/#docs/module-loader
