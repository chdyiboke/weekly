# React源码解析：HostRoot

## 引言
```js
switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case FunctionComponent:
    case ClassComponent:
    case HostRoot:
    case HostComponent:
    case HostText:
    case SuspenseComponent:
    case HostPortal:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextProvider:
    case ContextConsumer:
    case MemoComponent:
    case SimpleMemoComponent:
    case IncompleteClassComponent:
    case SuspenseListComponent:
    case FundamentalComponent:
    case ScopeComponent:
}
```

## HostRoot
<div id="root" />
```js
case HostRoot:
  return updateHostRoot(current, workInProgress, renderExpirationTime);
```

## updateHostRoot
```js
/**
 * 从HostRoot开始的更新流程
 * @param { render之前的fiber } current
 * @param { 更新流程中的fiber } workInProgress
 * @param { 渲染的超时时间 } renderExpirationTime
 */
function updateHostRoot(current, workInProgress, renderExpirationTime) {  // 第一次进入是root节点 所以进入该函数内部逻辑进行处理
  pushHostRootContext(workInProgress);   // 将一系列有用的信息推入内部栈（包括#app实例、context信息等）
  const updateQueue = workInProgress.updateQueue;
  const nextProps = workInProgress.pendingProps;  // 新的props
  const prevState = workInProgress.memoizedState;  // 上一次渲染使用的state 初次渲染为null
  const prevChildren = prevState !== null ? prevState.element : null;   // 上一次渲染的children，因为是hostroot类型的节点，所以state的element是reactelement对象节点
  processUpdateQueue(    // 执行更新队列，主要的任务是将 React.Element 添加到 Fiber 的 memoizedState 和 updateQueue 即计算下一次渲染的state状态
    workInProgress,
    updateQueue,
    nextProps,
    null,
    renderExpirationTime,
  );
  const nextState = workInProgress.memoizedState; 
  const nextChildren = nextState.element;   // 新的children
  if (nextChildren === prevChildren) {   // 前后两个children相等说明
    resetHydrationState();   // 重置Hydration状态
    return bailoutOnAlreadyFinishedWork(  // 判断这个 fiber 的子树是否需要更新，如果有需要更新会 clone 一份到 workInProgress.child 返回到 workLoop 的 nextUnitOfWork, 否则为 null
      current,
      workInProgress,
      renderExpirationTime,
    );
  }
  const root: FiberRoot = workInProgress.stateNode;   // HostRoot的stateNode是一个fiberRoot对象
  if (root.hydrate && enterHydrationState(workInProgress)) {  // render流程之前的fiber或fiber.child为空，且是服务端渲染才进if流程
    let child = mountChildFibers(   // 参数为false的reconcileChildFibers方法
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime,
    );
    workInProgress.child = child;
    let node = child;
    while (node) {
      node.effectTag = (node.effectTag & ~Placement) | Hydrating;
      node = node.sibling;
    }
  } else {
    // root.React会根据新的state属性更新workInProgress的child，并将变更的child节点存入workInProgress的effect链表中
    reconcileChildren(
      current,
      workInProgress,
      nextChildren,
      renderExpirationTime,
    );
    resetHydrationState();  // 重置Hydration状态
  }
  return workInProgress.child;
}
```
### bailoutOnAlreadyFinishedWork
跳过该节点及所有子节点的更新，不再往下执行组件的更新，否则根据 Fiber 对象的 tag 分类更新。

作用：判断这个 fiber 的子树是否需要更新，如果有需要更新会 clone 一份到 workInProgress.child 返回到 workLoop 的 nextUnitOfWork, 否则为 null
```js
function bailoutOnAlreadyFinishedWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  cancelWorkTimer(workInProgress);
 
  if (current !== null) {
    workInProgress.dependencies = current.dependencies;
  }
 
  if (enableProfilerTimer) {
    stopProfilerTimerIfRunning(workInProgress);
  }
 
  const updateExpirationTime = workInProgress.expirationTime;
  if (updateExpirationTime !== NoWork) {
    markUnprocessedUpdateTime(updateExpirationTime);  // 更新过期时间，如果updateExpirationTime!==0
  }
 
  const childExpirationTime = workInProgress.childExpirationTime;
  if (childExpirationTime < renderExpirationTime) {  // 子树优先级低返回null
    return null;
  } else {
    cloneChildFibers(current, workInProgress);    // 子树需要更新 clone一份到workInProgress.child上  创建下一层级所有节点的 workInprogress 对象并和父节点建立联系
    return workInProgress.child;
  }
}
 
function markUnprocessedUpdateTime(
  expirationTime: ExpirationTime,
): void {
  if (expirationTime > workInProgressRootNextUnprocessedUpdateTime) {
    // workInProgressRootNextUnprocessedUpdateTime初始值为0
    workInProgressRootNextUnprocessedUpdateTime = expirationTime;   // 比较workInProgressRootNextUnprocessedUpdateTime取最大值
  }
}
```

#### cloneChildFibers
```js
function cloneChildFibers(
  current: Fiber | null,
  workInProgress: Fiber,
): void {
  invariant(
    current === null || workInProgress.child === current.child,
    'Resuming work not yet implemented.',
  );
 
  if (workInProgress.child === null) {
    return;
  }
 
  // 当前节点的第一个子节点
  let currentChild = workInProgress.child;
  // 为子节点创建alternate 也就是创建了子节点的 workInprogress
  let newChild = createWorkInProgress(
    currentChild,
    currentChild.pendingProps,
    currentChild.expirationTime,
  );
 
  // 当前节点的 workInProgress 通过 child 字段指向子节点的 workInprogress
  // 子节点的 workInProgress 通过 return 字段指向当前节点的 workInprogress
  // 其实就是建立了关系
  workInProgress.child = newChild;
 
  newChild.return = workInProgress;
  // 建立兄弟节点和父节点的关系
  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling;
    newChild = newChild.sibling = createWorkInProgress(
      currentChild,
      currentChild.pendingProps,
      currentChild.expirationTime,
    );
    newChild.return = workInProgress;
  }
  newChild.sibling = null;
}
```

### processUpdateQueue
```js
function processUpdateQueue<State>(  // 处理fiber节点上的updateQueue
  workInProgress: Fiber,
  queue: UpdateQueue<State>,
  props: any,
  instance: any,
  renderExpirationTime: ExpirationTime,
): void {
  hasForceUpdate = false;
  queue = ensureWorkInProgressQueueIsAClone(workInProgress, queue);  // 确定workInProgress是current的备份，而不是直接操作current
  let newBaseState = queue.baseState;
  let newFirstUpdate = null;
  let newExpirationTime = NoWork;
 
  let update = queue.firstUpdate;  // 从链表的头节点开始遍历updateQueue
  let resultState = newBaseState;
  while (update !== null) {
    const updateExpirationTime = update.expirationTime;   // 获取update的更新超时时间
    if (updateExpirationTime < renderExpirationTime) {  // 比较更新超时时间和渲染超时时间的优先级,如果渲染超时时间优先级更高，则跳过更新的处理
      if (newFirstUpdate === null) { // 如果newFirstUpdate为null，则说明还没有被跳过的更新任务，
        newFirstUpdate = update;  // 本次没有更新的 update元素，会优先放到下一次去判断要不要更新
        newBaseState = resultState;
      }
      // 该 update元素 被跳过，仍留在队列中，所以它仍有expirationTime，需要被更新
      if (newExpirationTime < updateExpirationTime) {
        newExpirationTime = updateExpirationTime;
      }
    } else {
      markRenderEventTimeAndConfig(updateExpirationTime, update.suspenseConfig);   // 标记渲染事件时间和配置
 
      // 执行 update 并计算出一个新的结果 获取最新的state
      resultState = getStateFromUpdate(
        workInProgress,
        queue,
        update,
        resultState,
        props,
        instance,
      );
      const callback = update.callback;   // 当 callback 不为 null 时，在 setState 更新完后，是要执行 callback 的所以要设置相关的属性来“提醒”
      if (callback !== null) {
        workInProgress.effectTag |= Callback;
        update.nextEffect = null;
        if (queue.lastEffect === null) { //链表的插入操作
          queue.firstEffect = queue.lastEffect = update;
        } else {
          queue.lastEffect.nextEffect = update;
          queue.lastEffect = update;
        }
      }
    }
    // Continue to the next update.  继续下一个update元素 循环
    update = update.next;
  }
 
  // 逻辑同上，捕获错误阶段的更新
  let newFirstCapturedUpdate = null;
  update = queue.firstCapturedUpdate;   // 第一次捕获的队列
  while (update !== null) {
    // ...
    update = update.next;
  }
  // 执行完 update 后，更新 queue 上的相关属性
  if (newFirstUpdate === null) {  
    queue.lastUpdate = null;
  }
  if (newFirstCapturedUpdate === null) {
    queue.lastCapturedUpdate = null;
  } else {
    workInProgress.effectTag |= Callback;
  }
  if (newFirstUpdate === null && newFirstCapturedUpdate === null) {
    newBaseState = resultState;
  }
  // 更新queue上的属性
  queue.baseState = newBaseState;
  queue.firstUpdate = newFirstUpdate;
  queue.firstCapturedUpdate = newFirstCapturedUpdate;
 
  markUnprocessedUpdateTime(newExpirationTime);
  workInProgress.expirationTime = newExpirationTime;  // 执行了 update 队列的部分更新，那么 update 队列的expirationTime将由保留下来的 update 元素的最高优先级的 expirationTime 决定
  workInProgress.memoizedState = resultState;
}
```
解析：
* 执行ensureWorkInProgressQueueIsAClone()，生成updateQueue的副本queue
* 取出queue的第一个update 元素，并根据它的expirationTime判断是否需要执行更新
* 如果不需要执行更新，则该 update 元素会保留在queue中，并更新它的expirationTime
* 如果需要执行更新的话，执行getStateFromUpdate()，来获取新的state
* 如果该 update 元素上，还有 callback 的话（即开发角度的this.setState({xx:yy},()=>{})的回调函数()=>{}），还要设置相关属性来“提醒”更新 state 后，再执行 callback
* update = update.next，跳到下一个 update 元素，重复执行 (2)、(3)、(4)、(5)
* 然后是「捕获错误」阶段的更新，逻辑同上，不再赘述
* 最后，更新 queue 和 workInProgress 上的属性

#### ensureWorkInProgressQueueIsAClone
作用：生成updateQueue的副本queue
```js
function ensureWorkInProgressQueueIsAClone<State>(
  workInProgress: Fiber,
  queue: UpdateQueue<State>,
): UpdateQueue<State> {
  const current = workInProgress.alternate;
  if (current !== null) {
    if (queue === current.updateQueue) {
      queue = workInProgress.updateQueue = cloneUpdateQueue(queue);  // 浅复制update 避免在update上直接操作
    }
  }
  return queue;
}
 
function cloneUpdateQueue<State>(
  currentQueue: UpdateQueue<State>,
): UpdateQueue<State> {
  const queue: UpdateQueue<State> = {
    baseState: currentQueue.baseState,
    firstUpdate: currentQueue.firstUpdate,
    lastUpdate: currentQueue.lastUpdate,
 
    firstCapturedUpdate: null,
    lastCapturedUpdate: null,
 
    firstEffect: null,
    lastEffect: null,
 
    firstCapturedEffect: null,
    lastCapturedEffect: null,
  };
  return queue;
}
```
#### getStateFromUpdate
```js
function getStateFromUpdate<State>(   // 获取最新的state
  workInProgress: Fiber,
  queue: UpdateQueue<State>,
  update: Update<State>,
  prevState: State,
  nextProps: any,
  instance: any,
): any {
  switch (update.tag) {       // 返回执行payload后的state
    case ReplaceState: {
      const payload = update.payload;
      if (typeof payload === 'function') {
        const nextState = payload.call(instance, prevState, nextProps);
        return nextState;
      }
      return payload;
    }
    case CaptureUpdate: {
      workInProgress.effectTag =
        (workInProgress.effectTag & ~ShouldCapture) | DidCapture;
    }
    case UpdateState: {
      const payload = update.payload;
      let partialState;
      if (typeof payload === 'function') {
        partialState = payload.call(instance, prevState, nextProps);
      } else {  //否则就直接赋值给 state
        partialState = payload;
      }
      if (partialState === null || partialState === undefined) {  //如果partialState没有值，则视为没有更新 state
        return prevState;
      }
      return Object.assign({}, prevState, partialState);  //如果partialState有值的话，需要和未更新的部分 state 属性进行合并
    }
    case ForceUpdate: {
      hasForceUpdate = true;
      return prevState;
    }
  }
  return prevState;
}
```

### reconcileChildren
该方法最终调用的是reconcileChildFibers

mountChildFibers和reconcileChildFibers方法是一样的，唯一的区别是生成这个方法的时候的一个参数不同

export const reconcileChildFibers = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false)
这个参数叫shouldTrackSideEffects，他的作用是判断是否要增加一些effectTag，主要是用来优化初次渲染的：
```js
if (shouldTrackSideEffects && newFiber.alternate === null) {
  newFiber.effectTag = Placement
}
```