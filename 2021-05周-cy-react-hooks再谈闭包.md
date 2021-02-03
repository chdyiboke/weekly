# react-hooks闭包
闭包，是React Hooks的核心。

```
import React from 'react';
import {useState} from './state';

function Demo() {
  // 使用数组解构的方式，定义变量
  const [counter, setCounter] = useState(0);

  return (
    <div onClick={() => setCounter(counter + 1)}>hello world, {counter}</div>
  )
}

export default Demo();
```

当useState在Demo中执行时，访问了state中的变量对象，那么闭包就会产生。

`思考题：setCounter的执行会产生闭包吗？`
根据闭包的特性，state模块中的state变量，会持久存在。因此当Demo函数再次执行时，我们也能获取到上一次Demo函数执行结束时state的值。

这就是React Hooks能够让函数组件拥有内部状态的基本原理。


## useInterval 中的 useRef

```javascript
function useInterval(fn, delay) {
  const fnRef = useRef(null);
  fnRef.current = fn;
  useEffect(() => {
    if (delay === undefined || delay === null) return;
    const timer = setInterval(() => {
      fnRef.current?.();
    }, delay);
    return () => {
      clearInterval(timer);
    };
  }, [delay]);
}

```

useRef() 返回一个有带有 current 可变属性的普通对象在 renders 间共享，我们可以保存新的 interval 回掉给它：

```javascript
  function callback() {
    // 可以读到新 props，state等。
    setCount(count + 1);
  }

  // 每次渲染后，保存新的回调到我们的 ref 里。
  savedCallback.current = callback;

  // 只执行一次，除非 delay 改变。
  useEffect(() => {
    if (delay === undefined || delay === null) return;
    const timer = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => {
      clearInterval(timer);
    };
  }, [delay]);
```
## 参考

[React Hooks（二）再谈闭包](https://juejin.cn/post/6844904006079217672)