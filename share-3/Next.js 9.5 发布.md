# Next.js 9.5 发布-稳定的增量静态再生


https://mp.weixin.qq.com/s/48G7sxO61luD90Mv8g6IFQ

https://nextjs.org/docs/advanced-features/automatic-static-optimization

## 增量静态再生
如果没有阻塞数据要求，则Next.js会自动确定页面为静态页面（可以预呈现）。

This determination is made by the absence of getServerSideProps and getInitialProps in the page

```
module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
}

```

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