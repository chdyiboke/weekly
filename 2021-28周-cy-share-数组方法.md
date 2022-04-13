# 数组方法


## 检测数组

检测数组的方法： 

```javascript
Array.isArray(); 
prototype; 
typeof
```

## 转换方法

```javascript
toString // [1,2].toString()
join
```
## 栈方法
```javascript
push
pop 
```
## 队列方法
```javascript
shift // 推出, 
unshift // 推入（可传入推入元素）
```
## 重排序方法
```javascript
reverse 反转  
sort 排序
```
## 操作方法
```javascript
concat
slice(index1, index2) // 截取，不包括 index2
splice(起始位置, 删除项数, 插入项1, 插入项2)=》返回删除的数组
      删除： arr.splice(起始位置, 几项)
       插入： arr.splice(起始位置, 0, 要插入项1, 要插入项2) 
      替换： arr.splice(起始位置, 删除的项数, 要插入项1, 要插入项2) 
```
## 位置方法
```javascript
indexOf lastIndexOf 
        ES6: find 和 findIndex
arr.find(callback) 找到第一个【符合条件】的数组成员
arr.findIndex(callback) 找到第一个【符合条件】的数组成员的索引值
1.find()与findIndex()参数与用法相同，不同的是find返回元素，findIndex返回索引；找不到时find返回undefined，findIndex返回-1.
2.findIndex()与indexOf()，findIndex比indexOf更强大一些，可以通过回调函数查找对象数组，
indexOf只能查找数组中指定的值，不过indexOf可以指定开始查找位置的索引
```

## 迭代方法
```javascript
every 都满足条件，返回【true】
some  有一项满足条件，返回【true】
filter 返回满足条件的项
map / forEach 运行的每一项给函数
```
## 归并方法
```javascript
reduce(前一个值, 当前值, 当前索引, 原数组)

reduceRight 一样，就是从右边开始遍历
```

## 总结

### 修改原数组的方法
```javascript
修改原数组：splice、reverse、sort、push/栈队列方法
```
### 数组方法实现
map的实现(forEach)-reduce、reserve
```javascript

Array.prototype.myMap=function(callback){
const arr = this;
const newArr = [];
for(let i = 0; i < arr.length;i++){
    newArr.push(callback(arr[i]));
}
return newArr;
}
console.error([0,1,2,3,4].myMap((item,index)=> item+1));

```


