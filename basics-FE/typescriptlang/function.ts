// 函数定义

function add1(x: number, y: number) {
    return x + y;
}

// 可选参数，必须放在必选参数后面
function add5(x: number, y?: number) {
    return y? x + y: x;
}

add5(1);


function add7(x: number, ...rest: number[]){
    return x+ rest.reduce((pre, cur) => pre + cur);
}

console.log(add7(1,2,3,4,5))

// 函数重载，先匹配前面的。

// 类：覆盖了es的类。

// 类的继承 & 修饰符
abstract class Animal {
    eat(){
        console.log('eat');
    }
    abstract sleep(): void;
}

class Dog extends Animal {
    constructor(name: string) {
        super();
        this.name = name;
    }
    name: string;
    sleep() {
        console.log('dog sleep');
    }
    run(){}
}
console.log(Dog.prototype);

let dog: Dog = new Dog('wangwang');
console.log(dog); // 构造器函数 name不在原型上，在实例上。

// 类的继承 extends
class Husky extends Dog {
    constructor(name: string, color: string){
        super(name);
        this.color = color;
    }
    color: string;
}

// 修饰符 public private protected readonly static

// private 修饰私有成员，只能在类里面调用。
// protected 受保护成员可以在子类调用，不允许在实例里面访问。
// static 只能通过类名访问，不允许子类调用。


// 抽象类 & 多态

// 抽离事物共性，更好的复用，可以实现多态。

// 抽象类只能被继承，无法创建实例
class Cat extends Animal {
    constructor(name: string) {
        super();
        this.name = name;
    }
    name: string;
    // 子类实现 抽象方法
    sleep() {
        console.log('cat sleep');
    }
}

let cat: Cat = new Cat("miaomiao");
cat.eat();

// 多态
let animals: Animal[] = [dog, cat];
animals.forEach(animal =>animal.sleep());


class WorkFlow {
    step1(){
        return this;
    }
    step2(){
        return this;
    }
}
new WorkFlow().step1().step2(); // 链式调用


class MyWorkFlow extends WorkFlow {
    next(){
        return this;
    }
}

new MyWorkFlow().next().step1().next(); //this 调用多态

// 接口只能约束类的共有成员。
interface Human {
    // new(name: string): void; // 接口不能约束类的构造函数。
    name: string;
    eat(): void;
}

class Asian implements Human {
    constructor(name: string){
        this.name = name;
    }
    private name: string; // 私有是可以的。
    eat(){};
    sleep() {};
}

interface Man extends Human {
    run():void;
}

interface Child {
    cry():void;
}

interface Boy extends Man, Child {}

let boy: Boy = {
    name: "bob",
    run(){},
    eat(){},
    cry(){},
    // hhh(){}, error
}

class Auto {
    state = 1;
    // private state2 =0; C 没有继承 Auto，所以不能。
}

interface AutoInterface extends Auto {

}

class C implements AutoInterface {
    state = 1;
}

class Bus extends Auto implements AutoInterface {

}

