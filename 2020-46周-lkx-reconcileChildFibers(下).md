# reconcileChildFibers之数组


## 数组diff算法
首先我们遍历虚拟dom节点，找出旧的fiber链表中能直接复用的fiber节点，并构建成一个新的fiber链表

当循环结束或跳出后存在三种情况：虚拟dom数组被遍历完成，旧fiber链表遍历完成，旧fiber链表和虚拟dom数组对应不上跳出循环

1. 如果虚拟dom数组遍历完成，则从父节点中删除剩余节点，并返回新的fiber节点链表的第一个节点。

2. 如果旧fiber链表遍历完成，但是新的虚拟dom数组未被遍历完成，说明有新增的虚拟dom节点，我们就为新的虚拟dom创建对应的fiber节点，并挂载到新的子fiber链表上：

3. 如果虚拟dom数组和旧fiber链表无法匹配上跳出循环，则我们尝试从剩余的旧fiber链表中找出能够复用的fiber节点。

首先React会通过mapRemainingChildren方法把旧fiber节点中未被复用的fiber节点组成一个Map对象，用fiber节点的key或index作为在Map中存储的key

构造完成Map对象后，从之前中断的位置继续遍历虚拟dom数组，通过updateFromMap查找可复用的fiber节点，最后删除Map对象中没有被复用的fiber节点。至此一层diff过程结束，react继续进入下一层的workLoop。

## reconcileChildrenArray
```js
function reconcileChildrenArray(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChildren: Array<*>,
    expirationTime: ExpirationTime,
  ): Fiber | null {
    let resultingFirstChild: Fiber | null = null;   // 更新后的fiber节点链表起始位置
    let previousNewFiber: Fiber | null = null;   // 上一个被添加到更新后的fiber链表中的fiber节点，即新fiber链表的尾节点
 
    let oldFiber = currentFirstChild;  // 旧fiber链表起始位置
    let lastPlacedIndex = 0;  // fiber节点被安放的位置
    let newIdx = 0;   // 新虚拟dom数组遍历的位置，在跳出循环后用于判断虚拟dom数组是否全部被遍历
    let nextOldFiber = null;
    // 遍历新的虚拟dom数组
    // oldFiber是子fiber链表起始位置，即父fiber节点中的第一个子fiber节点
    // 跳出循环的条件是，在遍历新老数组的过程中,找到第一个不能复用的节点
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      // oldIndex 大于 newIndex，那么需要旧的 fiber 等待新的 fiber，一直等到位置相同
      if (oldFiber.index > newIdx) {
        // 下一个比较的 fiber 还是 oldFiber
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {  //否则，则处理该节点的下一个兄弟节点
        nextOldFiber = oldFiber.sibling;
      }
      // updateSlot方法会比较新旧节点，判断fiber节点是否可被复用
      // 如果可以复用则返回更新后的fiber节点
      // 如果不能被复用，则返回null
      const newFiber = updateSlot(
        returnFiber,
        oldFiber,
        newChildren[newIdx],
        expirationTime,
      );
      if (newFiber === null) {  // key不相同，newFiber为null，则说明oldFiber无法被复用
        // 当fiber节点无法被复用后直接跳出循环
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }
        break;
      }
 
      // 到这里表示 oldFiber 和 newFiber 有相同的 key,是可以复用的
 
      if (shouldTrackSideEffects) {
        //oldFiber节点存在，但是newFiber是新创建的，说明oldFiber没有被复用
        if (oldFiber && newFiber.alternate === null) {
          // 将oldFiber添加到returnFiber的EffectList中
          // 并标记oldFiber的effectTag = Deletion
          deleteChild(returnFiber, oldFiber);
        }
      }
      // 根据lastPlacedIndex判断newFiber是移动，插入还是保持原位
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      // 构建新fiber链表
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      // 新fiber链表尾节点后移
      previousNewFiber = newFiber;
      // 旧fiber链表指针后移
      oldFiber = nextOldFiber;
    }
 
    // 表示虚拟dom数组遍历完成
    if (newIdx === newChildren.length) {
      deleteRemainingChildren(returnFiber, oldFiber);  // 从父fiber节点上删除剩余的子fiber节点
      return resultingFirstChild;  // 返回新的子fiber节点链表
    }
 
    // 旧fiber链表遍历完成，虚拟dom数组没有遍历完成，说明在旧的节点基础上有新增
    if (oldFiber === null) {
      // 未被遍历的虚拟dom都是新增
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(
          returnFiber,
          newChildren[newIdx],
          expirationTime,
        );
        if (newFiber === null) {
          continue;
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
      // 返回新的子fiber链表
      return resultingFirstChild;
    }
 
    // 虚拟dom数组和旧fiber裢表无法匹配上跳出需循环，尝试从剩余的旧fiber裢表中找出能够复用的fiber节点
    // 剩余未被匹配的旧fiber节点构成一个Map对象
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
 
    // 从中断的位置继续遍历虚拟dom数组
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        newChildren[newIdx],
        expirationTime,
      );
      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          if (newFiber.alternate !== null) {
            existingChildren.delete(
              newFiber.key === null ? newIdx : newFiber.key,
            );
          }
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
    }
 
    if (shouldTrackSideEffects) {
      existingChildren.forEach(child => deleteChild(returnFiber, child));
    }
 
    //  返回新的子fiber链表
    return resultingFirstChild;
  }
```
(1) 循环数组节点，在循环中主要做了如下几点：

① 将 oldFiber 的 index与 newIdx 进行比较:

* 如果 oldFIber.index 大，则将 oldFiber 赋值给 nextOldFiber（表示需要处理）；
* 如果 newIdx 大，则将 oldFiber.sibling 赋值给 nextOldFiber

② 执行updateSlot()，复用或新建节点，返回的结果赋值给newFiber

③ 如果newFiber的值为空的话，说明该节点不能复用，则跳出循环（break）

④ 如果是第一次渲染（即shouldTrackSideEffects为 true），并且 newFiber 没有要复用的 oldFiber 的话，则删除该 fiber 下的所有子节点

⑤ 执行placeChild()，将 newFiber 节点挂载到 DOM 树上，并判断更新后是否移动过，如果移动，则需要重新挂载，返回最新移动的 index，并赋值给lastPlacedIndex

⑥ previousNewFiber那段，意思是为数组里的每一个 fiber 节点设置 sibling 属性，即它旁边的 fiber（index+1）

(2) 跳出循环后，如果newIdx和更新的数组长度相等，则表示所有节点都是可以复用的，那么就执行deleteRemainingChildren()，删除旧节点

(3) 如果旧节点都已经被复用完了，但是仍有部分新节点需要被创建的话，则循环剩余数组的长度，并依次创建新节点（部分代码与上面重复，不再赘述）

(4) 如果仍有旧节点剩余的话，则执行mapRemainingChildren()，将这些旧节点用 Map 结构集合起来，看有没有方便 newFiber 复用的节点

(5) 继续遍历剩下的 new 节点

① 执行updateFromMap()，查找有没有 key/index 相同的点，方便复用

② if (newFiber !== null)的部分逻辑与上面相同，不再赘述

(6) 如果是第一次渲染的话，则删除没有复用的节点

(7) 最终返回 更新后的数组的第一个节点（根据它的 silbing 属性，可找到其他节点）

## updateSlot
```js
function updateSlot(
  returnFiber: Fiber,
  oldFiber: Fiber | null,
  newChild: any,
  expirationTime: ExpirationTime,
): Fiber | null {
  // 拿到 oldFiber 上的 key 值
  const key = oldFiber !== null ? oldFiber.key : null;
  // newChild 是文字节点 文本节点是没有 key 的
  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // oldFiber 如果有 key，说明是从 ReactElement 节点转变为文本节点了
    if (key !== null) {
      return null;
    }
    // 更新文本节点
    return updateTextNode(
      returnFiber,
      oldFiber,
      '' + newChild,
      expirationTime,
    );
  }
  // 如果新节点是对象
  if (typeof newChild === 'object' && newChild !== null) {
    // 根据 $$typeof 判断是 REACT_ELEMENT_TYPE 还是 REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE: {
        // 如果有相同的key
        if (newChild.key === key) {
          // 如果是 REACT_FRAGMENT_TYPE
          if (newChild.type === REACT_FRAGMENT_TYPE) {
            return updateFragment(
              returnFiber,
              oldFiber,
              newChild.props.children,
              expirationTime,
              key,
            );
          }
 
          // 复用 oldFiber 生成新的 fiber
          return updateElement(
            returnFiber,
            oldFiber,
            newChild,
            expirationTime,
          );
        } else {
          return null;
        }
      }
      case REACT_PORTAL_TYPE: {
        if (newChild.key === key) {
          return updatePortal(
            returnFiber,
            oldFiber,
            newChild,
            expirationTime,
          );
        } else {
          return null;
        }
      }
    }
    // 如果是数组，则作为fragment来处理
    // 这也就解释了问什么 reconcileChildFibers 中最开始要处理 Fragment
    if (isArray(newChild) || getIteratorFn(newChild)) {
      if (key !== null) {
        return null;
      }
      return updateFragment(
        returnFiber,
        oldFiber,
        newChild,
        expirationTime,
        null,
      );
    }
    throwOnInvalidObjectType(returnFiber, newChild);
  }
  return null;
}
```
updateSlot方法会比较新旧节点，判断fiber节点是否可被复用  
如果可以复用则返回更新后的fiber节点  
如果不能被复用，则返回null  

(1) 如果是文本节点的话，是不能根据 key 去判断是否复用的，注意下

(2) 如果是其他节点类型的话，则执行相应的函数，来进行节点更新（key 相同则复用）

## placeChild

将 newFiber 节点挂载到 DOM 树上，并判断更新后是否移动过，如果移动，则需要重新挂载，返回最新移动的 index
```js
function placeChild(
  newFiber: Fiber,
  lastPlacedIndex: number,
  newIndex: number,
): number {
  newFiber.index = newIndex;  // index 置为 newIndex
  if (!shouldTrackSideEffects) {  //  如果不是初次渲染的话（shouldTrackSideEffects 为 true），无需更新
    // Noop.
    return lastPlacedIndex;
  }
  const current = newFiber.alternate;
  if (current !== null) {  // current !== null 说明该节点渲染过
    const oldIndex = current.index; 
    // 移动了的节点
    if (oldIndex < lastPlacedIndex) {
      // This is a move.
      newFiber.effectTag = Placement;  // 重新挂载 DOM
      return lastPlacedIndex;
    } else {
      // 没有移动
      // This item can stay in place.
      return oldIndex;
    }
  } else { // current 为 null 说明该节点没有被渲染过
    // This is an insertion.
    // 所以是新插入的节点
    // This is an insertion.
    newFiber.effectTag = Placement;
    return lastPlacedIndex;
  }
}
```
placeChild 代码理解起来比较复杂。lastPlacedIndex 可以认为是一个记录 newIndex 和 oldIndex 最大索引值，所有小于这个最大值的节点，都需要加一个 Placement 标记。

举例说明：

01 02 03 --> 01 03 02

第一位是不用动的，由于第一位的索引都是 0，lastPlacedIndex 的值是 0，执行到第二位的时候，首先判断 03 的原先的索引值是否小于 lastPlacedIndex， 03 的索引原先是 2，不满足这个条件，接着更新 lastPlacedIndex 的值， 现在的索引是 1，更新 lastPlacedIndex 为两者中的大值，也就是 2，现在执行到第三位，02 的原先的索引是 1，小于 lastPlacedIndex，满足条件，02 节点增加一个 Placement 标记。

简单的记忆的话，可以认为 React 需要重新渲染的节点的就是从旧节点从前到后调整，注意，只能从前到后移动。

再举个例子：

01 02 03 04 05 --> 05 04 03 02 01

根据我们总结的方法，需要移动的是 01 02 03 04，他们需要移动到 05 后面，所以 01 02 03 04 增加了 Placement 标记。

## mapRemainingChildren
作用：
将旧节点用 Map 结构集合起来，方便 newFiber 复用
```js
function mapRemainingChildren(
   returnFiber: Fiber,
   currentFirstChild: Fiber,
 ): Map<string | number, Fiber> {
   const existingChildren: Map<string | number, Fiber> = new Map();
 
   let existingChild = currentFirstChild;
   while (existingChild !== null) {
     // 如果fiber.key存在，则用fiber.key作为Map中存储的key
     // 如果fiber.key不存在，则使用fiber.inde作为存储的key
     if (existingChild.key !== null) {
       existingChildren.set(existingChild.key, existingChild);
     } else {
       existingChildren.set(existingChild.index, existingChild);
     }
     existingChild = existingChild.sibling;
   }
   // 返回Map对象
   return existingChildren;  //创建了一个 Map 对象，以便找到key 相同的节点，方便复用
 }
```
利用 Map 结构，遍历剩下的 oldFiber，以key-value的形式，将这些旧节点存到 Map 中，如果没有key的话，则说明是文本节点，则以index-value的形式存储，最终返回这个 Map 对象

## updateFromMap

updateFromMap 和 updateSlot 的逻辑差不多，唯一不同的就是，对于新节点没有 key 的，会用 newIdx 作为索引从 existingChildren 这个 map 中获得对象，然后比较。

## 总结
reconcileChildrenArray 比较数组的方法很简单，首先逐个对比(相同位置对比)两个数组，如果相等则继续，如果有任何一个不等，那么跳出循环。如果老的数组全部被复用，那么补齐新数组，如果新数组已经完成，那么删除老数组中多余的部分。如果新数组没有完全生成，老数组也没有完全复用，那么创建一个 map，用于存放未被复用的老数组，然后遍历剩余的新数组，检查是否能从老数组中得到可复用的部分，有则复用，没有则新建。最后老的没有匹配到的都要删除。  
例子：  
![avatar](https://picb.zhimg.com/80/v2-306c0da3e9af0148830b9aa4b64abc5b_1440w.jpg)  
我在例子中使用了相同的方格来示新旧的数组，其实它们是完全不一样的，老的 children 是 Fiber 对象组成的链，新的childern 是React Element组成的 array。reconcileChildrenArray 目的就是复用老的 children 的 Fiber 链。但是，新的 Fiber 链不是直接复用老的 Fiber 链，而是复用了 fiber.alternate。这种双缓存策略使得 fiber 对象可以一直被交替使用。
