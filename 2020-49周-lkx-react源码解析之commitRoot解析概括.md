# commitRoot解析概括

## 引言
React 通过 workloop 已经将该 root 下的所有变更都计算了出来，接下来进入了 commit 阶段，这个阶段会真正的将变化映射到 dom 上，并且会执行一些生命周期函数，先看下代码了解整体流程。
```js
function performSyncWorkOnRoot(root) {
    if (workInProgress !== null) {
      // 省略 workloop 代码
      if (workInProgress !== null) {
        invariant(
          false,
          'Cannot commit an incomplete root. This error is likely caused by a ' +
            'bug in React. Please file an issue.',
        );
      } else {
        stopFinishedWorkLoopTimer();
        // 之前root上的所有变更都发生在root.current，alternate上
		// root.current 并没有发生变化，将变更好的赋给root.finishedWork
        root.finishedWork = (root.current.alternate: any);   
        root.finishedExpirationTime = expirationTime;        
        resolveLocksOnRoot(root, expirationTime);   // 有时候会延迟提交
        finishSyncRender(root, workInProgressRootExitStatus, expirationTime);
      }
      ensureRootIsScheduled(root);   // 退出之前，确保安排了下一个回调  设置performSyncWorkOnRoot回调.
    }
  }
  return null;
}
```
解析：

1. commit 阶段首先是对 finishedWork 和 finishedExpirationTime 做了赋值，比较重要的是根据 workInProgressRootExitStatus 这个标志位来进行不同的流程处理。

2. resolveLocksOnRoot方法判断是否有延迟，有延迟则赋值workInProgressRootExitStatus = RootLocked

3. 执行finishSyncRender方法，其中参数workInProgressRootExitStatus有不同的值，如下：

RootIncomplete：代表此时还存在未执行完成的 workInProgress  
RootErrored：是在 workloop 报错的时候，执行 throwException 时候赋值的，表示出现了错误。这个分支中，React 猜测了 Error 出现的可能性，第一是存在低优先级任务，第二是在异步模式下时间中的更新未执行完毕，对于这两种情况，尝试重新渲染，也就是重新执行 renderRoot 方法。如果还是错的，那就执行commitRoot 提交掉更新。  
RootSuspended：出现在渲染 SuspenseComponent 组件的时候  
RootSuspendedWithDelay：出现在渲染 SuspenseComponent 组件的时候  
RootCompleted：最常见的是 RootCompleted，表示之前的阶段都正常的执行完成  



## finishSyncRender

```js
function finishSyncRender(root, exitStatus, expirationTime) {
  if (exitStatus === RootLocked) {
    markRootSuspendedAtTime(root, expirationTime);
  } else {
    workInProgressRoot = null;
    commitRoot(root);
  }
}
```
判断exitStatus也就是workInProgressRootExitStatus是否为RootLocked，如果延迟则执行markRootSuspendedAtTime，否则执行commitRoot方法


## commitRoot
```js
function commitRoot(root) {
  // getCurrentPriorityLevel 表示获得当前执行优先级
  const renderPriorityLevel = getCurrentPriorityLevel();
  // 以指定的优选级执行函数 commitRootImpl 方法
  // ImmediatePriority 是最高优先级，表示立即执行 commitRootImpl 方法
  runWithPriority(
    ImmediatePriority,
    commitRootImpl.bind(null, root, renderPriorityLevel),
  );
  return null;
}
```

## getCurrentPriorityLevel

```js
export function getCurrentPriorityLevel(): ReactPriorityLevel {
  switch (Scheduler_getCurrentPriorityLevel()) {
    case Scheduler_ImmediatePriority:
      return ImmediatePriority;
    case Scheduler_UserBlockingPriority:
      return UserBlockingPriority;
    case Scheduler_NormalPriority:
      return NormalPriority;
    case Scheduler_LowPriority:
      return LowPriority;
    case Scheduler_IdlePriority:
      return IdlePriority;
    default:
      invariant(false, 'Unknown priority level.');
  }
}
```


## runWithPriority
```js
export function runWithPriority<T>(  // 先记录当前优先级，然后以指定的优先级执行函数，执行完毕会，恢复优先级。
  reactPriorityLevel: ReactPriorityLevel,
  fn: () => T,
): T {
  // reactPriorityToSchedulerPriority 是一个 switch case 函数，将 reactPriorityLevel 映射为 priorityLevel
  const priorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);  
  return Scheduler_runWithPriority(priorityLevel, fn);  // Scheduler_runWithPriority 就是 unstable_runWithPriority 方法的重命名 
}

function unstable_runWithPriority(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;

    default:
      priorityLevel = NormalPriority;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;  // 将当前的优先级替换为传入的优先级

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;  // 恢复现场
  }
}
```

commitRootImpl 方法较为复杂，它主要负责执行 effect 链上的更新，整个过程分为 before mutation，mutation 和 layout 三个阶段，每个阶段会执行不同的更新任务。当然，这个阶段有可能会产生新的更新，需要将这些更新重新调度。

## commitRootImpl
作用：  
根据effect链判断是否进行commit  
① 当执行commit时，进行「before mutation」、「mutation」和「layout」三个子阶段  
② 否则快速过掉commit阶段，走个 report 流程  

判断本次commit是否会产生新的更新，也就是脏作用，如果有脏作用则处理它

检查目标fiber是否有剩余的work要做  
① 如果有剩余的work的话，执行这些调度任务  
② 没有的话，说明也没有报错，清除「错误边界」  

(4) 刷新同步队列


```js
function commitRootImpl(root, renderPriorityLevel) {
  flushPassiveEffects();   // 清空副作用
  flushRenderPhaseStrictModeWarningsInDEV();

  invariant(
    (executionContext & (RenderContext | CommitContext)) === NoContext,
    'Should not already be working.',
  );

  const finishedWork = root.finishedWork;  // 获得 root 上的 finishedWork，这个就是前面调度更新的结果
  const expirationTime = root.finishedExpirationTime;
  if (finishedWork === null) {
    return null;
  }
  root.finishedWork = null;
  root.finishedExpirationTime = NoWork;  // 对 root 上的 finishedWork 和 expirationTime reset

  invariant(
    finishedWork !== root.current,
    'Cannot commit the same tree as before. This error is likely caused by ' +
      'a bug in React. Please file an issue.',
  );   // 避免一次更改重复提交
 
  root.callbackNode = null;  // commitRoot 是最后阶段，不会再被异步调用了，所以会清除 callback 相关的属性
  root.callbackExpirationTime = NoWork;
  root.callbackPriority = NoPriority;
  root.nextKnownPendingLevel = NoWork;

  startCommitTimer();

  // 下列代码用于更新 root.firstPendingTime 和 root.lastPendingTime
  const remainingExpirationTimeBeforeCommit = getRemainingExpirationTime(
    finishedWork,
  );
  markRootFinishedAtTime(
    root,
    expirationTime,
    remainingExpirationTimeBeforeCommit,
  );

  if (root === workInProgressRoot) {  // 清除一些 workloop 阶段用到的全局变量，因为接下来要提交这些更新了，这些全局变量用不到了
    workInProgressRoot = null;
    workInProgress = null;
    renderExpirationTime = NoWork;
  } else {
    // This indicates that the last root we worked on is not the same one that
    // we're committing now. This most commonly happens when a suspended root
    // times out.
  }

  // Get the list of effects.
  let firstEffect;  // 在 completeWork 的时候，我们组建了 effect 链，用于记录更新，这里拿到这个 effect 链。
  if (finishedWork.effectTag > PerformedWork) {  // 如果 root 节点本身也要更新的话，将其放到 effect 链的最后一个
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    firstEffect = finishedWork.firstEffect;
  }
  // 到此，完整的 effect 链组建完成，firstEffect 就是第一个需要被更新的 fiber 节点。
  if (firstEffect !== null) {
    const prevExecutionContext = executionContext;
    executionContext |= CommitContext;  // executionContext 增加一个 CommitContext，表示其实进入 Commit 阶段
    const prevInteractions = pushInteractions(root);

    ReactCurrentOwner.current = null;

    // 提交阶段分为几个子阶段。
    // 根据子阶段将 effect 链做了分隔，所有的 mutation(突变) effect 都在所有的 layout effect 之前

    // 第一个子阶段是 before mutation 阶段，在这个阶段 React 会读取 fiber 树的 state 状态，
    // 这个阶段主要是调用 getSnapshotBeforeUpdate 方法
    // ------------- before mutation 阶段开始  -----------------
    startCommitSnapshotEffectsTimer();
    prepareForCommit(root.containerInfo);
    nextEffect = firstEffect;
    do {
      if (__DEV__) {
        invokeGuardedCallback(null, commitBeforeMutationEffects, null);
        if (hasCaughtError()) {
          invariant(nextEffect !== null, 'Should be working on an effect.');
          const error = clearCaughtError();
          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      } else {
        try {
          commitBeforeMutationEffects();  // 调用 classComponent 上的生命周期方法 getSnapshotBeforeUpdate
        } catch (error) {
          invariant(nextEffect !== null, 'Should be working on an effect.');
          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);
    stopCommitSnapshotEffectsTimer();
    // ------------- before mutation 阶段结束  -----------------

    if (enableProfilerTimer) {
      recordCommitTime();
    }

    // ----------------  mutation 阶段开始  --------------------
    startCommitHostEffectsTimer();
    nextEffect = firstEffect;
    do {
      if (__DEV__) {
        invokeGuardedCallback(
          null,
          commitMutationEffects,
          null,
          root,
          renderPriorityLevel,
        );
        if (hasCaughtError()) {
          invariant(nextEffect !== null, 'Should be working on an effect.');
          const error = clearCaughtError();
          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      } else {
        try {
          commitMutationEffects(root, renderPriorityLevel);   // 提交HostComponent的 side effect，也就是 DOM 节点的操作(增删改)
        } catch (error) {
          invariant(nextEffect !== null, 'Should be working on an effect.');
          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);
    stopCommitHostEffectsTimer();
    // ----------------  mutation 阶段结束  --------------------
    resetAfterCommit(root.containerInfo);  // 恢复 commit 导致的丢失的值

    // 在之后要执行 componentDidMount/Update 生命周期函数了，必须把当前的 fiber 对象指向更新之后的
    root.current = finishedWork;  // 此时将 root.current 切换到 finishedWork

    // ----------------  layout 阶段开始  --------------------
    // 这个阶段会触发所有组件的生命周期(lifecycles)的提交
    startCommitLifeCyclesTimer();
    nextEffect = firstEffect;
    do {
      if (__DEV__) {
        invokeGuardedCallback(
          null,
          commitLayoutEffects,
          null,
          root,
          expirationTime,
        );
        if (hasCaughtError()) {
          invariant(nextEffect !== null, 'Should be working on an effect.');
          const error = clearCaughtError();
          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      } else {
        try {
          commitLayoutEffects(root, expirationTime);  // 触发生命周期函数
        } catch (error) {
          invariant(nextEffect !== null, 'Should be working on an effect.');
          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);
    stopCommitLifeCyclesTimer();
    // ----------------  layout 阶段结束  --------------------

    nextEffect = null;

    requestPaint();  //React 占用的资源已结束，告知浏览器可以去绘制 ui 了

    if (enableSchedulerTracing) {
      popInteractions(((prevInteractions: any): Set<Interaction>));
    }
    executionContext = prevExecutionContext;  // 恢复 executionContext
  } else {
    // No effects. // 没有更新
    root.current = finishedWork;
    // 走个 commit 流程
    startCommitSnapshotEffectsTimer();
    stopCommitSnapshotEffectsTimer();
    if (enableProfilerTimer) {
      recordCommitTime();
    }
    startCommitHostEffectsTimer();
    stopCommitHostEffectsTimer();
    startCommitLifeCyclesTimer();
    stopCommitLifeCyclesTimer();
  }

  // 标记 commit 阶段结束
  stopCommitTimer();
  // 本次 commit 是否有产生新的更新
  const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

  if (rootDoesHavePassiveEffects) {
    rootDoesHavePassiveEffects = false;
    // 如果存在新的更新，将 root 节点赋给 pendingPassiveEffectsExpirationTime
    rootWithPendingPassiveEffects = root;
    pendingPassiveEffectsExpirationTime = expirationTime;
    pendingPassiveEffectsRenderPriority = renderPriorityLevel;
  } else {
    // 如果没有产生新的更新的话，将 effect 链上的值清除，有利于 GC
    nextEffect = firstEffect;
    while (nextEffect !== null) {
      const nextNextEffect = nextEffect.nextEffect;
      nextEffect.nextEffect = null;
      nextEffect = nextNextEffect;
    }
  }

  const remainingExpirationTime = root.firstPendingTime;
  // root 节点还有未完成的 work
  if (remainingExpirationTime !== NoWork) {
    // 重新对 root 节点进行了一次调度
    if (enableSchedulerTracing) {
      if (spawnedWorkDuringRender !== null) {
        const expirationTimes = spawnedWorkDuringRender;
        spawnedWorkDuringRender = null;
        for (let i = 0; i < expirationTimes.length; i++) {
          scheduleInteractions(
            root,
            expirationTimes[i],
            root.memoizedInteractions,
          );
        }
      }
      schedulePendingInteractions(root, remainingExpirationTime);
    }
  } else {
    legacyErrorBoundariesThatAlreadyFailed = null;
  }

  if (enableSchedulerTracing) {
    if (!rootDidHavePassiveEffects) {
      finishPendingInteractions(root, expirationTime);
    }
  }

  // 剩余的 work 是同步任务的话
  if (remainingExpirationTime === Sync) {
    // 计算同步 re-render 重新渲染的次数，判断是否是无限循环
    if (root === rootWithNestedUpdates) {
      nestedUpdateCount++;
    } else {
      nestedUpdateCount = 0;
      rootWithNestedUpdates = root;
    }
  } else {
    nestedUpdateCount = 0;
  }

  onCommitRoot(finishedWork.stateNode, expirationTime);

  ensureRootIsScheduled(root);

  // 如果捕获到错误的话，就 throw error
  if (hasUncaughtError) {
    hasUncaughtError = false;
    const error = firstUncaughtError;
    firstUncaughtError = null;
    throw error;
  }

  if ((executionContext & LegacyUnbatchedContext) !== NoContext) {
    return null;
  }

  // 刷新同步任务队列
  flushSyncCallbackQueue();
  return null;
}
```
按源码顺序,看下commitRootImpl()做了些什么：

(1) 执行flushPassiveEffects()，清除脏作用

(2) 根据目标节点的更新优先级expirationTime和子节点的更新优先级childExpirationTime，来比较获取优先级最高的expirationTime，借此来判断是否所有render阶段的work都已完成。

(3) 判断目标 fiber自身是否也需要 commit，需要的话，则进行链表操作，把它的finishedWork放effect链的最后——lastEffect.nextEffect上

(4) 如果firstEffect不为 null 的话，说明有提交任务，则进行三个子阶段
① 第一个子阶段「before mutation」

执行commitBeforeMutationEffects()，本质是调用classComponent上的生命周期方法——getSnapshotBeforeUpdate()

② 第二个子阶段「mutation」
执行commitMutationEffects()，作用是：提交HostComponent的side effect，也就是DOM 节点的操作(增删改)

③ 第三个子阶段「layout」
执行commitLayoutEffects()，作用是：触发组件生命周期的api

(5) 如果firstEffect为 null 的话，说明effect链没有需要更新的fiber对象，那么就快速过掉 commit阶段，走个 report 流程

所以会看到三组startCommitXXXTimer()、endCommitXXXTimer()

(6) 至此，commit 基本结束了，但是 commit 阶段可能也会产生新的 work，即remainingExpirationTime

当有剩余的 work 的话，循环它们，依次执行scheduleInteractions()，排到调度任务中去，并通过scheduleCallbackForRoot()去执行它们 








