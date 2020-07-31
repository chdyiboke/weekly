# Javascript 模块化


## 模块化的背景
Javascript 程序本来很小,现在有了运行大量 Javascript 脚本的复杂程序




## 浏览器开始原生支持模块功能

JavaScript 模块依赖于import和 export，浏览器兼容性


简单的例子：
https://mdn.github.io/js-examples/modules/basic-modules/

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules


## .mjs 与 .js

数服务器可以正确地处理 .js 文件的类型，但是 .mjs 还不行。
为了学习和保证代码的可移植的目的，我们建议使用 .js。

在开发过程中使用 .mjs，而在构建过程中将其转换为 .js。

## 导入html的方式

<script type="module" src="main.mjs"></script>


### 重命名导出与导入，避免命名冲突
在你的 import 和 export 语句的大括号中，可以使用 as 关键字跟一个新的名字



## 新一代打包


我们完全可以抛弃打包工具，而直接在浏览器中使用浏览器原生的 JavaScript 模块功能。这主要基于三点考虑：
1. 兼容性可接受：基本主流的浏览器版本都支持直接使用 JavaScript Module 了（当然，IE 一如既往除外）。
2. 性能问题的改善：之前打包的一个重要原因是 HTTP/1.1 的特性导致，我们合并请求来优化性能；而如今 HTTP/2 普及之后，这个性能问题不像以前那么突出了。

https://juejin.im/post/6844904146915573773#heading-2

只是编译的话，最终产出的依然是 a.js、b.js、c.js 三个文件，只有编译耗时。由于入口是 c.js，浏览器解析到 import { a } from './a' 时，会发起 HTTP 请求 a.js （b 同理），就算不用打包，也可以加载到所需要的代码，因此省去了合并代码的时间。


https://www.jishuwen.com/d/pGEi



