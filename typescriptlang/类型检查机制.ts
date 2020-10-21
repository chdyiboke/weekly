// 类型推断
let a = 1;
let b = [1, 'b']; // 联合类型 let b: (string | number)[]

let c= (x=1) => x+1; // let c: (x?: number) => number

// (parameter) event: KeyboardEvent
window.onkeydown = (event) => {
    console.log(event);
}

// 类型断言 as
interface Foo {
    bar: number;
}

// let foo = {} as Foo;
// foo.bar =1;
// 推荐
let foo: Foo ={
    bar: 1
}

// 类型的兼容性问题
// 目标类型  源类型

// 1) 接口兼容性，少兼容多。
interface X {
    a: any;
 }

 interface Y {
    a: any;
    b: any;
 }

let x:X = {a:1};
let y:Y = {a:1,b:2};

x=y;
// error
// y=x;


// 2) 函数兼容性 多兼容少。精确的类型 ==赋值=》不精确的类型。
let handle3 =(a: string) => {};

interface Point2D {
    x: number;
    y: number;
}
interface Point3D {
    x: number;
    y: number;
    z: number;
}

let p2d = (point: Point2D) =>{};
let p3d = (point: Point3D) =>{};

p3d = p2d;
// error
p2d = p3d;

// 3）返回值类型 少兼容多
let f =() => ({name :'Alice'});
let g =() => ({name :'Alice', location: 'Baijing'});
f = g;

// 4) 类兼容性 
// 静态成员和构造函数不在比较的范围
// 类的私有成员和受保护成员会影响兼容性
class Animala {
    feet: number;
    constructor(name: string, numFeet: number) { }
}

class Size {
    feet: number;
    constructor(numFeet: number) { }
}

let aa: Animala;
let ss: Size;

aa = ss;  // OK
ss = aa;  // OK

// 5) 泛型兼容性 
interface Empty<T> {
    // data: T; 放开 xx !== yy;
}
let xx: Empty<number>;
let yy: Empty<string>;

xx = yy;

// 泛型函数
let identity = function<T>(x: T): void {
    // ...
}

let reverse = function<U>(y: U): void {
    // ...
}

identity = reverse;  // OK

/** 总总总...结
口诀：
结构之间：少兼容多
函数之间：多兼容少
**/