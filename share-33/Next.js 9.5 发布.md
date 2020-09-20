# Next.js 9.5 发布-稳定的增量静态再生


https://mp.weixin.qq.com/s/48G7sxO61luD90Mv8g6IFQ

https://nextjs.org/docs/advanced-features/automatic-static-optimization

## 为什么建议静态化

如果我们把用户访问频繁的页面做成一个静态的页面，然后用户每次访问的这个页面，那么服务器的压力不就大大的减少了？ 

举个例子，一分钟之内，有500个用户访问了首页，首页的数据要从数据库中查2次，则总共需要查询数据库1000次；将页面静态化后，同种情况，只需要在第一个用户访问的时候查询2次数据库然后生成一个静态页面，后续的用户都访问该页面，相比之下，服务器的压力大大的减少了。

页面静态化即将动态渲染生成的页面结果保存成html文件，放到静态文件服务器中。用户访问的时候访问的直接是处理好之后的html静态文件。


## 增量静态再生
如果没有阻塞数据要求，则Next.js会自动确定页面为静态页面（可以预呈现）。

如果页面中没有getServerSideProps和getInitialProps

```
module.exports = {
  devIndicators: {
    autoPrerender: true,
  },
}

```

相反的可以设置 autoPrerender 为false，有getServerSideProps和getInitialProps的页面将不会静态生成。

此功能允许Next.js发出包含`服务器渲染`页面和`静态生成`页面的混合应用程序。


## How it works

next build将发出.html用于静态优化页面的文件。例如，页面的结果pages/about.js将是：
```
.next/server/static/${BUILD_ID}/about.html

```

如果添加getServerSideProps到页面，它将是JavaScript，如下所示：

```
.next/server/static/${BUILD_ID}/about.js

```
## getStaticProps


使用场景“
1. 呈现页面所需的数据可在构建时在用户请求之前获得。
2. 数据来自无头CMS
3. 数据可以被公共缓存（不是特定于用户的）
4. 该页面必须预渲染（对于SEO）并且必须非常快- getStaticProps生成HTML和JSON文件，CDN可以将它们都缓存以提高性能。


https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation


```
// posts will be populated at build time by getStaticProps()
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}

export default Blog

```

## 优势

1. 延迟不会暴涨。页面一直都能快速渲染。

2. 页面永远不会脱机。如果后台页面再生失败，则旧页面保持不变。

3. 数据库和后端负载较低。页面最多同时重新计算一次。


```
export async function getStaticProps() {
  return {
    props: await getDataFromCMS(),
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every second
    revalidate: 1 
  }
}

```
revalidate 标志是秒数，在此时间内最多有一次生成，以防止：

## 事例

https://reactions-demo.now.sh/

https://static-tweet.now.sh/1293522955863982081

https://static-tweet.now.sh/1293523004912148481


## 我的理解

就是将非私有化的数据页面进行缓存，以优化性能，提高用户体验。

主要是它的设计思维。
