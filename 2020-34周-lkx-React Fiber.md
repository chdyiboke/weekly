# React Fiber

## 什么是Fiber

React Fiber 是对核心算法的一次重新实现.

## 出现的背景
当页面元素很多，且需要频繁刷新的场景下，浏览器页面会出现卡顿现象，原因是因为 计算任务 持续占据着主线程，从而阻塞了 UI 渲染。

例子：在更新组件的时候，用户往input输入，敲击键盘也不会获得响应，因为渲染输入按键结果也是浏览器主线程的工作，但是浏览器主线程被React占着呢，抽不出空，最后的结果就是用户敲了按键看不到反应，等React更新过程结束之后，咔咔咔那些按键一下子出现在input元素里了。

## 为什么叫Fiber
在计算机科学中有一个概念叫做Fiber,英文含义就是"纤维"，意指比Thread更细的线，也就是比线程(Thread)控制得更精密的并发处理机制。React团队把这个功能命名为Fiber, 含义也是更加紧密的处理机制。

## 大概思路
将 计算任务 分给成一个个小任务(根据虚拟dom节点拆分），分批完成，在完成一个小任务后，将控制权还给浏览器，让浏览器利用间隙进行 UI 渲染。

借助 API requestIdleCallback实现
```
window.requestIdleCallback()
在浏览器空闲时，让开发者在主事件循环中执行后台或低优先级的任务，而且不会对像动画和用户交互这样延迟触发的关键事件产生影响。
函数一般会按先进先调用的顺序执行，除非函数在被浏览器调用之前的等待时间，超过了它的超时时间。
```

### 比较

![avatar](/img/fiber.png)

![avatar](/img/stack.png)

中间每一个波谷代表深入某个分片的执行过程，每个波峰就是一个分片执行结束交还控制权的时机。

### 实现方式

把一个耗时长的任务分成很多小片，每一个小片的运行时间很短，虽然总时间依然很长，但是在每个小片执行完之后，都给其他任务一个执行的机会，这样唯一的线程就不会被独占，其他任务依然有运行的机会。

React Fiber把更新过程碎片化，每执行完一段更新过程，就把控制权交还给React负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。维护每一个分片的数据结构，就是Fiber。

Fiber 实现步骤：
1. ReactDOM.render() 和 setState 的时候开始创建更新。
2. 将创建的更新加入任务队列，等待调度。
3. 在 requestIdleCallback 空闲时执行任务。
4. 从根节点开始遍历 Fiber Node，并且构建 WokeInProgress Tree。
5. 生成 effectList。
6. 根据 EffectList 更新 DOM。

Fiber Node其实指的是一种数据结构，可以用js对象来表示：
```js
const fiber = {
    stateNode,  //节点实例
    child,      //子节点
    sibling,    //兄弟节点
    return,     //父节点
    ...
}
```

### 改动 —— Fiber Reconciler层
React 框架内部运作可以分为 3 层：

* Virtual DOM 层：描述 UI
* Reconciler 层：负责调用组件生命周期的方法、进行 Diff 运算
* Renderer 层：根据不同的平台，渲染出相应的页面，如 ReactDOM 和 ReactNative

改动后的 Reconciler 层 称为 Fiber Reconciler, 执行一段时间会把控制权交还回去，改动前的叫Stack Reconciler，一旦执行不会被打断，直到执行结束

### Fiber Reconciler 的执行阶段

* Reconciliation Phase  生成 Fiber 树的渐进阶段，可以被打断。
* Commit Phase          批量更新节点的阶段，不可被打断

阶段一有两颗树，Virtual DOM 树和 Fiber 树，Fiber 树是在 Virtual DOM 树的基础上通过额外信息生成的。
它每生成一个新节点，就会将控制权还给浏览器，如果浏览器没有更高级别的任务要执行，则继续构建；反之则会丢弃 正在生成的 Fiber 树，等空闲的时候再重新执行一遍。

![avatar](/img/优先级.png)

比如：一个低优先级的任务A正在执行，已经调用了某个组件的componentWillUpdate函数，接下来发现自己的时间分片已经用完了，于是冒出水面，看看有没有紧急任务，哎呀，真的有一个紧急任务B，接下来React Fiber就会去执行这个紧急任务B，任务A虽然进行了一半，但是没办法，只能完全放弃，等到任务B全搞定之后，任务A重头来一遍，注意，是重头来一遍，不是从刚才中段的部分开始，也就是说，componentWillUpdate函数会被再调用一次。

在现有的React中，每个生命周期函数在一个加载或者更新过程中绝对只会被调用一次；在React Fiber中，不再是这样了，第一阶段中的生命周期函数在一次加载和更新过程中可能会被多次调用！

注意：所以在使用React Fiber之后，一定要检查一下第一阶段相关的这些生命周期函数，看看有没有逻辑是假设在一个更新过程中只调用一次，有的话就要改了。

### 优先级策略
React v16.0.0的优先级是这样划分的：
* synchronous 与之前的Stack reconciler操作一样，同步执行
* task 在next tick之前执行
* animation 下一帧之前执行
* high 在不久的将来立即执行
* low 稍微延迟（100-200ms）执行也没关系
* offscreen 下一次render时或scroll时才执行

synchronous首屏（首次渲染）用，要求尽量快，不管会不会阻塞UI线程。animation通过requestAnimationFrame来调度，这样在下一帧就能立即开始动画过程；后3个都是由requestIdleCallback回调执行的；offscreen指的是当前隐藏的、屏幕外的（看不见的）元素。

React 有一套计算逻辑，根据不同的优先级类型为不同的 work 计算出一个过期时间 expirationTime，其实就是一个时间戳。本质上是根据过期时间 expirationTime 的大小来确定优先级顺序，expirationTime 数值越大，则优先级越高。


优先级机制用来处理突发事件与优化次序，例如：
* 到commit阶段了，提高优先级
* 高优任务做一半出错了，给降一下优先级
* 抽空关注一下低优任务，别给饿死了
* 如果对应DOM节点此刻不可见，给降到最低优先级

### Fiber Tree 和 WorkInProgress Tree

React 在 render 第一次渲染时，会通过 React.createElement 创建一颗 Element 树，可以称之为 Virtual DOM Tree，由于要记录上下文信息，加入了 Fiber，每一个 Element 会对应一个 Fiber Node，将 Fiber Node 链接起来的结构成为 Fiber Tree。在后续的更新过程中（setState），每次重新渲染都会重新创建Element, 但是 Fiber 不会，Fiber 只会使用对应的 Element 中的数据来更新自己必要的属性，

Fiber Tree 一个重要的特点是链表结构，将递归遍历编程循环遍历，然后配合 requestIdleCallback API, 实现任务拆分、中断与恢复。

![avatar](/img/fiber-tree.png)

在第一次渲染之后，React 最终得到一个 Fiber 树，它反映了用于渲染 UI 的应用程序的状态。这棵树通常被称为 current 树（当前树） 。当 React 开始处理更新时，它会构建一个所谓的 workInProgress 树（工作过程树） ，它反映了要刷新到屏幕的未来状态。

采用双缓冲技术（double buffering），在 render 的时候创建的那颗 Fiber Tree 被称作为 Current Tree，另外 setState 的时候回重新构建一颗 WorkInProgress Tree，不过不是完全的重新创建，会有一定的策略来复用 Current Tree 里的节点，这样可以节省不必要的 Node 创建。WorkInProgress Tree 构造完毕，得到的就是新的 Fiber Tree，然后喜新厌旧（把 current 指针指向WorkInProgress Tree，丢掉旧的 Fiber Tree）就好了。每个workInProgress tree节点上都有一个effect list用来存放diff结果，当前节点更新完毕会向上merge effect list（queue收集diff结果）。最后根据 EffectList 更新 DOM。

![avatar](/img/worktree.png)

这样做的好处：
* 能够复用内部对象（fiber）
* 节省内存分配和时间开销

## Fiber框架对React开发影响

1. 不使用官方弃用的生命周期
2. 注意优先级导致的bug，业务开发时注意高优先级任务频率，避免出现低优先级任务延迟久或永不执行
3. 业务逻辑实现不要太依赖生命周期钩子函数