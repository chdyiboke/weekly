# React StrictMode

## 前言
StrictMode 是 React 在 16.3 版本新增的一个组件，按照官方的说法：

StrictMode 是一个用来突出显示应用程序中潜在问题的工具。与 Fragment 一样，StrictMode 不会渲染任何可见的 UI。它为其后代元素触发额外的检查和警告。

## StrictMode 功能介绍

### 检测意外的副作用

从概念上讲，React 分两个阶段工作：
渲染 阶段会确定需要进行哪些更改，比如 DOM。在此阶段，React 调用 render，然后将结果与上次渲染的结果进行比较。
提交 阶段发生在当 React 应用变化时。（对于 React DOM 来说，会发生在 React 插入，更新及删除 DOM 节点的时候。）在此阶段，React 还会调用 componentDidMount 和 componentDidUpdate 之类的生命周期方法。
提交阶段通常会很快，但渲染过程可能很慢。因此，即将推出的 concurrent 模式 (默认情况下未启用) 将渲染工作分解为多个部分，对任务进行暂停和恢复操作以避免阻塞浏览器。这意味着 React 可以在提交之前多次调用渲染阶段生命周期的方法，或者在不提交的情况下调用它们（由于出现错误或更高优先级的任务使其中断）。

```
- constructor
- componentWillMount (or UNSAFE_componentWillMount)
- componentWillReceiveProps (or UNSAFE_componentWillReceiveProps)
- componentWillUpdate (or UNSAFE_componentWillUpdate)
- getDerivedStateFromProps
- shouldComponentUpdate
- render
- setState 更新函数（第一个参数）
```

因为上述方法可能会被多次调用，所以不要在它们内部编写副作用相关的代码，这点非常重要。忽略此规则可能会导致各种问题的产生，包括内存泄漏和或出现无效的应用程序状态。不幸的是，这些问题很难被发现，因为它们通常具有非确定性。
严格模式不能自动检测到你的副作用，但它可以帮助你发现它们，使它们更具确定性。通过在开发环境下故意重复调用以下方法来实现的该操作：

```
- class 组件的 constructor 方法
- render 方法
- setState 更新函数 (第一个参数）
- 静态的 getDerivedStateFromProps 生命周期方法
```

以 render 方法为例，简单看下 StrictMode 关于检测意外的副作用的实现：
![avatar](https://user-gold-cdn.xitu.io/2020/3/8/170ba54f14dcb23b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1) 


### 识别不安全的生命周期

### 对于使用废弃的 findDOMNode 方法的警告

### 检测过时的 context API

### 对于使用字符串 ref API 的警告


官方文档：https://zh-hans.reactjs.org/docs/strict-mode.html