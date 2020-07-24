# weekly
issue and share weekly

## 每周一次讨论 issue

写到 issue 里面，一直open就好，各抒己见。  

例如：
new操作符都做了什么?

```

function new(func) {
	let target = {};
	target.__proto__ = func.prototype;
	let res = func.call(target);
	if (typeof(res) == "object" || typeof(res) == "function" || res !== null) {
		return res;
	}
	return target;
}

```

四大步骤：

1. 创建一个空对象，并且 this 变量引用该对象，// let target = {};
2. 继承了函数的原型。// target.proto = func.prototype;
3. 属性和方法被加入到 this 引用的对象中。并执行了该函数func// func.call(target);
4. 新创建的对象由 this 所引用，并且最后隐式的返回 this 。// 如果func.call(target)返回的res是个对象或者function 就返回它

// 结果是Object和Function类型的可以返回，这里要排除null，因为它也是’object'

## 每周一次 share


pr 到master


