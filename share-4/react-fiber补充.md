# react-fiber补充

写的太好了，我就补充一点

## 背景

React16新的生命周期：弃用了componentWillMount、componentWillReceivePorps，componentWillUpdate三个生命周期， 新增了getDerivedStateFromProps、getSnapshotBeforeUpdate来代替弃用的三个钩子函数。  

 React 官方为什么要弃用这三生命周期：

 根本原因是V16版本重构核心算法架构：React Fiber  

在V16版本之前 协调机制 是 Stack reconciler， V16版本发布Fiber 架构后是 `Fiber reconciler`。

### 递归 改 循环

Stack reconciler的工作流程很像函数的调用过程。父组件里调子组件，可以类比为函数的递归

```
假如更新一个组件需要1毫秒，如果有200个组件要更新，那就需要200毫秒，在这200毫秒的更新过程中，浏览器那个唯一的主线程都在专心运行更新操作，  
无暇去做任何其他的事情。想象一下，在这200毫秒内，用户往一个input元素中输入点什么，敲击键盘也不会获得响应，因为渲染输入按键结果也是浏览器  
主线程的工作，但是浏览器主线程被React占着呢，抽不出空，最后的结果就是用户敲了按键看不到反应，等React更新过程结束之后，咔咔咔那些按键一下子 
出现在input元素里了。 

这就是所谓的界面卡顿，很不好的用户体验。

```
破解JavaScript中同步操作时间过长的方法其实很简单——分片。


```
React Fiber把更新过程碎片化，执行过程如下面的图所示，每执行完一段更新过程，就把控制权交还给React负责任务协调的模块，
看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。

维护每一个分片的数据结构，就是Fiber。

```

道理很简单，但是React实现这一点却不容易，折腾了两年多！


## 代码目录

React的相关代码都放在packages文件夹里

```
├── packages --------------------- React实现的相关代码
│   ├── create-subscription ------ 在组件里订阅额外数据的工具
│   ├── events ------------------- React事件相关
│   ├── react -------------------- 组件与虚拟DOM模型
│   ├── react-art ---------------- 画图相关库
│   ├── react-dom ---------------- ReactDom
│   ├── react-native-renderer ---- ReactNative
│   ├── react-reconciler --------- React调制器
│   ├── react-scheduler ---------- 规划React初始化，更新等等
│   ├── react-test-renderer ------ 实验性的React渲染器
│   ├── shared ------------------- 公共代码
│   ├── simple-cache-provider ---- 为React应用提供缓存

```

我们主要关注 `reconciler` 这个模块， packages/react-reconciler/src

```

├── react-reconciler ------------------------ reconciler相关代码
│   ├── ReactFiberReconciler.js ------------- 模块入口
├─ Model ----------------------------------------
│   ├── ReactFiber.js ----------------------- Fiber相关
│   ├── ReactUpdateQueue.js ----------------- state操作队列
│   ├── ReactFiberRoot.js ------------------- RootFiber相关
├─ Flow -----------------------------------------
│   ├── ReactFiberScheduler.js -------------- 1.总体调度系统
│   ├── ReactFiberBeginWork.js -------------- 2.Fiber解析调度
│   ├── ReactFiberCompleteWork.js ----------- 3.创建DOM 
│   ├── ReactFiberCommitWork.js ------------- 4.DOM布局
├─ Assist ---------------------------------------
│   ├── ReactChildFiber.js ------------------ children转换成subFiber
│   ├── ReactFiberTreeReflection.js --------- 检索Fiber
│   ├── ReactFiberClassComponent.js --------- 组件生命周期
│   ├── stateReactFiberExpirationTime.js ---- 调度器优先级
│   ├── ReactTypeOfMode.js ------------------ Fiber mode type
│   ├── ReactFiberHostConfig.js ------------- 调度器调用渲染器入口

```

Fiber reconciler 使用了scheduling(调度)这一过程， 每次只做一个很小的任务，做完后能够“喘口气儿”，回到主线程看下有没有什么更高优先级的任务需要处理，如果有则先处理更高优先级的任务，没有则继续执行(cooperative scheduling 合作式调度)。

网友测试使用React V16，当DOM节点数量达到100000时， 页面能正常加载，输入交互也正常了；


## Fiber 部分源码

https://juejin.im/post/6859528127010471949

work： state update，props update 或 refs update  

Fiber 对象：packages/react-reconciler/src/ReactFiber.js 

workTag： fiber 对象的 tag 属性值，称作 workTag，用于标识一个 React 元素的类型  
EffectTag： 把不能在 render 阶段完成的一些 work 称之为副作用  

在 render 阶段，React 可以根据当前可用的时间片处理一个或多个 fiber 节点，并且得益于 fiber 对象中存储的元素上下文信息以及指针域构成的链表结构，使其能够将执行到一半的工作保存在内存的链表中。当 React 停止并完成保存的工作后，让出时间片去处理一些其他优先级更高的事情。之后，在重新获取到可用的时间片后，它能够根据之前保存在内存的上下文信息通过快速遍历的方式找到停止的 fiber 节点并继续工作。由于在此阶段执行的工作并不会导致任何用户可见的更改，因为并没有被提交到真实的 DOM。所以，我们说是 fiber 让调度能够实现暂停、中止以及重新开始等增量渲染的能力。相反，在 commit 阶段，work 执行总是同步的，这是因为在此阶段执行的工作将导致用户可见的更改。这就是为什么在 commit 阶段， React 需要一次性提交并完成这些工作的原因。


当 React 遍历 current 树时，它会为每一个存在的 fiber 节点创建了一个替代节点，这些节点构成一个 workInProgress 树。后续所有发生 work 的地方都是在 workInProgress 树中执行。


enqueueSetState
每个 React 组件都有一个相关联的 updater，作为组件层和核心库之间的桥梁。react.Component 本质上就是一个函数，在它的原型对象上挂载了 setState 方法

// Component原型对象挂载
 setState 
 ```
 Component.prototype.setState = function (partialState, callback) { 
    this.updater.enqueueSetState(this, partialState, callback, 'setState'); 
 };
```
与 render 阶段不同，commit 阶段的执行始终是同步的



## QA
setstate是同步的嘛？
看是否能命中 batchUpdate 。setTimeout等定时器不能命中，所以是同步等。



