# cookieStore-更便捷的操作cookie

## 关于cookieStore

cookieStore是chrome87版本才出来的,目前对于这个API的文档比较少,MDN上也没有中文的文档,如果你英语阅读能力不错的话可以看看,cookieStore是一个异步API,对于操作cookie是相当方便的

![avatar](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a54e30cfda04f8c9b0b75b762302e30~tplv-k3u1fbpfcp-watermark.image) 


## cookie方法简述
目前来看，大家在cookie方面都是统一的document.cookie，在此基础上做一些额外的操作，但是通常我们不知道的是，当你设置完成一个cookie信息之后，是否设置成功。你还需要再去获取一下你设置的那个cookie的值，看是否已经成功设置，麻烦不说，还影响我们的执行效率。而且对于正则匹配我们拿出来的所有的cookie信息这种方式很尴尬。cookie是否发生了变更，也没有对应的监听，这些都是要解决的

## 获取cookie
目前都是统一通过document.cookie的方式获取的cookie，然后通过对应的匹配形式。为什么我们只想要name这个对应的cookie信息，但总是要先把所有的拿出来，并且还很开心的觉得自己封装了一个好的获取cookie的方法，这总是过于复杂，而且效率很低

那么如果我们用cookieStore的方式该怎么做呢？

新的方式的话，需要使用cookieStore并调用其get方法，它返回的是一个promise，所以，当你设置失败的时候，它会告诉你失败并返回失败原因，具体的调用实例如下
```js
try {
    const cookieValue = await cookieStore.get('cookieName')
    if(cookieValue){
        console.log('cookieName: ', cookieValue)
    } else {
        console.log('cookieValue is null')
    }
} catch(e) {
    console.error('cookieStore is error: ' + e)
}
```

### 获取domain下的全部cookie
```js
await cookieStore.getAll({ domain: '.baidu.com' })
```
## 设置cookie
之前的方式：
```js
document.cookie = 'cookieName=cookieValue; domain: xxx.com'
```
就像之前说的，在设置完成之后，如果我们想知道是否设置成功，那么就需要用getCookie获取一遍，如果能够获取到，那说明没问题

那么在cookieStore中，我们如何设置呢？
```js
try {
    await cookieStore.set({
        name: 'cookieName',
        value: true,
        domain: 'xxx.com',
        expires: Date.now()
    })
} catch (e) {
    console.error('falied:' + e)
}
```

## 删除cookie
之前的方式，我们通常是通过setCookie的形式将对应的cookie的值设置成空，然后将expires的值设置成过期的时间，这样依靠浏览器就会自动删除其对应的内容

那么新的方式如何做呢？
```js
try {
    await cookieStore.delete('cookieName')
} catch (e) {
    console.error('falied:' + e)
}
```

## 监控cookie
当然，新的API肯定有新的方法，那就是你可以监控cookie，当cookie内容发生变化的时候会执行此操作
```js
cookieStore.addEventListener('change', event => {
    console.log(`${event.changed.length} changed cookies`)
    for (const cookie in event.changed) {
        console.log(`${cookie.name} changed`)
    }
    console.log(`${event.deleted.length} deleted cookies`)
    for (const cookie in event.deleted) {
        console.log(`${cookie.name} deleted`)
    }
})
```

## 参考文档
Chromium API：https://developer.chrome.com/docs/extensions/reference/cookies/  
CookieStore：https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/CookieStore