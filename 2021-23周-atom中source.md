# source组件的使用与问题
## 使用
```js
<c-source-multi
            :list="list"
            :feedback="feedbackContent"
            :is-xcx="false"
            more
        />

其中
  list: [
                {
                    icon: 'http://img1.imgtn.bdimg.com/it/u=3159708968,61693733&fm=26&gp=0.jpg',
                    text: '百度贴吧',
                    url: 'https://m.baidu.com'
                }
            ],
```

## 问题
```
@click点击事件不起作用，不能进行跳转
```

## 解决办法 使用footer组件代替
```js
 <c-footer
            :left-img-src="imgSrc"
            :feedback="feedbackContent"
            @click="btnClick"
        >
            <span class="iconColor">
               百度房产<i class="c-icon">&#xe734</i>
            </span>
        </c-footer>
```

