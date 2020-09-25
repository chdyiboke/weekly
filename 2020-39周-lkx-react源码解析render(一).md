# react源码render解析

## React更新的方式
* ReactDOM.render（）|| hydrate（ReactDOMServer渲染）
* setState
* forceUpdate

接下来，我们就来看下ReactDOM.render()源码
```js
ReactDOM.render（element，container [，回调]）
const ReactDOM: Object = {
  ...
  /**
   * 服务端渲染
   * @param element 表示一个ReactNode，可以是一个ReactElement对象
   * @param container 需要将组件挂载到页面中的DOM容器
   * @param callback 渲染完成后需要执行的回调函数
   */
  hydrate(element: React$Node, container: DOMContainer, callback: ?Function) {
    invariant(
      isValidContainer(container),
      'Target container is not a DOM element.',
    );
    ...
    // TODO: throw or warn if we couldn't hydrate?
    // 注意第一个参数为null，第四个参数为true
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      true,
      callback,
    );
  },

  /**
   * 客户端渲染
   * @param element 表示一个ReactElement对象
   * @param container 需要将组件挂载到页面中的DOM容器
   * @param callback 渲染完成后需要执行的回调函数
   */
  render(
    element: React$Element<any>,
    container: DOMContainer,
    callback: ?Function,
  ) {
    invariant(
      isValidContainer(container),
      'Target container is not a DOM element.',
    );
    ...
    // 注意第一个参数为null，第四个参数为false
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback,
    );
  },
  ...
};
```
ReactElement即creatElement返回的对象实例，接下来在render方法中调用legacyRenderSubtreeIntoContainer来正式进入渲染流程。

需要注意的：render方法和hydrate方法在执行legacyRenderSubtreeIntoContainer时，第一个参数的值均为null，第四个参数的值恰好相反。

## legacyRenderSubtreeIntoContainer
```js
/**
 * 开始构建FiberRoot和RootFiber，之后开始执行更新任务
 * @param parentComponent 父组件，可以把它当成null值来处理
 * @param children ReactDOM.render()或者ReactDOM.hydrate()中的第一个参数，可以理解为根组件
 * @param container ReactDOM.render()或者ReactDOM.hydrate()中的第二个参数，组件需要挂载的DOM容器
 * @param forceHydrate 表示是否融合，用于区分客户端渲染和服务端渲染，render方法传false，hydrate方法传true
 * @param callback ReactDOM.render()或者ReactDOM.hydrate()中的第三个参数，组件渲染完成后需要执行的回调函数
 * @returns {*}
 */
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: DOMContainer,
  forceHydrate: boolean,    // 是否服务端渲染， false则不是
  callback: ?Function,
) {

  // render中一般渲染的是DOM标签，所以不会有_reactRootContainer存在
  let root: _ReactSyncRoot = (container._reactRootContainer: any);    // 所以第一次渲染，root是不存在的
  let fiberRoot;
  if (!root) {
    // 初次渲染  创建一个ReactRooter
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {   // 判断是否有callback
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);          //根据fiberRoot获取公共Root实例 就是fiberRoot.current.child.stateNode
        originalCallback.call(instance);   //通过该实例instance 去调用originalCallback方法
      };
    }

    // 对于首次挂载来说，更新操作不应该是批量的，所以会先执行unbatchedUpdates方法
    // 该方法中会将executionContext(执行上下文)切换成LegacyUnbatchedContext(非批量上下文)
    // 切换上下文之后再调用updateContainer执行更新操作
    // 执行完updateContainer之后再将executionContext恢复到之前的状态，具体后续描述
    unbatchedUpdates(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
	// 不是首次挂载，即container._reactRootContainer上已经存在一个ReactSyncRoot实例
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
	// 对于非首次挂载来说，是不需要再调用unbatchedUpdates方法的
    // 即不再需要将executionContext(执行上下文)切换成LegacyUnbatchedContext(非批量上下文)
    // 而是直接调用updateContainer执行更新操作
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);   // 返回公开的Root实例
}
```
解析：
* 第一次渲染更新，所以root是null，只看！root的情况,
* legacyCreateRootFromDOMContainer(container,false)的作用是创造ReactRooter,
* updateContainer()的作用是更新container，稍后讲解

## legacyCreateRootFromDOMContainer
```js
/**
 * 创建并返回一个ReactSyncRoot实例
 * @param container ReactDOM.render()或者ReactDOM.hydrate()中的第二个参数，组件需要挂载的DOM容器
 * @param forceHydrate 是否需要强制融合，render方法传false，hydrate方法传true
 * @returns {ReactSyncRoot}
 */
function legacyCreateRootFromDOMContainer(   // 创建一个reactRooter
  container: DOMContainer,
  forceHydrate: boolean,
): _ReactSyncRoot {
  const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container);   // 判断是否为服务端渲染调，双重判断 用shouldHydrateDueToLegacyHeuristic方法来判断是否是服务端渲染 
  if (!shouldHydrate) {   // 不是服务器渲染
    let warned = false;
    let rootSibling;
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling);  //循环删除子节点，为什么要删除？因为React认为这些节点是不需要复用的
    }
  }

  // 返回一个ReactSyncRoot实例
  // 该实例具有一个_internalRoot属性指向fiberRoot
  return new ReactSyncRoot(
    container, 
    LegacyRoot,  // LegacyRoot 是一个常量，代表的是传统的同步的渲染方式。  也是fiber节点的tag标记，标记不同的组件类型
    shouldHydrate 
      ? {
          hydrate: true,
        }
      : undefined,
  );
}

/**
 * 根据nodeType和attribute判断是否需要融合
 * @param container DOM容器
 * @returns {boolean}
 */
function shouldHydrateDueToLegacyHeuristic(container) {
  const rootElement = getReactRootElementInContainer(container);   // 获取container的第一个节点（跟节点） id=root
  return !!(
    rootElement &&
    rootElement.nodeType === ELEMENT_NODE &&
    rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME)   // 判断是否服务端渲染，服务端渲染的话，会在React App的第一个元素上添加该属性
  );
}

/**
 * 根据container来获取DOM容器中的第一个子节点
 * @param container DOM容器
 * @returns {*}
 */
function getReactRootElementInContainer(container: any) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOCUMENT_NODE) {  //DOCUMENT_NODE 即 window.document
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}
```
其中在shouldHydrateDueToLegacyHeuristic方法中，首先根据container来获取DOM容器中的第一个子节点，获取该子节点的目的在于通过节点的nodeType和是否具有ROOT_ATTRIBUTE_NAME属性来区分是客户端渲染还是服务端渲染，在客户端渲染中是没有data-reactroot属性的，因此就可以区分出客户端渲染和服务端渲染。

## ReactSyncRoot
```js
/**
 * ReactSyncRoot构造函数
 * @param container DOM容器
 * @param tag fiberRoot节点的标记(LegacyRoot、BatchedRoot、ConcurrentRoot)
 * @param options 配置信息，只有在hydrate时才有值，否则为undefined
 * @constructor
 */
function ReactSyncRoot(
  container: DOMContainer,
  tag: RootTag,   //fiberRoot节点的标记(LegacyRoot、BatchedRoot、ConcurrentRoot)
  options: void | RootOptions,   //配置信息，只有在hydrate时才有值，否则为undefined
) {
  this._internalRoot = createRootImpl(container, tag, options);  // 创建并返回一个fiberRoot
}
```
## createRootImpl
```js
/**
 * 创建并返回一个fiberRoot
 * @param container DOM容器
 * @param tag fiberRoot节点的标记(LegacyRoot、BatchedRoot、ConcurrentRoot)
 * @param options 配置信息，只有在hydrate时才有值，否则为undefined
 * @returns {*}
 */
function createRootImpl(
  container: DOMContainer,
  tag: RootTag,
  options: void | RootOptions,
) {
  const hydrate = options != null && options.hydrate === true;
  const hydrationCallbacks =
    (options != null && options.hydrationOptions) || null;
  const root = createContainer(container, tag, hydrate, hydrationCallbacks);    // 创建一个fiberRoot
  markContainerAsRoot(root.current, container);   // 给container附加一个内部属性用于指向fiberRoot的current属性对应的rootFiber节点
  if (hydrate && tag !== LegacyRoot) {
    const doc =
      container.nodeType === DOCUMENT_NODE
        ? container
        : container.ownerDocument;
    eagerlyTrapReplayableEvents(doc);
  }
  return root;
}

/**
 * 内部调用createFiberRoot方法返回一个fiberRoot实例
 * @param containerInfo DOM容器
 * @param tag fiberRoot节点的标记(LegacyRoot、BatchedRoot、ConcurrentRoot)
 * @param hydrate 判断是否是hydrate模式
 * @param hydrationCallbacks 只有在hydrate模式时才可能有值，该对象包含两个可选的方法：onHydrated和onDeleted
 * @returns {FiberRoot}
 */
export function createContainer(
  containerInfo: Container,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): OpaqueRoot {
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
}

export function markContainerAsRoot(hostRoot, node) {
	node[internalContainerInstanceKey] = hostRoot;
}
```

## createFiberRoot
```js
/**
 * 创建fiberRoot和rootFiber并相互引用
 * @param containerInfo DOM容器
 * @param tag fiberRoot节点的标记(LegacyRoot、BatchedRoot、ConcurrentRoot)
 * @param hydrate 判断是否是hydrate模式
 * @param hydrationCallbacks 只有在hydrate模式时才可能有值，该对象包含两个可选的方法：onHydrated和onDeleted
 * @returns {FiberRoot}
 */
export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): FiberRoot {
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);   // 通过FiberRootNode构造函数创建一个fiberRoot实例
  if (enableSuspenseCallback) {
    root.hydrationCallbacks = hydrationCallbacks;
  }

  const uninitializedFiber = createHostRootFiber(tag); // 通过createHostRootFiber方法创建fiber tree的根节点，即rootFiber
  root.current = uninitializedFiber;     // 创建完rootFiber之后，会将fiberRoot实例的current属性指向刚创建的rootFiber
  uninitializedFiber.stateNode = root;  // 同时rootFiber的stateNode属性会指向fiberRoot实例，形成相互引用

  return root;   // 返回fiberRooot
}

/**
 *  FiberRootNode构造函数
 * @param containerInfo DOM容器
 * @param tag fiberRoot节点的标记(LegacyRoot、BatchedRoot、ConcurrentRoot)
 * @param hydrate 判断是否是hydrate模式
 * @constructor
 */
function FiberRootNode(containerInfo, tag, hydrate) {
  // 用于标记fiberRoot的类型
  this.tag = tag;
  // 指向当前激活的与之对应的rootFiber节点
  this.current = null;
  // 和fiberRoot关联的DOM容器的相关信息
  this.containerInfo = containerInfo;
  ...
  // 当前的fiberRoot是否处于hydrate模式
  this.hydrate = hydrate;
  ...
  // 每个fiberRoot实例上都只会维护一个任务，该任务保存在callbackNode属性中
  this.callbackNode = null;
  // 当前任务的优先级
  this.callbackPriority = NoPriority;
  ...
}
```


## createHostRootFiber
```js
export function createHostRootFiber(tag: RootTag): Fiber {
  let mode; //根据fiberRoot的标记类型来动态设置rootFiber的mode属性
  if (tag === ConcurrentRoot) {
    mode = ConcurrentMode | BatchedMode | StrictMode;
  } else if (tag === BatchedRoot) {
    mode = BatchedMode | StrictMode;
  } else {
    mode = NoMode;
  }
 
  if (enableProfilerTimer && isDevToolsPresent) {   // 收集Profiler子树的高级计时指标。
    mode |= ProfileMode;
  }

  return createFiber(HostRoot, null, null, mode); // 创建并返回一个fibernode实例
}

const createFiber = function(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
): Fiber {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  // FiberNode构造函数用于创建一个FiberNode实例，即一个fiber节点
  return new FiberNode(tag, pendingProps, key, mode);
};

/**
 * FiberNode构造函数
 * @param tag 用于标记fiber节点的类型
 * @param pendingProps 表示待处理的props数据
 * @param key 用于唯一标识一个fiber节点(特别在一些列表数据结构中，一般会要求为每个DOM节点或组件加上额外的key属性，在后续的调和阶段会派上用场)
 * @param mode 表示fiber节点的模式
 * @constructor
 */
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Instance
  // 用于标记fiber节点的类型
  this.tag = tag;
  // 用于唯一标识一个fiber节点
  this.key = key;
  ...
  // 对于rootFiber节点而言，stateNode属性指向对应的fiberRoot节点
  // 对于child fiber节点而言，stateNode属性指向对应的组件实例
  this.stateNode = null;

  // Fiber
  // 以下属性创建单链表树结构
  // return属性始终指向父节点
  // child属性始终指向第一个子节点
  // sibling属性始终指向第一个兄弟节点
  this.return = null;
  this.child = null;
  this.sibling = null;
  // index属性表示当前fiber节点的索引
  this.index = 0;
  ...

  // 表示待处理的props数据
  this.pendingProps = pendingProps;
  // 表示之前已经存储的props数据
  this.memoizedProps = null;
  // 表示更新队列
  // 例如在常见的setState操作中
  // 其实会先将需要更新的数据存放到这里的updateQueue队列中用于后续调度
  this.updateQueue = null;
  // 表示之前已经存储的state数据
  this.memoizedState = null;
  ...

  // 表示fiber节点的模式
  this.mode = mode;

  // 表示当前更新任务的过期时间，即在该时间之后更新任务将会被完成
  this.expirationTime = NoWork;
  // 表示当前fiber节点的子fiber节点中具有最高优先级的任务的过期时间markContainerAsRoot
  // 该属性的值会根据子fiber节点中的任务优先级进行动态调整
  this.childExpirationTime = NoWork;

  // 用于指向另一个fiber节点
  // 这两个fiber节点使用alternate属性相互引用，形成双缓冲
  // alternate属性指向的fiber节点在任务调度中又称为workInProgress节点
  this.alternate = null;
  ...
}
```

## unbatchedUpdates
```js
unbatchedUpdates(() => {
   updateContainer(children, fiberRoot, parentComponent, callback);
});
```
多个 setState 一起执行，并不会触发 React 的多次渲染。这是因为内部会将这个三次 setState 优化为一次更新，术语是批量更新（batchedUpdate）。

对于 root 来说其实没必要去批量更新，所以这里调用了 unbatchedUpdates 函数来告知内部不需要批量更新。


```js
export function unbatchedUpdates<A, R>(fn: (a: A) => R, a: A): R {
  // type ExecutionContext = number;
  // const NoContext = /*                    */ 0b000000;
  // const BatchedContext = /*               */ 0b000001;
  // const EventContext = /*                 */ 0b000010;
  // const DiscreteEventContext = /*         */ 0b000100;
  // const LegacyUnbatchedContext = /*       */ 0b001000;
  // const RenderContext = /*                */ 0b010000;
  // const CommitContext = /*                */ 0b100000;
  // let executionContext: ExecutionContext = NoContext;

  const prevExecutionContext = executionContext;
  executionContext &= ~BatchedContext;
  executionContext |= LegacyUnbatchedContext;
  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;
    if (executionContext === NoContext) {
      // 刷新在此批处理期间调度的即时回调
      flushSyncCallbackQueue();
    }
  }
}
```

运算符的概念
* ＆如果两位都是1则设置每位为1
* | 如果两位之一为1则设置每位为1
* 〜反转操作数的比特位，即0变成1，1变成0

上面表达式相当于下面写法：
1. executionContext = executionContext & (~BatchedContext)  // 0 & (~1) 为 0
2. executionContext = executionContext | LegacyUnbatchedContext // 0 | 8 则为 8

executeContext则是这些Context组合的结果：

将当前摘要添加render：executionContext | = RenderContext

判断当前是否处于渲染阶段：executionContext＆= RenderContext === NoContext

去除render：executionContext＆=〜RenderContext

所以此方法的执行流程是
* 将当前的执行上下文赋值给prevExecutionContext默认为0
* 当前上下文设置成BatchedContext默认为0
* 把当前上下文设置成LegacyUnbatchedContext默认为8
* 执行try中的某些之后执行flushSyncCallbackQueue
* 最后返回执行结果
## updateContainer
```js
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  const current = container.current;   // 对应的是一个 fiber 对象
  const currentTime = requestCurrentTime();   // 获取当前任务时间   过期时间是通过添加当前时间(开始时间)来计算的

  const suspenseConfig = requestCurrentSuspenseConfig();
  // 通过 expirationTime 对节点计算过期时间
  const expirationTime = computeExpirationForFiber(
    currentTime,
    current,
    suspenseConfig,
  );
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    suspenseConfig,
    callback,
  );
}
```
首先是 currentTime， 通过requestCurrentTime方法获得，主要是返回msToExpirationTime(now());

然后我们需要把计算出来的值再通过一个公式算一遍即msToExpirationTime方法
```js
export const now =
  initialTimeMs < 10000 ? Scheduler_now : () => Scheduler_now() - initialTimeMs;    // 差值即现在离React初始化时经过了多少时间

export function requestCurrentTime() {
  currentEventTime = msToExpirationTime(now());
  return currentEventTime;
}

const UNIT_SIZE = 10;
const MAGIC_NUMBER_OFFSET = Batched - 1;

export function msToExpirationTime(ms: number): ExpirationTime {
  return MAGIC_NUMBER_OFFSET - ((ms / UNIT_SIZE) | 0);
}
```
接下来是计算 expirationTime，这个时间和优先级有关，值越大，优先级越高。并且同步是优先级最高的，它的值为 1073741823，即常量 MAGIC_NUMBER_OFFSET 加一。

在 computeExpirationForFiber 函数中存在很多分支，但是计算的核心就只有三行代码，分别是：
```js
// 同步
expirationTime = Sync
// 交互事件，优先级较高
expirationTime = computeInteractiveExpiration(currentTime)
// 异步，优先级较低
expirationTime = computeAsyncExpiration(currentTime)
// MAGIC_NUMBER_OFFSET = Batched-1 --> (Sync - 1)-1 --> 1073741821;
// UNIT_SIZE = 10
function computeExpirationBucket(
  currentTime,
  expirationInMs,
  bucketSizeMs,
): ExpirationTime {
  return (
    MAGIC_NUMBER_OFFSET -
    ceiling(
      MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE,
    )
  );
}

function ceiling(num: number, precision: number): number {
  return (((num / precision) | 0) + 1) * precision;
} 
```
expirationTime 指的就是一个任务的过期时间，React 根据任务的优先级和当前时间来计算出一个任务的执行截止时间。只要这个值比当前时间大就可以一直让 React 延后这个任务的执行，以便让更高优先级的任务执行，但是一旦过了任务的截止时间，就必须让这个任务马上执行。

只需要记住任务的过期时间是通过当前时间加上一个常量（任务优先级不同常量不同）计算出来的。

## updateContainerAtExpirationTime
当计算出时间以后就会调用 updateContainerAtExpirationTime，直接进入 scheduleRootUpdate 函数就好。
```js
function scheduleRootUpdate(
  current: Fiber,
  element: ReactNodeList,
  expirationTime: ExpirationTime,
  suspenseConfig: null | SuspenseConfig,
  callback: ?Function,
) {

  const update = createUpdate(expirationTime, suspenseConfig);

  update.payload = {element};

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    warningWithoutStack(
      typeof callback === 'function',
      'render(...): Expected the last optional `callback` argument to be a ' +
        'function. Instead received: %s.',
      callback,
    );
    update.callback = callback;
  }

  enqueueUpdate(current, update);
  scheduleWork(current, expirationTime);

  return expirationTime;
}
```
对于 update 对象内部的属性来说，我们需要重点关注的是 next 属性。因为 update 其实就是一个队列中的节点，这个属性可以用于帮助我们寻找下一个 update。对于批量更新来说，我们可能会创建多个 update，因此我们需要将这些 update 串联并存储起来，在必要的时候拿出来用于更新 state。

在 render 的过程中其实也是一次更新的操作，但是我们并没有 setState，因此就把 payload 赋值为 {element} 了。

接下来我们将 callback 赋值给 update 的属性，这里的 callback 还是 ReactDom.render 的第三个参数。

然后我们将刚才创建出来的 update 对象插入队列中，函数核心作用就是创建或者获取一个队列，然后把 update 对象入队。

最后调用 scheduleWork 函数。


## 总结
绍两个核心概念：FiberRoot和RootFiber，只有理解并区分这两个概念之后才能更好地理解React的Fiber架构和任务调度阶段中任务的执行过程。

![avatar](/img/render.png)
