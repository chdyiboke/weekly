# es特性

## es9（2018）

### 异步迭代

ES2018引入异步迭代器（asynchronous iterators），这就像常规迭代器，除了next()方法返回一个Promise。因此await可以和for...of循环一起使用，以串行的方式运行异步操作。
```js
async function processnext(array) {
    for await (let i of array) {
        dosomething(i);
    }
}
```
### Promise.finally()
一个Promise调用链要么成功到达最后一个.then()，要么失败触发.catch()。在某些情况下，你想要在无论Promise运行成功还是失败，运行相同的代码，例如清除，删除对话，关闭数据库连接等。
```js
function doSomething() {
  doSomething1()
  .then(doSomething2)
  .catch(err => {
    console.log(err);
  })
  .finally(() => {
    // finish here!
  });
```

### 正则表达式命名捕获组
```js

const
  reDate = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/,
  match  = reDate.exec('2018-04-30'),
  year   = match.groups.year,  // 2018
  month  = match.groups.month, // 04
  day    = match.groups.day;   // 30
 
const
  reDate = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/,
  d      = '2018-04-30',
  usDate = d.replace(reDate, '$<month>-$<day>-$<year>')   // 04-30-2018
```

### 正则表达式doAll模式

正则表达式中点'.'，匹配除回车外的任何单字符,标记s改变这种行为，允许行终止符的出现，
```js
/hello.world/.test('hello\nworld');       // false
/hello.world/s.test('hello\nworld');      // true
```

### 正则表达式Unicode转义

到目前为止，在正则表达式中本地访问Unicode字符属性是不被允许的。ES201 8添加了Unicode属性转义--形式为 \p{...} 和\P{...}，在正则表达式中使用标记u (unicode) 设置，在\p 块儿内，可以以键值对的方式设置需要匹配的属性而非具体内容。
```js
var reg = /\p{Script=Greek}/u;
reg.test('π');         //true
```
## es10（2019）

### Array的flat()和flatAll()

flat() 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

* flat()方法最基本的作用就是数组降维
* 其次，还可以利用flat()方法的特性来去除数组的空项

```js
var arr1 = [1, 2, [3, 4]];
arr1.flat();   // [1, 2, 3, 4]
 
var arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();    // [1, 2, 3, 4, [5, 6]]
 
var arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);    // [1, 2, 3, 4, 5, 6]
 
//使用 Infinity 作为深度，展开任意深度的嵌套数组
arr3.flat(Infinity);    // [1, 2, 3, 4, 5, 6]
 
//去除空项
var arr4 = [1, 2, , 4, 5];
arr4.flat();
// [1, 2, 4, 5]
```
flatMap()方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。
```js
var arr1 = [1,2,3,4]
arr1.map(x => [x*2])        // [[1],[4],[6],[8]]
arr1.flatMap(x => [x*2])    // [1,4,6,8]
arr1.flatMap(x => [[x*2]])  // [[1],[4],[6],[8]]
```
### String的trimStart()和trimEnd()
分别去除字符串的收尾空白字符

### Object.fromEntries()
```js
var map = new Map([['foo','bar'],['baz',42]]);
var obj = Object.fromEntries(map)      // {foo: "bar", baz: 42}
var arr = [[0,'a'],[1,'b']]
obj = Object.fromEntries(arr)          // {0: "a", 1: "b"}
```

### Symbol.prototype.description
```js
const sym = Symbol('The description');
console.log(String(sym) === 'Symbol(The description)')    // true
console.log(sym.description === 'The description')        // true
```

### String.prototype.matchAll、Function.prototype.toString()
* matchAll()方法返回一个包含所有匹配正则表达式及分组捕获结果的迭代器，之前采用while循环调用exec来获取所有匹配信息。
```js
var str = '<text>JS</text><text>正则</text>';
var reg = /<\w+>(.*?)<\/\w+>/g;
console.log(str.match(reg));     // ["<text>JS</text>", "<text>正则</text>"]

var reg = /<\w+>(.*?)<\/\w+>/;
console.log(str.match(reg));   //匹配到子项和父项，但只匹配一个

var allMatchs = str.matchAll(/<\w+>(.*?)<\/\w+>/g);   //返回迭代器
for (const match of allMatchs) {
  console.log(match);
}
```
* 现在返回精确字符，包括空格和注释

## es11（2020）

### 私有变量
通过在变量或函数前面添加一个哈希符号#，可以将它们设为私有属性，只在类内部可用。
```js
class Money{      
    #money=0;//声明这个属性是私有属性      
    constructor(money){        
        this.#money=money;      
    }    
    getMoney(){//获取值    
        return this.#money;  
    }  
    setMoney(money){//写入值    
        this.#money+=money;  
    }
}    
let RMB=new Money(999);    
#money=999999; // 报错    
console.log(RMB.#money);// 报错
```

### 空值合并运算符
在取一个对象里面的属性，如果这个属性没有值，我们会这样给他一个默认值
```js
console.log(user.like || '写代码',"like2")
console.log(user.sex??'男',"sex");   
```
空值合并运算符（??）是一个逻辑运算符。当左侧操作数为 null 或 undefined 时，其返回右侧的操作数。否则返回左侧的操作数。

他们两个最大的区别就是 ' '和 0，??的左侧 为 ' '或者为 0 的时候，依然会返回左侧的值；
|| 会对左侧的数据进行boolean类型转换，所以' '和 0 会被转换成false,返回右侧的值

### 可选链操作符 ?.

### BigInt
JavaScript 中 Number 类型只能安全的表示-(2^53 -1)至 2^53 -1 范的值，即 Number.MIN_SAFE_INTEGER 至 Number.MAX_SAFE_INTEGER，超出这个范围的整数计算或者表示会丢失精度。
```js
let bigIntNum1=9007199254740999n;
let bigIntNum2=BigInt(90071992547409999);
console.log(typeof bigIntNum1)//bigint
```
注意：
* BigInt 是一种新的数据原始（primitive）类型。注意标准数字与BigInt 数字不能混合使用。
* 尽可能避免通过调用函数 BigInt 方式来实例化超大整型。因为参数的字面量实际也是 Number 类型的一次实例化，超出安全范围的数字，可能会引起精度丢失。

### 动态导入
```js
export const sum=(num1,num2)=>num1+num2;
let fun=async(num1,num2)=>{  
    let model=await import('./demo.js');  
    console.log(model.sum(num1,num2),"两个数的和")
}
fun(8,9)//17 "两个数的和"
```
### globalThis

JavaScript 在不同的环境获取全局对象有不同的方式，NodeJS 中通过 global, Web 中通过 window, self 等，有些甚至通过 this 获取，但通过 this 是及其危险的，this 在 JavaScript 中异常复杂，它严重依赖当前的执行上下文，这些无疑增加了获取全局对象的复杂性。
* 全局变量 window：在 Node.js 和 Web Workers 中并不能使用
* 全局变量 self：通常只在 Web Workers 和浏览器中生效，不支持 Node.js。
* 全局变量 global：只在 Node.js 中生效

### Promise.allSettled
Promise.all 具有并发执行异步任务的能力。但它的最大问题就是如果其中某个任务出现异常(reject)，所有任务都会挂掉，Promise 直接进入 reject 状态。
Promise.allSettled
当我们处理多个promise时，尤其是当它们相互依赖时，记录每个事件在调试中发生的错误可能很有用。使用Promise.allSettled，它会创建一个新的promise，在所有promise完成后返回一个包含每个promise结果的数组。
