# Node模块规范

## 背景：CJS 和 ESM 是什么？


Node 从诞生开始就使用了 CJS 规范来编写模块。我们用 require() 引用模块，用 exprts 来定义对外暴露的方法，有 module.exports.foo = 'bar' 或者 module.exports = 'baz'。



在 Node 14 的项目里，我们依然能看到混杂着 CommonJS（CJS） 和 ES Modules（ESM） 风格的代码。




