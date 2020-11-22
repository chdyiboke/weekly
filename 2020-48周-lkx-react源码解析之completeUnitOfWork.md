
# completeUnitOfWork
作用：

完成当前节点的work，并赋值Effect链，然后移动到兄弟节点，重复该操作，当没有更多兄弟节点时，返回至父节点，最终返回至root节点

```js
function completeUnitOfWork(unitOfWork: Fiber): Fiber | null {
  workInProgress = unitOfWork;  //从下至上，移动到该节点的兄弟节点，如果一直往上没有兄弟节点，就返回父节点 当前节点为img
  do {
    const current = workInProgress.alternate;   // 获取当前节点
    const returnFiber = workInProgress.return;   // 获取父节点

    // 检查该节点是否有异常抛出
    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      setCurrentDebugFiberInDEV(workInProgress);
      let next;
      if (  // 如果不能使用分析器的 timer 的话，直接执行completeWork，
        !enableProfilerTimer ||
        (workInProgress.mode & ProfileMode) === NoMode
      ) {
        next = completeWork(current, workInProgress, renderExpirationTime);
      } else {
        startProfilerTimer(workInProgress);
        next = completeWork(current, workInProgress, renderExpirationTime);
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);
      }
      stopWorkTimer(workInProgress);
      resetCurrentDebugFiberInDEV();
      resetChildExpirationTime(workInProgress);  //更新该节点的 work 时长和子节点的 expirationTime

      if (next !== null) {
        return next;   //返回 next，以便执行新 work
      }
  
      if (  //如果父节点存在，并且其 Effect 链没有被赋值的话
        returnFiber !== null &&
        (returnFiber.effectTag & Incomplete) === NoEffect
      ) {
        //子节点的完成顺序会影响副作用的顺序
        if (returnFiber.firstEffect === null) {    //如果父节点没有挂载firstEffect的话，将当前节点的firstEffect赋值给父节点的firstEffect
          returnFiber.firstEffect = workInProgress.firstEffect;
        }
        if (workInProgress.lastEffect !== null) {  //同上，根据当前节点的lastEffect，初始化父节点的lastEffect
          if (returnFiber.lastEffect !== null) {  //如果父节点的lastEffect有值的话，将nextEffect赋值  目的是串联Effect链
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
          }
          returnFiber.lastEffect = workInProgress.lastEffect;
        }

        const effectTag = workInProgress.effectTag;   //获取副作用标记

        if (effectTag > PerformedWork) {  //如果该副作用标记大于PerformedWork
          if (returnFiber.lastEffect !== null) {  //当父节点的lastEffect不为空的时候，将当前节点挂载到父节点的副作用链的最后
            returnFiber.lastEffect.nextEffect = workInProgress;
          } else {  //否则，将当前节点挂载在父节点的副作用链的头-firstEffect上
            returnFiber.firstEffect = workInProgress;
          }
          returnFiber.lastEffect = workInProgress;  //无论父节点的lastEffect是否为空，都将当前节点挂载在父节点的副作用链的lastEffect上
        }
      }
    } else {  //如果该 fiber 节点未能完成 work 的话(报错)
      const next = unwindWork(workInProgress, renderExpirationTime);  //节点未能完成更新，捕获其中的错误

      if (   //由于该 fiber 未能完成，所以不必重置它的 expirationTime
        enableProfilerTimer &&
        (workInProgress.mode & ProfileMode) !== NoMode
      ) {
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);

        let actualDuration = workInProgress.actualDuration;   //虽然报错了，但仍然会累计 work 时长
        let child = workInProgress.child;
        while (child !== null) {
          actualDuration += child.actualDuration;
          child = child.sibling;
        }
        workInProgress.actualDuration = actualDuration;
      }

      if (next !== null) {  //如果next存在，则表示产生了新 work
        stopFailedWorkTimer(workInProgress);  //停止失败的 work 计时，可不看
        next.effectTag &= HostEffectMask;  //更新其 effectTag，标记是 restart 的
        return next;   //返回 next，以便执行新 work
      }
      stopWorkTimer(workInProgress);

      if (returnFiber !== null) {  //如果父节点存在的话，重置它的 Effect 链，标记为「未完成」
        returnFiber.firstEffect = returnFiber.lastEffect = null;
        returnFiber.effectTag |= Incomplete;
      }
    }

    const siblingFiber = workInProgress.sibling;  //获取兄弟节点
    if (siblingFiber !== null) {
      return siblingFiber;
    }
    //如果能执行到这一步的话，说明 siblingFiber 为 null，
    workInProgress = returnFiber;  //那么就返回至父节点
  } while (workInProgress !== null);

  //当执行到这里的时候，说明遍历到了 root 节点，已完成遍历
  if (workInProgressRootExitStatus === RootIncomplete) {  //更新workInProgressRootExitStatus的状态为「已完成」
    workInProgressRootExitStatus = RootCompleted;
  }
  return null;
}
```
解析：

① 整体上看是一个大的while循环：  
从当前节点开始，遍历到兄弟节点，当无兄弟节点时，返回至父节点，
再从父节点开始，遍历到兄弟节点，当无兄弟节点时，返回至父父节点，
可想而知，最终会返回至rootFiber节点

② 当整颗 fiber 树遍历完成后，更新  workInProgressRootExitStatus的状态为「已完成」

我们来看一下do...while内部的逻辑：  
(1) 如果该节点可正常执行的话

① 直接执行completeWork()方法，更新该节点（从fiber对象转变成真实的DOM节点）

② 如果可以启用ProfilerTimer的话，则执行startProfilerTimer()和stopProfilerTimerIfRunningAndRecordDelta()，用来记录fiber节点执行work的实际开始时间(actualStartTime)和work时长(actualDuration)

③ stopWorkTimer()的作用是停止work计时，不是很重要，可不看

④ resetChildExpirationTime的作用是更新该节点的work时长和获取优先级最高的子节点的expirationTime

⑤ 如果next存在，则表示该节点在这次更新完成后，产生了新的更新，那么就返回该next，并将其作为completeUnitOfWork()的参数，再次执行

⑥ 接下来这一段比较重要，是 Effect 链的赋值，Effect链是帮助父节点简单判断子节点是否有更新及更新顺序的

Effect 链最终会归在 root 节点上，root 节点上就记录了这个 fiber 树上所有需要更新的地方，然后根据 Effect 链进行更新，这是比较高效的。

⑦ else的情况就是执行更新的过程中捕获到error的情况，此时执行的是unwindWork而不是completeWork，与completeWork最大的区别是有ShouldCapture的判断，也是后续文章会讲到

else后面的逻辑跟上面大同小异了，不再赘述

之后是遍历兄弟节点，返回父节点，再次遍历，不再赘述

⑧ 可以看到，completeUnitOfWork主要做了三件事：  
(1) 执行completeWork，完成节点更新  
(2) 执行resetChildExpirationTime，获取优先级最高的childExpirationTime  
(3) 赋值Effect链  

# startProfilerTimer和stopProfilerTimerIfRunningAndRecordDelta
记录fiber节点执行work的实际开始时间(actualStartTime)和work时长

```js
// 启动分析器的timer，并赋值成当前时间
function startProfilerTimer(fiber: Fiber): void {
  // 如果不能启动分析器的timer，就return
  if (!enableProfilerTimer) {
    return;
  }
  // 分析器的开始时间
  profilerStartTime = now();
  // 如果fiber节点的实际开始时间<0的话，则赋值成当前时间
  if (((fiber.actualStartTime: any): number) < 0) {
    fiber.actualStartTime = now();
  }
}

// 记录分析器的timer的work时间，并停止timer
function stopProfilerTimerIfRunningAndRecordDelta(
  fiber: Fiber,
  overrideBaseTime: boolean,
): void {
  // 如果不能启动分析器的定时器的话，就return
  if (!enableProfilerTimer) {
    return;
  }
  // 如果分析器的开始时间>=0
  if (profilerStartTime >= 0) {
    // 获取运行的时间间隔
    const elapsedTime = now() - profilerStartTime;
    fiber.actualDuration += elapsedTime;  // 累计实际work时间间隔
    if (overrideBaseTime) {
      fiber.selfBaseDuration = elapsedTime;  // 记录时间间隔
    }
    profilerStartTime = -1;  // 上述操作完成后，将分析器的timer的开始时间重置为-1
  }
}
```
# resetChildExpirationTime
resetChildExpirationTime 这个方法就是找到当前节点的所有子节点，并且读取他的更新时间和他的子节点更新时间，找到其中非NoWork的最早过期时间，然后赋值给当前节点的
# childExpirationTime
```js
function resetChildExpirationTime(completedWork: Fiber) {  //更新该节点的 work 时长和获取优先级最高的子节点的 expirationTime
  if (
    renderExpirationTime !== Never &&
    completedWork.childExpirationTime === Never   //如果当前渲染的节点需要更新，但是子节点不需要更新的话，则 return
  ) {
    // The children of this component are hidden. Don't bubble their
    // expiration times.
    return;
  }

  let newChildExpirationTime = NoWork;
  if (enableProfilerTimer && (completedWork.mode & ProfileMode) !== NoMode) {
    let actualDuration = completedWork.actualDuration;  //获取当前节点的实际 work 时长
    let treeBaseDuration = completedWork.selfBaseDuration;  //获取 fiber 树的 work 时长

    // 当一个 fiber 节点被克隆后，它的实际 work 时长被重置为 0.    
    // 这个值只会在 fiber 自身上的 work 完成时被更新(顺利执行的话)    
    // 当 fiber 自身 work 完成后，将自身的实际 work 时长冒泡赋给父节点的实际 work 时长    
    // 如果 fiber 没有被克隆，即 work 未被完成的话，actualDuration 反映的是上次渲染的实际 work 时长    
    // 如果是这种情况的话，不应该冒泡赋给父节点    // React 通过比较 子指针 来判断 fiber 是否被克隆

    // 关于 alternate 的作用，请看：https://juejin.im/post/6844903919588474888    
    // 是否将 work 时间冒泡至父节点的依据是：    
    // (1) 该 fiber 节点是否是第一次渲染    
    // (2) 该 fiber 节点的子节点有更新
    const shouldBubbleActualDurations =
      completedWork.alternate === null ||
      completedWork.child !== completedWork.alternate.child;

    let child = completedWork.child;  // 获取当前节点的第一个子节点
    //当该子节点存在时，通过newChildExpirationTime来获取子节点、子子节点两者中优先级最高的那个expirationTime
    while (child !== null) {
      const childUpdateExpirationTime = child.expirationTime;  //获取该子节点的 expirationTime
      const childChildExpirationTime = child.childExpirationTime;  //获取该子节点的 child 的 expirationTime
      if (childUpdateExpirationTime > newChildExpirationTime) {  //如果子节点的优先级大于NoWork的话，则将newChild的 expirationTime 赋值为该子节点的 expirationTime
        newChildExpirationTime = childUpdateExpirationTime;
      }
      if (childChildExpirationTime > newChildExpirationTime) {  //子节点的 child 同上
        newChildExpirationTime = childChildExpirationTime;
      }
      if (shouldBubbleActualDurations) {
        actualDuration += child.actualDuration;   //累计子节点的 work 时长
      }
      treeBaseDuration += child.treeBaseDuration;  //累计 fiber 树的 work 时长
      child = child.sibling;  //移动到兄弟节点，重复上述过程
    }
    completedWork.actualDuration = actualDuration;  //更新 fiber 的 work 时长
    completedWork.treeBaseDuration = treeBaseDuration;  //更新 fiber 树的 work 时长
  } else { // 逻辑同上
    let child = completedWork.child;
    while (child !== null) {
      const childUpdateExpirationTime = child.expirationTime;
      const childChildExpirationTime = child.childExpirationTime;
      if (childUpdateExpirationTime > newChildExpirationTime) {
        newChildExpirationTime = childUpdateExpirationTime;
      }
      if (childChildExpirationTime > newChildExpirationTime) {
        newChildExpirationTime = childChildExpirationTime;
      }
      child = child.sibling;
    }
  }
  completedWork.childExpirationTime = newChildExpirationTime;
}
```
解析：  
(1) 将累计的子节点的work时长冒泡赋值到父节点的actualDuration上

(2) 循环遍历目标节点的子节点们，将子节点中优先级最高的expirationTime更新到目标及诶按的childExpirationTime上

childExpirationTime的作用: https://www.jianshu.com/p/55ab41ca4fcd

# completedWork
作用：节点的更新
```js
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  const newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ClassComponent:
    case HostRoot: 
    case HostComponent: 
    case HostText: 
    case ForwardRef:
    case SuspenseComponent:
    case Fragment:
    case Mode:
    case Profiler:
    case HostPortal:
    case ContextProvider:
    case ContextConsumer:
    case MemoComponent:
    case IncompleteClassComponent:
    case SuspenseListComponent:
    case FundamentalComponent: 
    case ScopeComponent: 
    default:
      invariant(
        false,
        'Unknown unit of work tag (%s). This error is likely caused by a bug in ' +
          'React. Please file an issue.',
        workInProgress.tag,
      );
  }
  return null;
}
```
current 指当前节点，第一次渲染时，current为null

# 参考文献
https://zhuanlan.zhihu.com/p/121717560



