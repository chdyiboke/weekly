# Promise.race

Promse.race就是赛跑的意思，意思就是说，Promise.race([p1, p2, p3])里面哪个结果获得的快，就返回那个结果，不管结果本身是成功状态还是失败状态。

```
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  },1000)
})

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('failed')
  }, 500)
})

Promise.race([p1, p2]).then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(error)  // 打开的是 'failed'
})

```


## 应用 -- 请求超时

```
const res = await Promise.race([
  fetch(new Request(...)),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`${url} request timeout`));
    }, Timeout);
  }),
]);
```

以上
