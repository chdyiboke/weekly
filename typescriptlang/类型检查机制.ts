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
// 【静态成员】 和 【构造函数】 不在比较的范围 ==》可兼容
// 类的 【私有成员】 和 【受保护成员】 会影响兼容性 ==》不可兼容
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


// 下一节：类型保护机制

enum Type { Strong, Week };

class Java{
    helloJava(){
        console.log("hello Java");
    }
    java: any;
}

class Javascript{
    helloJavascript(){
        console.log("hello Javascript");
    }
    javascript: any;
}

// 返回值很特殊：lang is Java
function isJava(lang: Java | Javascript): lang is Java {
    return (lang as Java).helloJava !== undefined
}

function getLanguage(type: Type){
    let lang = type === Type.Strong ?new Java() : new Javascript();
    /** 类型保护
    * 4种方法
    * a. instanceof
    * b. in 加入属性 
    * c. typeof
    * d. 类型保护函数
    */

    // a. instanceof 方式
    if(lang instanceof Java){
        lang.helloJava();
    }else{
        lang.helloJavascript();
    }
    // b. in 方式
    // if('java' in lang){
    //     lang.helloJava();
    // }else{
    //     lang.helloJavascript();
    // }

    // * c. typeof 方式
    // if(typeof x === 'string'){
    //     console.log(x.length);
    // }else{
    //     console.log(x);
    // }

    // * d. 类型保护函数 方式
    if(isJava(lang)){
        lang.helloJava();
    }else{
        lang.helloJavascript();
    }
    // if((lang as Java).helloJava){
    //     (lang as Java).helloJava();
    // } else {
    //     (lang as Javascript).helloJavascript();
    // }

    return lang;
}

getLanguage(Type.Strong); // 返回 Java实例



// 下一节：高级类型

// 交叉类型： &
// 将多个类型合并成一个类型、所有类型的并集。

// 联合类型： |
// 类型不确定，为声明类型其中的一个
let al: number | string = 'a';
let bl: 'a' | 'b' = 'c';
let cl: 'a' | 1 = 'a';

interface DogInterface {
    run():void;
}

interface CatInterface {
    jump():void;
}

let pet: DogInterface & CatInterface ={
    run(){}, jump(){}
}

class Dog implements DogInterface{
    eat(){};
    run(){};
}

class Cat implements CatInterface{
    eat(){};
    jump(){};
}

enum Master { Boy, Girl }
function getPet(master: Master){
 let pet = master === Master.Boy? new Dog(): new Cat();
 pet.eat(); // ！！！联合类型不确定类型时，只能访问共有方法
 return pet;
}

// 区分类型：可区分的联合类型


// 索引类型： keyof
interface Obj{
    a:number;
    b:string;
}

let key: keyof Obj;

function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
    return names.map(n => o[n]);
  }
  
  interface Person {
      name: string;
      age: number;
  }
  let person: Person = {
      name: 'Jarid',
      age: 35
  };
  let strings: string[] = pluck(person, ['name']); // ok, string[]

// 映射类型： 

interface Obj {
    cc: string;
}

type ReadonlyObj = Readonly<Obj>;
type PersonPartial = Partial<Person>; // 可选
// type Readonly<T> = {
//     readonly [P in keyof T]: T[P];
// };

// 条件类型：T extends U? X:Y
// 如果 T 可以赋值给 U 那么就是 X 类型。

type TypeName<T> = 
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object"

type T1 = TypeName<string>

type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"

// 预定义的有条件类型：
/** @
 * Exclude<T, U> -- 从T中剔除可以赋值给U的类型。
 * Extract<T, U> -- 提取T中可以赋值给U的类型。
 * NonNullable<T> -- 从T中剔除null和undefined。
 * ReturnType<T> -- 获取函数返回值类型。
 * InstanceType<T> -- 获取构造函数类型的实例类型。
 * 
 */

