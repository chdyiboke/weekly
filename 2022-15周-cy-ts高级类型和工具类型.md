# 高级类型和工具类型
本章介绍了一些构造类型的高级方法，这些方法可以与**工具类型**一起使用

- [高级类型](#高级类型)
  - [类型保证 和 类型区分](#类型保证-和-类型区分)
  - [自定义类型保证](#自定义类型保证)
    - [使用类型判定](#使用类型判定)
    - [使用 ```in``` 操作符](#使用-in-操作符)
  - [`typeof` 类型保证](#typeof-类型保证)
  - [`instanceof` 类型保证](#instanceof-类型保证)
  - [空类型](#空类型)
    - [可选参数和属性](#可选参数和属性)
    - [类型保证 和 断言后缀](#类型保证-和-断言后缀)
  - [类型别名](#类型别名)
  - [接口 vs 类型别名](#接口-vs-类型别名)
  - [枚举成员类型](#枚举成员类型)
  - [多态的 *`this`* 类型](#多态的-this-类型)
  - [索引类型](#索引类型)
  - [索引签名](#索引签名)
  - [类型映射](#类型映射)
  - [类型映射的类型推断](#类型映射的类型推断)
  - [条件类型](#条件类型)
  - [分发条件类型](#分发条件类型)
  - [条件类型的类型推断](#条件类型的类型推断)
  - [预置的条件类型](#预置的条件类型)

## 类型保证 和 类型区分
联合类型(Union Types)常用于某个值可能是多种类型的情况。但是如果想确切知道到底这个值是哪一种类型时，需要怎么做呢？在JavaScript中，通常使用运行时代码去判断这个值是否存在，或者说满足某种类型所对应的特定条件。
```ts
// 一个返回联合类型的变量
let pet: Fish | Bird = getSmallPet();

// ok, 能够使用 "in" 判断 "swim" 这个成员是否存在
if ("swim" in pet) {
  pet.swim();
}
// error: 但是你不能直接使用这个成员，因为不能确定是Fish还是Bird，鱼不会飞
// Property 'fly' does not exist on type 'Fish | Bird'.
if (pet.fly) {
  pet.fly();
}
```
此外，还可以使用类型断言来区分类型
```ts
// 一个返回联合类型的变量
let pet: Fish | Bird = getSmallPet();

let fishPet = pet as Fish;
let birdPet = pet as Bird;

// ok
if (fishPet.swim) {
  fishPet.swim();
} else if (birdPet.fly) {
  birdPet.fly();
}
```

然而，这不酷...

## 自定义类型保证
类型保证是在运行时对变量对类型进行判断的代码。

### 使用类型判定
类型判定可以实现类型保证，可以用一个返回"类型判定"的函数来实现
```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```
其中，`pet is Fish` 就是类型判定，类型判定的使用方式就是"参数名 is 类型"，其中参数名来自于函数入参。

当运行 ```isFish``` 时，TypeScript会将其类型限定在Fish类型，于是可以在```if```分支中直接使用 ```Fish``` 类型的特性。值得注意的是，TypeScript不仅知道了 ```pet``` 在```if```分支中的类型，也知道了 ```else``` 分支中的类型。

```ts
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```
### 使用 ```in``` 操作符

```in``` 也能限定变量的类型。
```ts
function move(pet: Fish | Bird) {
  if ("swim" in pet) {
    return pet.swim();
  }
  return pet.fly();
}
```

## `typeof` 类型保证
下面代码将 `typeof` 封装到函数中，用以判定值的类型
```ts
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function isString(x: any): x is string {
  return typeof x === "string";
}

function padLeft(value: string, padding: string | number) {
  if (isNumber(padding)) {
    return Array(padding + 1).join(" ") + value;
  }
  if (isString(padding)) {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

可能这种封装的方式有点麻烦，我们也可以直接只用内联方式

```ts
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```
`typeof` 类型保证有两种使用方式：`typeof v === "typename"` 和 `typeof v !== "typename"`，其中`typename` 是 `typeof` 操作符的返回类型之一（`undefined`、`number`、`string`、`boolean`、`bigint`、`symbol`、`object`、`function`）。虽然TypeScript编译器不会阻止你将`typeof v`的返回值与其他字符串进行比较，但这样编译器就无法进行类型保证了。

## `instanceof` 类型保证
如果熟悉JavaScript中的 `instanceof` 操作符，你大概知道本节要讲的是什么了吧。
`instanceof` 类型保证使用**类型的构造函数**进行类型限定。看看下面代码：
```ts
interface Padder {
  getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) {}
  getPaddingString() {
    return Array(this.numSpaces + 1).join(" ");
  }
}

class StringPadder implements Padder {
  constructor(private value: string) {}
  getPaddingString() {
    return this.value;
  }
}

function getRandomPadder() {
  return Math.random() < 0.5
    ? new SpaceRepeatingPadder(4)
    : new StringPadder("  ");
}

let padder: Padder = getRandomPadder();

if (padder instanceof SpaceRepeatingPadder) {
  padder;
}
if (padder instanceof StringPadder) {
  padder;
}
```
`instanceof` 操作符的右边要求是一个构造函数，TypeScript会将值的类型限制为：
1. 构造函数的原型(`prototype`)的类型
2. 上述类型的构造签名的并集

## 空类型
TypeScript 有两种特殊的类型：`null` 和 `undefined`。默认情况下，类型检查器认为 `null` 和 `undefined` 可以赋给任意类型，但 `--strictNullChecks` 可以组织这个默认行为，除非显式使用联合类型：
```ts
let exampleString = "foo";
exampleString = null;
// error: Type 'null' is not assignable to type 'string'.

let stringOrNull: string | null = "bar";
stringOrNull = null;

stringOrNull = undefined;
// error: Type 'undefined' is not assignable to type 'string | null'.
```

### 可选参数和属性
在 `--strictNullChecks` 选项下，可选参数会被自动加上 `|undefined` 类型：
```ts
function f(x: number, y?: number) {
  return x + (y ?? 0);
}

f(1, 2);
f(1);
f(1, undefined);
f(1, null); //error: Argument of type 'null' is not assignable to parameter of type 'number | undefined'.
```
可选属性也一样：
```ts
class C {
  a: number;
  b?: number;
}

let c = new C();

c.a = 12;
c.a = undefined;
// error: Type 'undefined' is not assignable to type 'number'.
c.b = 13;
c.b = undefined;
c.b = null;
// error: Type 'null' is not assignable to type 'number | undefined'.
```

### 类型保证 和 断言后缀
在使用包含空类型的联合类型时，有时需要使用**类型保证**来规避空类型的情况，比如：
```ts
function f(stringOrNull: string | null): string {
  if (stringOrNull === null) {
    return "default";
  } else {
    return stringOrNull;
  }
}
```
你也可以使用简短操作符（`??`）：
```ts
function f(stringOrNull: string | null): string {
  return stringOrNull ?? "default";
}
```

有时候编译器无法判断值的类型是 `null` 和 `undefined`，你可以使用类型断言后缀(`!`)来手动判断:
```ts
interface UserAccount {
  id: number;
  email?: string;
}

const user: UserAccount | undefined = getUser("admin");
user.id;
// error: Object is possibly 'undefined'.

if (user) {
  user.email.length;
// error: Object is possibly 'undefined'.
}

// Instead if you are sure that these objects or fields exist, the
// postfix ! lets you short circuit the nullability
user!.email!.length;
```

## 类型别名
类型别名为一个类型起一个新的名字，这有时和接口很像，但是它能够给基本类型、联合类型、元组或其他类型命名。
```ts
type Second = number;

let timeInSecond: number = 10;
let time: Second = 10;
```
实际上，类型别名并不会创建一个新类型，它只是目标类型的一个引用。与接口一样，类型别名也能使用泛型：
```ts
type Container<T> = { value: T };
```
别名也能嵌套使用：
```ts
type Tree<T> = {
  value: T;
  left?: Tree<T>;
  right?: Tree<T>;
};
```
甚至能和`交叉类型`一起使用，很酷不是吗？
```ts
type LinkedList<Type> = Type & { next: LinkedList<Type> };

interface Person {
  name: string;
}

let people: LinkedList<Person> = getDriversLicenseQueue();
people.name;
people.next.name;
people.next.next.name;
people.next.next.next.name;
```

## 接口 vs 类型别名

类型别名的功能类似于接口，但是又有点不同。接口的所有特性几乎都能在类型别名中找到，它们关键的不同在于：类型别名无法多次添加额外属性，而接口却可以多次拓展。

`interface`可以给已有的接口添加属性：
```ts
interface Window {
  title: string
}

interface Window {
  ts: import("typescript")
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
```
但类型别名一旦声明就无法修改：
```ts
type Window = {
  title: string
}

type Window = {
  ts: import("typescript")
}

// Error: Duplicate identifier 'Window'.
```
由于 `接口` 更接近于JavaScript中[对象的运行方式](https://wikipedia.org/wiki/Open/closed_principle)，我们推荐尽可能的使用接口而不是类型别名。
另一方面，如果你遇到使用接口无法构造的类型，那么可以转而结合使用联合类型或者元组等工具，用类型别名来实现。

## 枚举成员类型
正如 [枚举](../handbook/基本类型.md#枚举) 中所述，枚举成员都有一个初始字面量。

## 多态的 *`this`* 类型

*`this`* 的多态性表现为 *`this`* 的类型可以在父类和子类之间切换，如同我们熟知的 [流式接口](https://en.wikipedia.org/wiki/Fluent_interface)，通过继承来提升代码表达能力：
```ts
class BasicCalculator {
  public constructor(protected value: number = 0) {}
  public currentValue(): number {
    return this.value;
  }
  public add(operand: number): this {
    this.value += operand;
    return this;
  }
  public multiply(operand: number): this {
    this.value *= operand;
    return this;
  }
  // ... other operations go here ...
}

let v = new BasicCalculator(2).multiply(5).add(1).currentValue();
```
因为使用了 *`this`* 类型，于是你能够拓展父类的方法，而不用担心 *`this`* 的类型问题。
```ts
class ScientificCalculator extends BasicCalculator {
  public constructor(value = 0) {
    super(value);
  }
  public sin() {
    this.value = Math.sin(this.value);
    return this;
  }
  // ... other operations go here ...
}

let v = new ScientificCalculator(2).multiply(5).sin().add(1).currentValue();
```

要是没有如此多变的 *`this`* 类型，调用 `multiply(5)` 之后返回的就是`BasicCalculator` 的父类型，要知道父类型是没有 `sin` 方法的，多亏了 *`this`* 类型，他会沿着继承链找到可用的方法。

## 索引类型

有了索引类型，编译器就可以利用动态的属性名来检查代码了。回想在JavaScript中我们是怎么动态遍历对象的成员的：
```ts
function pluck(o, propertyNames) {
  return propertyNames.map((n) => o[n]);
}
```
而在TypeScript中，我们使用 **类型索引查询**（**index type query**）和 **类型索引**：
```ts
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map((n) => o[n]);
}

interface Car {
  manufacturer: string;
  model: string;
  year: number;
}

let taxi: Car = {
  manufacturer: "Toyota",
  model: "Camry",
  year: 2014,
};

// 编译器会检查字段 Manufacturer，model 是否是 taxi 的属性索引，并且
// pluck 的返回类型也会通过索引属性的类型进行推断，你看，这里是 string[]
let makeAndModel: string[] = pluck(taxi, ["manufacturer", "model"]);

// 这里编译器推导出 pluck 的返回类型是 (string | number)[]
let modelYear = pluck(taxi, ["model", "year"]);

// 错误, 索引名 "unknown" 不在联合类型 "manufacturer" | "model" | "year" 之中
pluck(taxi, ["year", "unknown"]);
```
上面的例子介绍了一组新的类型操作符，第一个是 `keyof T` ，即 **索引类型查询**。对于任何类型 `T`，`keyof T` 返回的类型是 `T` 的已知的、public的属性名构成的联合类型：
```ts
let carProps: keyof Car;
//         ^ = let carProps: "manufacturer" | "model" | "year"
```
第二个是 `T[K]` 操作符，这个叫 **类型索引**。我们可以看到，这里的类型的用法，跟表达式的用法一样。比如在上面的例子中，`taxi["manufacturer"]` 的类型是 `Car["manufacturer"]` ，即 `string`。下面是个更简单的例子：
```ts
function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName]; // o[propertyName] is of type T[K]
}
```
在 `getProperty` 中，我们看到 `o: T` ，`propertyName: K`，这表明
`o[propertyName]: T[K]`，编译器会从代码中推导出 `T[K]` 实际的类型，换句话说，编译器知道根据你代码中传入的类型 `T` 来检查 `K` 和 返回类型 `T[K]` ：
```ts
let manufacturer: string = getProperty(taxi, "manufacturer");
let year: number = getProperty(taxi, "year");

let unknown = getProperty(taxi, "unknown"); //error: Argument of type '"unknown"' is not assignable to parameter of type '"manufacturer" | "model" | "year"'.
```

## 索引签名
`keyof` 和 `T[K]` 都在与索引签名打交道，索引签名的类型必须为 `string` 和 `number`。比如你又一个索引签名类型为 `string` 的类型，那么 `keyof` 的结果就是 `string | number` （为什么不是仅为 `string` 呢，因为在 JavaScript 中，你既可以用 `string`，也可以用 `number` 来索引对象的属性。）
而类型索引 `T[string]` 返回的是索引签名的类型：
```ts
interface Dictionary<T> {
  [key: string]: T;
}
let keys: keyof Dictionary<number>;
//     ^ = let keys: string | number
let value: Dictionary<number>["foo"];
//      ^ = let value: number
```
如果索引签名的类型是 `number`，那么 `keyof` 返回的类型仅为 `number` ：
```ts
interface Dictionary<T> {
  [key: number]: T;
}

let keys: keyof Dictionary<number>;
//     ^ = let keys: number
let numberValue: Dictionary<number>[42];
//     ^ = let numberValue: number
let value: Dictionary<number>["foo"];
// error: Property 'foo' does not exist on type 'Dictionary<number>'.
```

## 类型映射

如果想基于已有的类型 `Person`，将其的属性变为可选属性，我们需要像下面这样声明一个类型：
```ts
interface PersonSubset {
  name?: string;
  age?: number;
}
```
或者一个只读的版本：
```ts
interface PersonReadonly {
  readonly name: string;
  readonly age: number;
}
```
手写每个属性感觉很繁琐不是吗？，所以类型映射可以协助你：
```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

我们这样使用上面给的工具：

```ts
type PersonPartial = Partial<Person>;
//   ^ = type PersonPartial = {
//       name?: string | undefined;
//       age?: number | undefined;
//   }
type ReadonlyPerson = Readonly<Person>;
//   ^ = type ReadonlyPerson = {
//       readonly name: string;
//       readonly age: number;
//   }
```

如果你想往类型映射返回的类型中添加新属性，你可以使用交叉类型：
```ts
// Use this:
type PartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
} & { newMember: boolean }

// This is an error!
type WrongPartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
  newMember: boolean;
}
```
让我们来看看一个最简单的类型映射：
```ts
type Keys = "option1" | "option2";
type Flags = { [K in Keys]: boolean };
```
上面的语法类似于 `for in` ，其中包括三个部分：
1. 类型 `K`
2. 联合类型 `Keys`
3. 属性类型 `boolean`

上面的 `Keys` 是硬编码，等同于下面的声明：
```ts
type Flags = {
  option1: boolean;
  option2: boolean;
};
```

实际应用中，就像上面的 `Partial<T>` 和 `Readonly<T>` ，我们会对已有类型的属性进行处理，这会儿就要用到 `keyof` ：
```ts
type NullablePerson = { [P in keyof Person]: Person[P] | null };
//   ^ = type NullablePerson = {
//       name: string | null;
//       age: number | null;
//   }
type PartialPerson = { [P in keyof Person]?: Person[P] };
//   ^ = type PartialPerson = {
//       name?: string | undefined;
//       age?: number | undefined;
//   }
```
上面这种类型映射的泛型版本为：
```ts
type Nullable<T> = { [P in keyof T]: T[P] | null };
type Partial<T> = { [P in keyof T]?: T[P] };
```
下面列出了如何构造代理泛型：

```ts
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};

type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};

function proxify<T>(o: T): Proxify<T> {
  // ... wrap proxies ...
}

let props = { rooms: 4 };
let proxyProps = proxify(props);
//  ^ = let proxyProps: Proxify<{
//      rooms: number;
//  }>
```
鉴 于`Partial<T>` 和 `Readonly<T>` 的便利性，它们和下面的类型工具( `Pick` 和 `Record` )已经被包含在TypeScript全局环境中：
```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```
`Partial`，`Readonly` 和 `Pick` 都是 **同态** 映射，而 `Record` 不是，因为 `Record` 的输出类型的属性并不是输入类型的属性的副本：
```ts
type ThreeStringProps = Record<"prop1" | "prop2" | "prop3", string>;
```
非同态的类型映射基本上都会新建一些属性名，值得注意的是 `keyof any` 表示任何类型的索引类型，换句话说，`keyof any` 相当于 `string | number | symbol`。

## 类型映射的类型推断
上面介绍了代理泛型，即类型 `Proxify<T>`，和相应的实现 `proxify`，简单来说就是将一个普通对象进行 `封装` 的操作，这个操作的逆操作就是 `解封` 对吧：
```ts
function unproxify<T>(t: Proxify<T>): T {
  let result = {} as T;
  for (const k in t) {
    result[k] = t[k].get(); // 类型推断
  }
  return result;
}

let originalProps = unproxify(proxyProps);
//  ^ = let originalProps: {
//      rooms: number;
//  }
```
上面代码发生 `类型推断` 的部分我进行了注明，要注意类型推导仅适用于 **同态** 映射，对于非同态的情况，需要开发者给解封函数一个显式的参数类型。

## 条件类型

条件类型：基于类型关系的判断，选择两个类型中的一个：
```ts
T extends U ? X : Y
```
上面表达式说明，当 `T` 可赋值给 `U` （即 `T` 是 `U` 的子类）时，就是 `X` ，反之为 `Y`。

条件类型 `T extends U ? X : Y` 的类型要么是 `X` 要么是 `Y`，编译器根据是否有足够的类型信息判断返回的类型：

```ts
declare function f<T extends boolean>(x: T): T extends true ? string : number;

// Type is 'string | number'
let x = f(Math.random() < 0.5);
//  ^ = let x: string | number
```
另一个例子是，根据类型参数 `T` 的不同，条件的判断返回类型：
```ts
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";

type T0 = TypeName<string>;
//   ^ = type T0 = "string"
type T1 = TypeName<"a">;
//   ^ = type T1 = "string"
type T2 = TypeName<true>;
//   ^ = type T2 = "boolean"
type T3 = TypeName<() => void>;
//   ^ = type T3 = "function"
type T4 = TypeName<string[]>;
//   ^ = type T4 = "object"
```
有时候条件类型的返回类型是根据调用时的变量类型来决定的：
```ts
interface Foo {
  propA: boolean;
  propB: boolean;
}

declare function f<T>(x: T): T extends Foo ? string : number;

function foo<U>(x: U) {
  // Has type 'U extends Foo ? string : number'
  let a = f(x);

  // This assignment is allowed though!
  let b: string | number = a;
}
```
上面代码中 `a` 的类型取决于 `x` 的类型，对于这种悬而未决的情况，条件类型的类型可以赋给联合类型，两者是兼容的，就上面的 `b` 变量。

## 分发条件类型

我们把类型参数 `T` 是字面类型的条件类型成为**分发条件类型**，它可以将作为入参的联合类型自动解析计算，得到依然为联合类型的返回类型，例如一个条件类型 `T extends U ? X : Y` ，我们传入的 `T` 是 `A | B | C` 那么条件类型就会被解析为 `(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)`。

可以看看下面这些案例：

```ts
type T5 = TypeName<string | (() => void)>;
//   ^ = type T5 = "string" | "function"

type T6 = TypeName<string | string[] | undefined>;
//   ^ = type T6 = "string" | "undefined" | "object"

type T7 = TypeName<string[] | number[]>;
//   ^ = type T7 = "object"
```
```ts
type BoxedValue<T> = { value: T };
type BoxedArray<T> = { array: T[] };
type Boxed<T> = T extends any[] ? BoxedArray<T[number]> : BoxedValue<T>;

type T1 = Boxed<string>;
//   ^ = type T1 = {
//       value: string;
//   }
type T2 = Boxed<number[]>;
//   ^ = type T2 = {
//       array: number[];
//   }
type T3 = Boxed<string | number[]>;
//   ^ = type T3 = BoxedValue | BoxedArray
```
可以看到，当上面的 `T` 类型为 `any[]` 时（即数组），我们就可以用 `T[number]` 对其进行索引，这都归功于条件类型的作用。

分发条件类型还可以对类型进行过滤操作：
```ts
// Remove types from T that are assignable to U
type Diff<T, U> = T extends U ? never : T;
// Remove types from T that are not assignable to U
type Filter<T, U> = T extends U ? T : never;

type T1 = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;
//   ^ = type T1 = "b" | "d"
type T2 = Filter<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "a" | "c"
//   ^ = type T2 = "a" | "c"
type T3 = Diff<string | number | (() => void), Function>; // string | number
//   ^ = type T3 = string | number
type T4 = Filter<string | number | (() => void), Function>; // () => void
//   ^ = type T4 = () => void

// Remove null and undefined from T
type NotNullable<T> = Diff<T, null | undefined>;

type T5 = NotNullable<string | number | undefined>;
//   ^ = type T5 = string | number
type T6 = NotNullable<string | string[] | null | undefined>;
//   ^ = type T6 = string | string[]

function f1<T>(x: T, y: NotNullable<T>) {
  x = y; // ok, 因为 y 是 x 的子集，没问题
  y = x; // error, 反过来不行
}

function f2<T extends string | undefined>(x: T, y: NotNullable<T>) {
  x = y;
  y = x; // error, 因为 x 可能为 undefined
  let s1: string = x; // error, 因为 x 可能为 undefined
  let s2: string = y; // ok，y 排除了 x 中的 undefined
}
```
将条件类型和映射类型一同使用也很有用：
```ts
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface Part {
  id: number;
  name: string;
  subparts: Part[];
  updatePart(newName: string): void;
}

type T1 = FunctionPropertyNames<Part>;
//   ^ = type T1 = "updatePart"
type T2 = NonFunctionPropertyNames<Part>;
//   ^ = type T2 = "id" | "name" | "subparts"
type T3 = FunctionProperties<Part>;
//   ^ = type T3 = {
//       updatePart: (newName: string) => void;
//   }
type T4 = NonFunctionProperties<Part>;
//   ^ = type T4 = {
//       id: number;
//       name: string;
//       subparts: Part[];
//   }
```

与联合类型和交叉类型一样，条件类型无法递归：
```ts
type ElementType<T> = T extends any[] ? ElementType<T[number]> : T; // 错误
```

## 条件类型的类型推断

在条件类型的 `extends` 后面，现在可以通过 `infer` 声明来添加一个类型变量来进行类型推断，类型变量的类型可以在条件类型的 `true` 分支中引用，甚至可以多次 `infer` 推导同一个类型变量。

下面的工具类型可以获取函数的返回类型：
```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

在嵌套的条件类型中，多次使用 `infer` 推导 `U` 的类型：
```ts
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

type T0 = Unpacked<string>;
//   ^ = type T0 = string
type T1 = Unpacked<string[]>;
//   ^ = type T1 = string
type T2 = Unpacked<() => string>;
//   ^ = type T2 = string
type T3 = Unpacked<Promise<string>>;
//   ^ = type T3 = string
type T4 = Unpacked<Promise<string>[]>;
//   ^ = type T4 = Promise
type T5 = Unpacked<Unpacked<Promise<string>[]>>;
//   ^ = type T5 = string
```

下面的例子展示了对同一个变量类型进行推导，当变量类型位于两个可交换的位置时，会合并为一个联合类型：
```ts
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never; // a, b是 co-variant (协变，可交换的)

type T1 = Foo<{ a: string; b: string }>;
//   ^ = type T1 = string
type T2 = Foo<{ a: string; b: number }>;
//   ^ = type T2 = string | number
```

而不可交换（抗变）的情况，就会得到一个交叉类型：
```ts
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void }
  ? U
  : never;

type T1 = Bar<{ a: (x: string) => void; b: (x: string) => void }>;
//   ^ = type T1 = string
type T2 = Bar<{ a: (x: string) => void; b: (x: number) => void }>;
//   ^ = type T2 = never
```
当推导含有多个调用签名的类型时（如函数重载），推导出的类型为各重载中覆盖情况最广的那个重载签名，类型推导难以逐个解析重载函数的参数：
```ts
declare function foo(x: string): number;
declare function foo(x: number): string;
declare function foo(x: string | number): string | number;

type T1 = ReturnType<typeof foo>;
//   ^ = type T1 = string | number
```

还有，无法在类型约束语句中使用 `infer` ：
 ```ts
 type ReturnedType<T extends (...args: any[]) => infer R> = R;
// 'infer' declarations are only permitted in the 'extends' clause of a conditional type.
// Cannot find name 'R'.
 ```

要想上面那样，需要这样写：
```ts
type AnyFunction = (...args: any[]) => any;
type ReturnType<T extends AnyFunction> = T extends (...args: any[]) => infer R
  ? R
  : any;
```

## 预置的条件类型
TypeScript 预先添加了一系列的条件类型，详情可见 [工具类型](/2020-45周-cy-ts4.0-工具类型.md)
