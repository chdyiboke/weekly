# 虚拟dom初始化

## createElementWithValidation
作用：校验入参是否合法，并通过 function createElement 创建对象的 js 对象
```js
/**
* 入参解释：
* type: html 元素、React 自定义组件等
* props: 属性，例如 className 对应元素的 class，该参数可选
* children: 子节点
*/
function createElementWithValidation(type, props, children) {
    // 校验入参 type  不合法提示错误
    var validType = isValidElementType(type);
    if(!validType) throw Error;
    
    // 将传入的参数转换成 js 对象
    var element = createElement.apply(this, arguments); 
    
    if (element == null) {
        return element;
    } 

    // 校验子集
    if (validType) {
        for (var i = 2; i < arguments.length; i++) {
            // 因为key 验证逻辑不期望非字符串/函数类型，并且可能抛出让人困惑的错误
            validateChildKeys(arguments[i], type);   // 校验子集key
        }
    }
    
    // 根据type不同分别校验
    if (type === REACT_FRAGMENT_TYPE) {   
        validateFragmentProps(element);
    } else {
        validatePropTypes(element);
    }

    return element;
}   
```
1. 先检查传入的type是否是合法的element类型，见isValidElementType，如果不是抛出错误
2. 如果是则将type, props, children等参数传入createElement生成对应的react元素
3. 然后调用validateChildKeys对参数children的每个element判断是否存在key
4. 接着，如果type类型是REACT_FRAGMENT_TYPE，调用validateFragmentProps检查Fragment上的属性（这里函数名为props不妥，key与ref不算是props中的，attributes比较好），其他type类型的元素的props的规则一致。
5. 最后如果验证成功，返回创建的element。

## createElement
作用：
1. 声明一个props对象用来存放属性，defaultProps，以及孩子节点。
2. 孩子节点存放在children属性里面，children可以是一个对象，可以是一个数组，取决于传入的孩子节点个数。
4. 判断组件上是否有ref属性或者key属性，无为null。
5. 返回一个ReactElement
```js
function createElement(type, config, children) {
    var propName;
    var props = {};
    var key = null;
    var ref = null;
    var self = null;
    var source = null;
    // 处理入参 config
    if (config != null) {
        // 将 config 中的 ref、key、__self、__source, 分别赋值给对应的变量
        if (ref 存在 && ref 合法) {
            ref = config.ref;
        }
        if (key 存在 && key 合法) {
            key = '' + config.key;
        }
        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source;

        // 除上述 4 个变量外，config 中的其他值都赋值给 props
        for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
            }
        }
    } 

    // 处理子节点
    var childrenLength = arguments.length - 2;

    if (childrenLength === 1) {
        // 只有一个子节点的，直接赋值
        props.children = children;
    } else if (childrenLength > 1) {
        // 多个子节点的话，则
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
        }
        {
            // 冻结子节点，无法对子节点进行修改
            if (Object.freeze) {
                Object.freeze(childArray);
            }
        }
        props.children = childArray;
    }

    // 处理默认的 props 的属性值
    if (type && type.defaultProps) {
        var defaultProps = type.defaultProps;
        for (propName in defaultProps) {
            // 如果 defaultProps 对应的值不存在，则直接使用默认值
            if (props[propName] === undefined) {
                props[propName] = defaultProps[propName];
            }
        }
    }
    {   
        // 如果存在 ref、key，则将他们也定义到 props上
        if (key || ref) {
            var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

            if (key) {
                Object.defineProperty(props, 'key', {
                    get: warnAboutAccessingKey,   // 定义了个方法，如果读取，就会报错
                    configurable: true
                });
            }
            if (ref) {
                Object.defineProperty(props, 'ref', {
                    get: warnAboutAccessingRef, // 定义了个方法，如果读取，就会报错
                    configurable: true
                });
            }
        }
    }
    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}
```

## ReactElement
作用：返回js对象结构
```js
{
    ?typeof: REACT_ELEMENT_TYPE, // 用于表示是 React 元素
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner // 创建该元素的组件，默认为 null,
    _store: {
        validated: false   
    }
    _self: self,
    _source: source
}
```
问题：为什么有?typeof属性？

在React0.13版本当中存在能被XSS攻击的漏洞，这个漏洞存在的前提条件是服务端存在漏洞。用户在服务端存储json文件包含恶意代码，发送到客户端解析，会造成XSS攻击。为了解决这个漏洞，所以加上?typeof属性，服务端发送一个包含?typeof属性的json，到客户端解析时，?typeof不会被解析出来（Symbol类型不会被json解析），React内部判断这不是一个合法的ReactElement，也就不会渲染。降低了XSS攻击的可能性。

使用React.isValidElement判断元素是否是一个合法的ReactElement，核心也是通过判断?typeof。
```js
function isValidElement(object) {   // //判断目标是不是一个有效的react元素类型，即：string、function、reactSymbol
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```

## validateChildKeys
作用:
 确保一下两个条件：
1. 数组中的每个元素在静态位置定义了显式 key 属性
2. 或在可迭代对象中具有有效 key 属性

## validateFragmentProps
fragment 只能接收 children 属性和 key 属性，提供其他属性的时候会得到警告。
为 fragment 提供 ref 属性的时候会得到一个单独的警告。
## validatePropTypes
作用：给定一个元素，验证它的 props 是否遵循 type 提供的 propTypes 定义。

## 总结
* JSX是ReactCreateElement的语法糖。
* 在写函数式组件时需要在头部引入React。
* 为什么写JSX语法的时候顶部元素只能是一个而不是多个，是因为ReactCreateElement这个方法的实现。