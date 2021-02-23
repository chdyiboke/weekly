# await

async/await被称为 JS 中异步终极解决方案。

先看这个，Faster async： https://juejin.cn/post/6930088165738823693


流程：

    一开始整段脚本作为第一个宏任务执行
    执行过程中同步代码直接执行，宏任务进入宏任务队列，微任务进入微任务队列
    当前宏任务执行完出队，检查微任务队列，如果有则依次执行，直到微任务队列为空
    执行浏览器 UI 线程的渲染工作
    检查是否有Web worker任务，有则执行
    执行队首新的宏任务，回到2，依此循环，直到宏任务和微任务队列都为空


多个例子：

## 例子零，宏微任务队列
```javascript
Promise.resolve().then(()=>{
  console.log('Promise1')  
  setTimeout(()=>{
    console.log('setTimeout2')
  },0)
});
setTimeout(()=>{
  console.log('setTimeout1')
  Promise.resolve().then(()=>{
    console.log('Promise2')    
  })
},0);
console.log('start');

// start
// Promise1
// setTimeout1
// Promise2
// setTimeout2
```

## 例子一，微任务执行顺序
```javascript
new Promise(resolve => {
  console.log('Promise');
  resolve();
})
  .then(() => {
    console.log('promise1');
  })
  .then(() => {
    console.log('promise2');
  })
  .then(() => {
    console.log('promise3');
  });

new Promise(resolve => {
  console.log('b');
  resolve();
})
  .then(() => {
    console.log('b');
  })
  .then(() => {
    console.log('b');
  })
  .then(() => {
    console.log('b');
  });


```

## 例子二，纯Promise

```javascript
function handler() {
  return Promise.resolve(123)
    .then(dbQuery)
    .then(serviceCall)
    .then(result => {
      console.log(result);
    });
}

async function dbQuery() {
  console.log(1);
  return Promise.resolve()
    .then(serviceCall)
    .then(serviceCall)
    .then(serviceCall);
}

function serviceCall() {
  console.log(2);
  return 3;
}

handler();

```
## 例子三，async、await

```javascript
async function async1() {
  await async2();
  console.log('async1 end');
}
async function async2() {
  // console.log('常量');
  return Promise.resolve().then(()=>{
    console.log('异步')
  })
}
async1();

new Promise(resolve => {
  console.log('Promise');
  resolve();
})
  .then(() => {
    console.log('promise1');
  })
  .then(() => {
    console.log('promise2'); // 'async1 end'
  })
  .then(() => {
    console.log('promise3');
  });

console.log('script end');
```


await后是异步：Promise =》script end =》 异步 =》promise1=》promise2 =》async1 end=》promise3  
常量：常量 =》Promise =》script end =》 async1 end=》promise1=》promise2 =》promise3


[例子地址：](https://github.com/LuckyWinty/fe-weekly-questions/issues/17)
chrome促使Promise标准改了，现在node.js 8的结果才是对的。目前最新版chrome,firfox,safari都是node.js 8(或者12以上)的结果

## 总结

async 函数变快少不了以下两个优化：  

1. 移除了额外的两个微任务
2. 移除了 throwaway promise

建议：多使用 async 和 await 而不是手写 promise 代码，多使用 JavaScript 引擎提供的 promise 而不是自己去实现。  


PS:
async 函数是一个通过异步执行并隐式返回 promise 作为结果的函数。

```
async function foo() {
  const v = await 42;
  return v;
}
const p = foo();
// → Promise
p.then(console.log);

```


[原文|Faster async functions and promises](https://v8.dev/blog/fast-async)  
[译文|Faster async functions and promises](https://juejin.cn/post/6930088165738823693)
