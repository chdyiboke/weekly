# reconcileChildFibers之对象

## reconcileChildren
作用：进入diff算法
```js
function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderExpirationTime: ExpirationTime,
) {
  if (current === null) {  // 第一次渲染 如果是一个之前没有的fiber节点，进入if流程
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime,
    );
  } else {
    workInProgress.child = reconcileChildFibers(  // 更新节点，将子节点转换为fibernode
      workInProgress,
      current.child,
      nextChildren,
      renderExpirationTime,
    );
  }
}
```
解析：  
1.判断当前节点是否为null，如果是第一次渲染，current = null，则调用mountChildFibers，函数返回值赋值给workInProgress.child。  
2.current !== null，说明是更新节点，调用reconcileChildFibers(workInProgress，current.child，nextChilderen)，函数返回值赋值给workInProgress.child。  
mountChildFibers和reconcileChildFibers其实是同一个方法（ChildReconciler），初始化时传入了不同的参数shouldTrackSideEffects。前者传入false，后者传入true  
ChildReconciler最终返回reconcileChildFibers方法，根据shouldTrackSideEffects来决定是否跟踪副作用，第一次渲染时无副作用（sideEffect）的，所以shouldTrackSideEffects=false，多次渲染是有副作用的，所以shouldTrackSideEffects=true

## reconcileChildFibers
针对不同的节点，进行不同的节点操作（对象、文本、数组等）  
本次分享只讲针对对象、文本操作
```js
/**
   * diff流程实现
   * @param { 父fiber节点 } returnFiber
   * @param { 父fiber节点的第一个子节点 } currentFirstChild
   * @param { 即将更新的虚拟dom节点，只可能是字符串，ReactElement对象，数组其中之一 } newChild
   * @param { 超时时间，这里没用，不用关 } expirationTime
*/
function reconcileChildFibers(   // diff算法实现
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChild: any,
    expirationTime: ExpirationTime,
  ): Fiber | null {
    //在开发中写<div>{ arr.map((a,b)=>xxx) }</div>，这种节点称为 REACT_FRAGMENT_TYPE
    const isUnkeyedTopLevelFragment =
      typeof newChild === 'object' &&
      newChild !== null &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      newChild.key === null;
    //type 为REACT_FRAGMENT_TYPE是不需要任何更新的，直接渲染子节点即可
    if (isUnkeyedTopLevelFragment) {
      newChild = newChild.props.children;
    }
 
    const isObject = typeof newChild === 'object' && newChild !== null;
    if (isObject) {
      switch (newChild.$$typeof) {
        // ReactElement节点
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(   // 设置节点的effectTag 为 placement
            reconcileSingleElement(  // 根据element生成新的child fiber
              returnFiber,
              currentFirstChild,
              newChild,
              expirationTime,
            ),
          );
        case REACT_PORTAL_TYPE:
          return placeSingleChild(
            reconcileSinglePortal(
              returnFiber,
              currentFirstChild,
              newChild,
              expirationTime,
            ),
          );
      }
    }
     //文本节点
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(
        reconcileSingleTextNode(
          returnFiber,
          currentFirstChild,
          '' + newChild,
          expirationTime,
        ),
      );
    }
    //数组节点  省略下次分享
  }
```
解析：
* UnkeyedTopLevelFragment，开发中写<div>{ arr.map((a,b)=>xxx) }</div>，这种节点称为 REACT_FRAGMENT_TYPE，react会直接渲染它的子节点newChild = newChild.props.children;
* element type是object 即ClassComponent或FuntionComponent，共有两种情况REACT_ELEMENT_TYPE、REACT_PORTAL_TYPE（protal节点），REACT_ELEMENT_TYPE 的话，会执行reconcileSingleElement方法
* 文本节点执行reconcileSingleTextNode方法
* 数组类型省略

### 对象
流程：
![avatar](/img/diffObj.png)
```js
function reconcileSingleElement(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,  // 旧
    element: ReactElement,   // 新
    expirationTime: ExpirationTime,
  ): Fiber {
    const key = element.key;
    let child = currentFirstChild;
    while (child !== null) {   // 从当前已有的子节点找到可以复用的fiber对象，并删除他的兄弟节点
      if (child.key === key) {   // key相同
        if (  // 如果节点类型未改变的话
          child.tag === Fragment
            ? element.type === REACT_FRAGMENT_TYPE
            : child.elementType === element.type ||
              (__DEV__
                ? isCompatibleFamilyForHotReloading(child, element)
                : false)
        ) { // 复用 child，删除它的兄弟节点 因为旧节点它有兄弟节点，新节点只有它一个
          deleteRemainingChildren(returnFiber, child.sibling);
          const existing = useFiber(
            child,
            element.type === REACT_FRAGMENT_TYPE
              ? element.props.children
              : element.props,
            expirationTime,
          );
          // coerceRef 的作用是把规范化 ref，因为 ref 有三种形式，string ref 要转换成方法
          existing.ref = coerceRef(returnFiber, child, element);
          existing.return = returnFiber;
          return existing;
        } else {
          deleteRemainingChildren(returnFiber, child);
          break;
        }
      } else {
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }
 
    // 如果没有找到可复用的节点，则说明是新增，创建一个fiber节点，并挂载到父fiber上
    if (element.type === REACT_FRAGMENT_TYPE) {  // 判断element的类型是否为Fragment
      const created = createFiberFromFragment(   //创建Fragment类型的 fiber 节点
        element.props.children,
        returnFiber.mode,
        expirationTime,
        element.key,
      );
      created.return = returnFiber;
      return created;
    } else {
      const created = createFiberFromElement(    //创建Element类型的 fiber 节点
        element,
        returnFiber.mode,
        expirationTime,
      );
      created.ref = coerceRef(returnFiber, currentFirstChild, element);
      created.return = returnFiber;
      return created;
    }
  }
```

#### deleteRemainingChildren
作用：
如果旧节点存在，但是更新的节点是 null 的话，需要删除旧节点的内容
```js
  function deleteRemainingChildren(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
  ): null {
    //第一次渲染的情况
    //是没有子节点的，所以直接删除
    if (!shouldTrackSideEffects) {
      // Noop.
      return null;
    }

    // TODO: For the shouldClone case, this could be micro-optimized a bit by
    // assuming that after the first child we've already added everything.
    let childToDelete = currentFirstChild;  //从当前节点的第一个子节点开始，进行删除操作
    while (childToDelete !== null) {   //删除目标节点的所有子节点，并循环寻找兄弟节点,删除它们的子节点
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }
```

#### deleteChild
作用：
为要删除的子节点们做Deletion标记
```js
  function deleteChild(returnFiber: Fiber, childToDelete: Fiber): void {
    if (!shouldTrackSideEffects) {
      // Noop.
      return;
    }
    // Deletions are added in reversed order so we add it to the front.
    // At this point, the return fiber's effect list is empty except for
    // deletions, so we can just append the deletion to the list. The remaining
    // effects aren't added until the complete phase. Once we implement
    // resuming, this may not be true.
    // 不是真正的删除，把childToDelete加入到Effect,记录effect为Deletion
    const last = returnFiber.lastEffect;
    if (last !== null) { // 判断裢表是否存在
      // 把父节点上的所有需要更新的子节点通过裢表连接起来
      last.nextEffect = childToDelete;
      returnFiber.lastEffect = childToDelete;
    } else {
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }
    childToDelete.nextEffect = null;
    //这里并未执行删除操作，而仅仅是给effectTag赋值了Deletion
    //因为这里仍是对 fiber 树的更新，未涉及到真正的 DOM 节点
    //真正的删除留到 commit 阶段
    childToDelete.effectTag = Deletion;
  }
```
解析：
在 fiber 树上，循环每一个子节点，并做上 Deletion 标记，以便在commit 阶段进行真删除

#### useFiber
```js
function useFiber(
  fiber: Fiber,
  pendingProps: mixed,
  expirationTime: ExpirationTime,
): Fiber {
  const clone = createWorkInProgress(fiber, pendingProps, expirationTime);
  clone.index = 0;
  clone.sibling = null;
  return clone;
}
 
function createWorkInProgress(
  current: Fiber,
  pendingProps: any,
  expirationTime: ExpirationTime,
): Fiber {
  let workInProgress = current.alternate;
  if (workInProgress === null) { 
    // 如果 workInProgress 不存在，根据传入的 fiber 复制一份，并将各自的 alternate 属性指向对方；
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode,
    );
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
 
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {   // 如果已存在，重置 effectTag 和相关的指针（nextEffect、firstEffect、lastEffect）；
    workInProgress.pendingProps = pendingProps;
    // ...
  }
  return workInProgress;
}
```
useFiber 用于复用旧的 fiber 节点，重置了 index 和 sibling。怎么实现复用的呢，从 createWorkInProgress 可以看出，React 并没有直接将旧的 Fiber 节点返回给新的，因为此时旧的 Fiber 节点已经完成了渲染，对其进行直接操作会很危险，所以 useFiber 复用的节点其实是 alternate，对 alternate 的任何更新不会影响当前 Fiber， 而且 alternate 和 current 是互相引用的，互相作为对方的 alternate，能够一致被复用，效率很高，这个策略叫做 double buffer（双缓冲）。

#### coerceRef
coerceRef 功能： 检查 element.ref 并返回 ref 函数或者对象

如果是 string ref，则返回一个函数，返回的函数主要是把该 ref 挂载在 element 的 owner 实例的 refs 上 this.refs
如果是其他类型的 ref，则直接返回它

https://zhuanlan.zhihu.com/p/76636052

#### createFiberFromFragment

creactFiber()

#### reconcileSinglePortal
portal其实就是特殊的ReactElement，他的$$typeof不是REACT_ELEMENT_TYPE。但是他们的处理方式其实差不多，也都是循环老的children找能复用的，找不到就创建新的，只是创建Fiber的方法不一样。

### 文本（reconcileSingleTextNode）
```js
/**
  * textNode diff过程
  * @param { 父fiber节点 } returnFiber
  * @param { 父fiber节点的第一个子fiber，即当前层下第一个子节点 } currentFirstChild
  * @param { text文本内容 } textContent
  * @param { 超时时间，这里没有用到 } expirationTime
  */
 function reconcileSingleTextNode(
   returnFiber: Fiber,
   currentFirstChild: Fiber | null,
   textContent: string,
   expirationTime: ExpirationTime,
 ): Fiber {
 
   // 如果第一个子节点是textNode节点
   if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
 
     // 删除currentFirstChild的兄弟节点
     deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
 
     // 根据currentFirstChild创建一个workInprogress
     const existing = useFiber(currentFirstChild, textContent, expirationTime);
 
     // 将existing挂载到fiber树上,设置existing的父节点为returnFiber
     existing.return = returnFiber;
 
     // 返回新的fiber节点
     return existing;
   }
 
   // 如果currentFirstChild不是一个text节点，直接删除returnFiber的所有子节点
   deleteRemainingChildren(returnFiber, currentFirstChild);
 
   // 根据text重新创建一个fiber节点
   const created = createFiberFromText(
     textContent,
     returnFiber.mode,
     expirationTime,
   );
 
   // 将新创建的fiber节点挂载到fiber树上
   created.return = returnFiber;
 
   // 返回创建后的fiber节点
   return created;
 }
```
#### createFiberFromText
作用：
创建文本类型的 fiber,content 就是要更新的文本
```js
export function createFiberFromText(
  content: string,
  mode: TypeOfMode,
  expirationTime: ExpirationTime,
): Fiber {
  const fiber = createFiber(HostText, content, null, mode);
  fiber.expirationTime = expirationTime;
  return fiber;
}
```
