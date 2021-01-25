# react源码分享之commit

## 开场

render之后就是commit。

```
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

```
import * as React from 'react';

export default function App(){
  let [number, setNumber] = React.useState(0);

  React.useEffect(() =>{
    setNumber(8);
  }, []);

  return (
    <div className="App">
      <button onClick={add}>{number}</button>
    </div>
  );
}
```

打个不恰当的比喻：本地代码改完了，我们要执行`git add ` 和`git commit ` 把代码提交上去。
在这里`commit`对应的就是真实的dom的更新。

## 引入问题

我们应该知道 useEffect 传入 [] 作为第二个参数有点类似于 componentDidMount。

那来看一个 `bad case`。

```
const Child = ({ getFormIns }) => {
  // 生成一个 form 实例
  const form = Form.useForm();
    
  // 试图向外层传递 form 实例
  useEffect(() => {
    if(getFormIns) {
      getFormIns(form);
    }
  }, [])；
    
  return <span></span>
}
  
class App extends React.Component {
  constructor(props) {
    super(props);
		this.formIns = null;
  }
    
  componentDidMount() {
    // 拿到 form 实例 做一些操作
    formIns.updateModel({});
  }
    
  return <Child getFormIns={(form) => this.formIns = form} />
}
```
以上代码中试图在父组件中调用 Form 实例相关的方法， 但是实际上 useEffect 的执行时机并不是真正的 didMount，导致父组件在 DidMount 的时候出错，将 useEffect 换成 useLayoutEffect 就可以解决上述问题，但不管是使用 useLayoutEffect 还是使用 useEffect 都不符合 Hooks 的语义，在示例代码中场景是父组件期望可以调用子组件的变量或者方法，这种场景更适合使用 useImperativeHandle 来代替。 

这个问题我们需要弄懂 commit的过程：


下面看看源码流程：
## 源码

```
//提交HostComponent的 side effect，也就是 DOM 节点的操作(增删改)
 
function commitRoot(root) {
  //获取调度优先级，并临时替换当前的优先级，去执行传进来的 callback  ImmediatePriority
  const renderPriorityLevel = getCurrentPriorityLevel();
  runWithPriority(
    ImmediateSchedulerPriority,
    commitRootImpl.bind(null, root, renderPriorityLevel),
  );
  return null;
}
 
function commitRootImpl() {
  // 刷新所有的 PassiveEffect
  do {
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);
   
  // Get the list of effects.
  // effectList 的第一个节点
  let firstEffect;
  // ...
  // 省略 if 判断，如果 root 有副作用的话，其副作用将会放置在 effectList 的末尾，root 无副作用的话，那么 firstEffect 就是根组件的 firstEffect
  firstEffect = finishedWork.firstEffect;
  if (firseEffect !== null) {
    nextEffect = firstEffect;
    // 第一阶段，before mutation
    do {
      commitBeforeMutationEffects();
    } while(nextEffect !== null)

    // ...
    // 将游标重置，指向 effect list 头
    nextEffect = firstEffect;
    // 第二阶段 mutation
    do {
      commitMutationEffects(root, renderPriorityLevel);
    } while(nextEffect !== null)
         
    //重要：将当前的 workInProgress树 作为 current 树
    root.current = finishedWork;
     
    // ...
    // 第三阶段 layout
    do {
      commitLayoutEffects(root, expirationTime);
    } while(nextEffect）
             
    // 让调度器在 帧 的末尾暂停，给浏览器机会执行一次 重绘
    requestPaint();
     
    // 本次 commit 是否有产生新的更新
    if (rootDoesHavePassiveEffects) {
    // 如果存在新的更新，将 root 节点赋给 rootWithPendingPassiveEffects
    rootWithPendingPassiveEffects = root;
    ...
    } else {
      // 遍历 effect list 逐个设置为 null 以便 GC
      nextEffect = firstEffect;
      while (nextEffect !== null) {
        const nextNextEffect = nextEffect.nextEffect;
        nextEffect.nextEffect = null;
        if (nextEffect.effectTag & Deletion) {
          detachFiberAfterEffects(nextEffect);
        }
        nextEffect = nextNextEffect;
      }
    }
     
    // 确保 root 上所有的 work 都被调度完
    ensureRootIsScheduled(root);
     
    // 检测在 useLayoutEffect 中是否做了布局修改等，刷新布局，如果在 layoutEffect 中调用了 setState 也会在该函数中检测中并开启新的一轮调度
    // 原版注释： If layout work was scheduled, flush it now.
    flushSyncCallbackQueue();
  } else { ... }
}

```

## 总结
一个完整的 commit 会被拆分为三个子阶段来完成，在 commit 末尾会刷新 commit 阶段产生的同步回调及 setState  
    第一阶段：对于 Class 组件而言，是执行 getSnapShotBeforeUpdate 生命周期，对于函数式组件则是安排异步回调  
    第二阶段：React 会挂载或更新 DOM，并清理上一轮的 useLayoutEffect  
    第三阶段：对于 Class 组件而言是执行 componentDidMount，对于函数式组件则是执行 useLayoutEffect  

## QA

### 0. useEffect 和 useLayoutEffect
顺序函数式调用：从上到下，父useState>子useState>子useLayoutEffect>父useLayoutEffect>子useEffect>父useEffect  

    a. 首先推荐使用useEffect，建议带依赖的第二个参数。  
    b. useLayoutEffect 是更加类似 componentDidmount，可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。 
    c.useEffect 与 componentDidMount、componentDidUpdate 不同的是，在浏览器完成布局与绘制之后，传给 useEffect 的函数会延迟调用。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因此不应在函数中执行阻塞浏览器更新屏幕的操作。

未来：从概念上来说它表现为：所有 effect 函数中引用的值都应该出现在依赖项数组中。未来编译器会更加智能，届时自动创建数组将成为可能。

### 1. Hook 在组件顶层调用
[在组件顶层调用 Hook 的原因](https://react.html.cn/docs/hooks-rules.html#explanation)  
我们可以在单个组件中使用多个 State 或 Effect Hook：  
那么 React 如何知道哪个 state(状态) 对应于哪个 useState 调用呢？答案是 React 依赖于调用 Hooks 的顺序。  

```
  // 🔴 我们在条件语句中使用Hook，打破了第一条规则
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```

同样的：
只在 React Functions 调用 Hooks。


### 2. 错误边界？ componentDidCatch
三个阶段都有错误处理。

### 3. fiber Dom挂载？
发生在第二阶段。

### 4. root.current = finishedWork; 是什么意思？
重要：在 DomElement 副作用处理完毕之后，意味着之前讲的缓冲树（workInProgress）已经完成任务，翻身当主人，成为下次修改过程的current 树。

### 5. requestPaint()是干什么的 ？
让调度器在 帧 的末尾暂停，给浏览器机会执行一次 重绘。
绘制图形、svg等。

### 6. firstEffect 和 flushPassiveEffects（flush） 是啥意思?

finishedWork.firstEffect.nextEffect 形成effect链？

flushPassiveEffects 清空副作用。

### 7. expirationTime 和 lanes 区别
[新的时间模型lanes](https://github.com/suoutsky/three-body-problem/issues/124)
[react lanes 和 expirationTime-知乎](https://zhuanlan.zhihu.com/p/158779371)
[使用 lanes 模型替代 expirationTime 模型](https://juejin.cn/post/6898635086657224717#heading-12)

在 V6 版本中，以expirationTime的大小来衡量优先级，expirationTime越大，则优先级越高。 
expirationTime 问题：只能执行一个任务。
lanes：可以同时执行多个任务的能力。 // 值越大，优先级越高
这种优先级区间模型被称为lanes（车道模型）。

本质是【叠加算法】，多个任务可以相互叠加表示，用 js 来表示就是一个状态队列 { lanes: [1, 2, 3] }
表示 fiber 有三个不同的优先级，他们应该被批处理

react 作者 acdlite 觉得操作状态队列不够方便，进而采用了一种“位运算代替状态队列”的方式：{ lanes: 0b10010 }
新的 lane 算法中，lanes 是一个二进制数字，比如 10010 是由 10000 和 00010 两个任务叠加而成的。

### 8. 钩子里面初始化定时器问题。
期待后面钩子的分享：
如何解决 https://overreacted.io/zh-hans/making-setinterval-declarative-with-react-hooks/
