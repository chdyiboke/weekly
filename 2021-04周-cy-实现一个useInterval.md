# 实现一个useInterval

官网/ahooks

实现一个简易的 useInterval

## 问题：

下面计时器，只+1，count一直取的是0；
```
let [count, setCount] = useState(0);
useEffect(() => {
   const id = setInterval(() => {
     setCount(count + 1);
   }, 2000);
   return () => clearInterval(id);
 }, []);
 
<h1>{count}</h1>

```
## 官网解决方法

方法一：
```
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1);
  }, 2000);
  return () => clearInterval(id);
}, [count]); // ✅ 在这添加外部的 `count` 变量

```
方法二：
```
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1); // ✅ 在这不依赖于外部的 `count` 变量（传函数
  }, 2000);
  return () => clearInterval(id);
}, []);
```

方法三：

封装 useTimeout

用法：
```
export default () => {
  const [state, setState] = useState(1);
  useTimeout(() => {
    setState(state + 1);
  }, 3000);
  useInterval(() => {
    setState(state + 1);
  }, 3000);
  return (
    <div>
      <p style={{ marginTop: 16 }}> {state} </p>
    </div>
  );
};
```

封装
```
import { useRef, useEffect } from 'react';
 
function useTimeout(fn, delay) {
  // const fnRef = usePersistFn(fn);
  const fnRef = useRef();
  fnRef.current = fn;
  useEffect(() => {
    if (delay === undefined || delay === null) return;
    const timer = setTimeout(() => {
      fnRef.current();
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [fnRef, delay]);
}
 
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
 
export { useTimeout, useInterval };
```

## 感想

 useRef 每次都会返回相同的引用，不会因为刷新而被初始化，可以保存上一个状态。
 https://juejin.cn/post/6844904062681350157