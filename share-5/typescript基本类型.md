# typescript 基本类型

中文官网
https://www.tslang.cn/

## 背景

强类型与弱类型

js 动态弱类型语言。
TypeScript 不是强类型！只是静态类型！


### 快速入门 TypeScript

```javascript
npm install -g typescript
```
编译一个 TypeScript 文件：
```javascript
// tsc hello.tsx   react
tsc hello.ts
```

## 基本类型
字面量、元组、枚举

### 布尔值
let isDone: boolean = true;

### 数字
let num: number = 1;

### 字符串
let myName: string = 'cy';

### 数组 数组泛型，Array<元素类型>
```
let arr: number[] = [1,2,3];
let arrObj: any[] = ['1',2,3];
```

### 元组  各元素的类型不必相同

```
let xTuple: [number, string, number] = [1,'1',1];
  // 当访问一个越界的元素，会使用联合类型替代：
xTuple[4] = 'world'; // OK, 字符串可以赋值给(string | number)类型
// 下面一行 编译阶段通过，运行时报错
console.log(xTuple[5].toString()); // OK, 'string' 和 'number' 都有 toString
xTuple[6] = true; // Error, 布尔不是(string | number)类型
```

### 枚举 数字枚举 和 字符串枚举
```
enum Color { Red, Green, Blue }
enum Color {Red = 'Red', Green = 'Green', Blue = 'Blue'}
```

### Any 兼容 js 的类型
let arrNor: any[] = [1, true, "free"];

### Void 函数没有返回值
```
function warnUser(): void {
    console.log("This is my warning message");
}
  // 变量 只能为它赋予undefined和null
let voidLet: void = undefined || null; 
```

### Null 和 Undefined  用处不是很大

```
let u: undefined = undefined;
let n: null = null;

// 默认情况下null和undefined是所有类型的子类型，但是我们还是建议不要赋给其他类型，避免意外。
// 鼓励尽可能地使用--strictNullChecks,null和undefined只能赋值给void和它们各自,你可以使用联合类型string | null | undefined。
```

### Never 那些永不存在的值的类型。

```
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
// never类型是任何类型的子类型，也可以赋值给任何类型；然而，反向是不行的，
除了never本身之外，any也不可以赋值给never。
```
https://github.com/chdyiboke/weekly/issues/17

### Object 除number，string，boolean，symbol，null或undefined之外的类型。
```
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

### 类型断言 你会比TypeScript更了解某个值的详细信息

推荐使用 as语法
```
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;

或者

let someValues: any = "this is a string";
let strLengths: number = (<string>someValue).length;

```

