# React

## 一、React 常见面试题

### 题目一 基础

1. 类组件和函数组件的区别？
本质：类组件是 ES6 类，继承 React.Component；函数组件是纯函数，接收 props 返回 JSX。
状态管理：类组件用 state/setState；函数组件用 Hooks（useState）。
生命周期：类组件有完整生命周期；函数组件用 useEffect 模拟生命周期。
性能：函数组件更轻量，无实例创建，React 编译优化更好。
趋势：React 官方推荐函数组件 + Hooks，类组件逐步淘汰。

2. props 和 state 的区别？
来源：props 是外部传入（父→子），只读不可修改；state 是组件内部私有状态，可修改。
修改方式：props 只能由父组件更新；state 通过 setState/useState 修改。
作用：props 用于组件通信；state 用于组件内部状态管理。
更新触发：两者变化都会触发组件重新渲染。
3. React 中 key 的作用？为什么不能用 index 作为 key？

作用：key 是虚拟 DOM 的唯一标识，帮助 React diff 算法快速识别节点，提升渲染效率，避免节点复用错误。
禁止用 index：列表顺序变化时，index 会跟着改变，导致 React 错误复用节点，引发数据错乱、状态丢失等 bug；推荐用唯一 id 作为 key。
4. 什么是虚拟 DOM？优点是什么？
虚拟 DOM 是真实 DOM 的 JS 对象映射，React 不直接操作真实 DOM，而是通过虚拟 DOM 对比差异（diff），批量更新真实 DOM。
优点：
减少频繁操作真实 DOM 的性能损耗；
跨平台兼容（React Native）；
实现高效的差分更新。

5. React 组件通信方式有哪些？
答案：
父→子：props
子→父：props 传递回调函数
兄弟组件：共同父组件状态提升
跨多层组件：Context API
全局状态：Redux/Zustand/Jotai
路由传参：useParams/useLocation

### 题目二 核心原理题

1. React  diff 算法原理？

React 为了优化虚拟 DOM 对比性能，制定了三大策略：
分层对比：只对比同层级节点，不跨层级对比；
类型对比：节点类型不同，直接销毁重建，不对比子节点；
key 对比：同类型节点通过 key 精准匹配，复用节点。
时间复杂度从 O (n³) 优化为 O(n)。

2. setState 是同步还是异步？
合成事件 / 生命周期中：异步（批量更新，提升性能）；
原生事件 / 定时器 / Promise 中：同步（脱离 React 管控）。
本质：React 18 之前分场景，React 18 后所有 setState 都是自动批量更新。

3. useEffect 详细用法和执行时机？
useEffect 是函数组件的副作用钩子，替代生命周期。
无依赖项：组件每次渲染后执行（DidMount+DidUpdate）；
空数组依赖：仅挂载时执行一次（DidMount）；
带依赖项：依赖变化时执行；
返回清理函数：组件卸载 / 重新渲染前执行（WillUnmount）。


4. Hooks 的使用规则？
只能在函数组件 / 自定义 Hooks 顶层使用；
不能在循环、条件、嵌套函数中使用；
自定义 Hooks 必须以 use 开头。
原因：React 依赖 Hooks 的调用顺序实现状态管理。


5. 什么是 React 闭包陷阱？如何解决？

闭包陷阱：组件渲染时，Hooks 捕获了当前渲染的旧状态 / 旧 props，导致异步逻辑中获取不到最新值。
解决：
用 useRef 存储最新值；
完善 useEffect 依赖项；
使用函数式更新 useState。

6. 场景应用题
父子组件渲染顺序？
答案：
挂载：父组件挂载 → 子组件挂载；
更新：父组件更新 → 子组件更新；
卸载：子组件卸载 → 父组件卸载。

React 如何捕获组件错误？
答案：
类组件：componentDidCatch + static getDerivedStateFromError；
函数组件：必须用错误边界类组件包裹（函数组件不支持错误捕获）。


### 题目三 性能优化

1. Hooks 高频对比题
避免渲染不必要的组件；
使用 React.memo 或 shouldComponentUpdate 避免重复渲染；
合理使用 React.PureComponent；
避免在 render 中创建函数或对象；
使用 React 18 新特性（自动批量更新）。

1. useMemo 和 useCallback 的区别？
答案：
useMemo：缓存计算结果（值），避免重复计算，用于优化复杂计算逻辑；
useCallback：缓存函数引用，避免子组件重复渲染，配合 React.memo 使用。
共同点：都依赖依赖项，用于性能优化。
2. useRef 的作用？

获取真实 DOM 节点/ 子组件实例；
存储跨渲染周期的可变值（不会触发重渲染）；
解决 Hooks 闭包陷阱。

3. useMemo /useCallback/ React.memo 的关系？
React.memo：浅比较 props，缓存函数组件，避免无效重渲染；
useCallback：缓存传递给子组件的函数，配合 memo 使用；
useMemo：缓存传递给子组件的值 / 对象，配合 memo 使用。
三者结合是 React 组件性能优化的核心组合。

### 题目四 优化 / 架构题
1. React 性能优化手段有哪些？
用 React.memo/PureComponent 缓存组件；
用 useCallback/useMemo 缓存函数 / 值；
合理使用 key，避免虚拟 DOM 错误复用；
懒加载：React.lazy + Suspense；
代码分割、虚拟列表、防抖节流；
减少不必要的状态、拆分大型组件。
2. React 18 新特性有哪些？

并发渲染：可中断、优先级调度的渲染机制；
自动批处理：所有场景 setState 批量更新；
Suspense 增强：支持数据获取、服务端渲染；
新 Hooks：useId、useTransition、useDeferredValue；
流式 SSR：服务端流式渲染，提升首屏速度。
3. Context API 原理和使用场景？

用于跨层级组件通信，避免 props 逐层传递（props 钻取）。
原理：通过 createContext 创建上下文，Provider 提供数据，useContext 消费数据。
注意：Context value 变化会导致所有消费组件重渲染，需配合 useMemo 优化。

总结
基础核心：虚拟 DOM、diff、setState、组件通信是必考题；
Hooks 重点：useEffect/useMemo/useCallback 原理 + 区别；
进阶必背：React18 新特性、性能优化；
手写保底：useState、useEffect、懒加载。

### 手写

1. 手写简易 useState
```js
function useState(initialValue) {
  let state = initialValue;
  const setState = (newValue) => {
    state = newValue;
    // 触发组件重新渲染
    render();
  };
  return [state, setState];
}
```
2. 手写简易 useEffect
```js
function useEffect(callback, dependencies) {
  // 存储上一次依赖
  const prevDeps = useRef(null);
  // 首次渲染/依赖变化，执行回调
  if (!prevDeps.current || !dependencies.every((d, i) => d === prevDeps.current[i])) {
    callback();
    prevDeps.current = dependencies;
  }
}
```
3. 实现 React 懒加载
```js
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <React.Suspense fallback={<div>加载中...</div>}>
      <LazyComponent />
    </React.Suspense>
  );
}
```

## 一、React  native 常见面试题

### 题目一


