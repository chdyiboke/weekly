# react源码分享之commit

## 问题

三个阶段都有错误处理相关的吧 componentDidCatch。
flush 是啥意思
requestPaint() ？？
useLayoutEffect：可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

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
    // 每一阶段的详细代码后续进行说明
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
     
    // rootDoesHavePassiveEffects 标志位判断，该标志位是在 commit 第一阶段进行设置，标记当前 commit 是否具有 passiveEffect
    if (rootDoesHavePassiveEffects) {
      rootDoesHavePassiveEffects = false;
        rootWithPendingPassiveEffects = root;
        pendingPassiveEffectsExpirationTime = expirationTime;
        pendingPassiveEffectsRenderPriority = renderPriorityLevel;
    } else {
      // 遍历 effect list 逐个设置为 null 以便 GC
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

## 收获

