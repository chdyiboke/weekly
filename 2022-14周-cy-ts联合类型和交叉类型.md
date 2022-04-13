# 联合类型和交叉类型
目前为止，本手册仅涉及到不可分（Atomic）的类型，这时开发者也许会试图寻找将多个已有的类型进行结合或者合成，从而形成新类型的工具。
联合类型和交集类型就是这个方法之一。

- [联合类型和交叉类型](#联合类型和交叉类型)
  - [联合类型](#联合类型)
  - [联合类型的公共字段](#联合类型的公共字段)
  - [联合类型的区分](#联合类型的区分)
  - [联合类型的穷举检查](#联合类型的穷举检查)
  - [交叉类型](#交叉类型)

## 联合类型
有时候，开发者希望参数类型是 `string` 或者 `number` 中的一个，例如：
```ts
/**
 * Takes a string and adds "padding" to the left.
 * If 'padding' is a string, then 'padding' is appended to the left side.
 * If 'padding' is a number, then that number of spaces is added to the left side.
 */
function padLeft(value: string, padding: any) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}

padLeft("Hello world", 4); // returns "    Hello world"
```
上面 `padLeft` 的问题在于，参数 `padding` 的类型是 `any` ，这意味着可以给它传入一个既不是 `string`，也不是 `number` 的值：
```ts
// passes at compile time, fails at runtime.
let indentedString = padLeft("Hello world", true);
```

用**联合类型**(Union Type)可以解决这个问题：
```ts
/**
 * Takes a string and adds "padding" to the left.
 * If 'padding' is a string, then 'padding' is appended to the left side.
 * If 'padding' is a number, then that number of spaces is added to the left side.
 */
function padLeft(value: string, padding: string | number) {
  // ...
}

let indentedString = padLeft("Hello world", true);
// error: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
```
联合类型描述某个值的类型是多种类型中的一种，用竖线（ `|` ）分隔每个类型，比如 `number | string | boolean` 表示值的类型是这**三个类型其中的一种**。

## 联合类型的公共字段
对于一个联合类型的值，我们只能直接访问到联合类型所共有的字段：
```ts
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

declare function getSmallPet(): Fish | Bird;

let pet = getSmallPet();
// ok
pet.layEggs();

// error: Only available in one of the two possible types
pet.swim();
```

这里的联合类型可能感觉有点刁钻，需要开发者逐渐习惯。对于一个联合类型 `A | B` 的值，我们唯一能肯定的是这个值有 `A` 和 `B` 都拥有的成员。

## 联合类型的区分
在使用联合类型时的一个常用技巧是，利用字段的字面量让编译器将值的类型限定在某些范围内，比如下列有个一个由三个类型组成的联合类型，这三个类型的公共字段是 `state`：
```ts
type NetworkLoadingState = {
  state: "loading";
};

type NetworkFailedState = {
  state: "failed";
  code: number;
};

type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};

// 创建一个“三选一”的联合类型
// 但还不确定是哪一个
type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;
```

比如，在运行时，你可以使用 `switch` 判断值的类型，TypeScript编译器会自动推断某个逻辑分支中值的类型：

```ts
type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;

function logger(state: NetworkState): string {

  // error:不确定 code成员 是否存在
  state.code;

  // By switching on state, TypeScript can narrow the union
  // down in code flow analysis
  switch (state.state) {
    case "loading":
      return "Downloading...";
    case "failed":
      // 这里肯定有 code 成员
      // 因为 state.state 等于 "failed"
      return `Error ${state.code} downloading`;
    case "success":
      return `Downloaded ${state.response.title} - ${state.response.summary}`;
  }
}
```

## 联合类型的穷举检查
开发者希望当没有到处理联合类型的所有类型情况时，编译器能告诉自己。例如，在上面的例子中，再加一种情况：
```ts
// 新状态
type NetworkFromCachedState = {
  state: "from_cache";
  id: string
  response: NetworkSuccessState["response"]
}

type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState
  | NetworkFromCachedState;

function logger(s: NetworkState) {
  switch (s.state) {
    case "loading":
      return "loading request";
    case "failed":
      return `failed with code ${s.code}`;
    case "success":
      return "got response"
  }
}
```
注意到，这时 `logger` 返回的类型实际上是 `string | undefined`，这是因为 `switch` 分支没有覆盖到 `state === "from_cache"` 的情况。
为了让编译器提示错误，有两种方法：
第一种是 打开 `--strictNullChecks` 选项并定义一个返回类型：
```ts
// error: Function lacks ending return statement and return type does not include 'undefined'.
function logger(s: NetworkState): string {
  switch (s.state) {
    case "loading":
      return "loading request";
    case "failed":
      return `failed with code ${s.code}`;
    case "success":
      return "got response"
  }
}
```
可见，这种方式有一点投机取巧对吧？

第二种是使用 `never` 类型：
```ts

function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

function logger(s: NetworkState): string {
  switch (s.state) {
    case "loading":
      return "loading request";
    case "failed":
      return `failed with code ${s.code}`;
    case "success":
      return "got response";
    default: 
      return assertNever(s) // error: Argument of type 'NetworkFromCachedState' is not assignable to parameter of type 'never'.
  }
}
```
这里的 `assertNever` 函数检查 `s` 是否为 `never` 类型——所有其他情况都排除之后的类型，如果开发者像上面一样忘记了 `state === "from_cache"` 的情况，那么类型为`NetworkFromCachedState` 的值 `s` 就会传给 `assertNever`，于是就会报错。这种方式需要开发者额外定义一个函数，但比第一种但错误提示更显而易见。

## 交叉类型
交叉类型与联合类型联系紧密，但用处却很不相同。交叉类型将多种类型合并为一种，例如 `Person & Serializable & Loggable` ，这个类型将拥有这三个类型的所有成员。
如果想合并网络响应和错误处理这两种类型，你可以这样：
```ts
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// These interfaces are composed to have
// consistent error handling, and their own data.

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};
```