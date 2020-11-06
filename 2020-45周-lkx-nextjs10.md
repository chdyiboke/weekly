# Next.js 10新功能

## 内置图像组件和自动图像优化
今年，我们已经在开发人员体验和改善所有Next.js应用程序的性能上进行了大量投资。我们专注于减少浏览器必须加载的JavaScript数量。  
虽然我们致力于减少浏览器必须加载的JavaScript量的努力取得了回报，但网络不仅是Javascript：它还是markup和image。  
针对image具体有以下几个方面问题：
1. 图片占据网页上总字节数的50％。
2. 图像对最大内容绘画有很大的影响，因为它们通常是加载页面时最大的可见元素。
3. 网页上30％的图像都位于初始视口之外，这意味着浏览器将加载用户直到向下滚动页面才能看到的图像。  
4. 图片通常没有width和height属性，导致它们在页面加载时跳转。这会损害“累积版式转换核心网络生命”。
5. 网站上99.7％的图像未使用WebP等现代图像格式。

为了以高性能的方式使用网页上的图像，必须考虑很多方面：大小，重量，延迟加载和现代图像格式。  
开发人员必须设置复杂的构建工具来优化图像，但是这些工具通常不涵盖来自外部数据源的用户提交的图像，因此无法优化所有图像。 

针对Web上高性能图像的解决方案：Next.js图像组件和自动图像优化。

### Next.js图像组件
在最基本的方面，Next.js图像组件只是HTML<img>元素的直接替代品，HTML元素是为现代Web演变而来的。
```js
<img src="/profile-picture.jpg" width="400" height="400" alt="Profile Picture">
```
优化后：
```js
import Image from 'next/image'

<Image src="/profile-picture.jpg" width="400" height="400" alt="Profile Picture">
```

Google Chrome团队帮助创建了这个React组件，通过将最佳做法设置为默认做法来提高页面性能。

使用next/image组件时，图像会自动延迟加载，这意味着仅在用户接近观看图像时才渲染图像。这样可以防止将30％的图像加载到初始视口之外。

图像尺寸得到了强制执行，从而使浏览器可以立即呈现图像所需的空间，而不必在加载时跳入图像，从而防止布局偏移。

尽管img元素设置width和height 会导致响应式布局出现问题，使用next/image时情况并非如此。使用next/image图像时，将根据提供的width和的纵横比自动使图像响应height。

开发人员可以标记初始视口中的图像，从而使Next.js可以自动预加载这些图像。

### 自动图像优化
即使与HTML<img>元素相比有了这些改进，仍然存在一个主要问题。将2000 x 2000像素的图像发送到渲染较小图像的手机。

使用Next.js 10，我们也可以解决该问题。该next/image组件将通过内置的图像优化自动生成较小的尺寸。
内置的图像优化功能可以自动以现代图像格式（例如WebP）提供图像，如果浏览器支持的话，WebP的大小比JPEG小约30％。

图像优化适用于任何图像源。即使图像来自外部数据源（例如CMS），也会对其进行优化。

Next.js 10不会在构建时优化图像，而是根据用户请求按需优化图像。与静态站点生成器和纯静态解决方案不同，无论发布10张图像还是1000万张图像，构建时间都不会增加。

### 结论
* 新next/image组件和自动图像优化是功能强大的新原语，将大大改善用户体验。

* 该next/image组件可处理自动延迟加载，关键图像的预加载，跨设备正确调整大小并自动支持现代格式。这些功能可用于任何来源的图像。

## 国际化路由
国际化项目有两个主要支柱：翻译和路由（Translations and Routing）。  
许多React库都准备了可以翻译的应用程序，但是大多数库都希望您手动处理路由，并且通常只使用一种渲染策略。因此，作为Next.js 10的一部分，我们发布了对国际化路由和语言检测的内置支持。这种对国际化路由的内置支持支持Next.js的混合策略，因此您可以按页面在“静态生成”或“服务器呈现”之间进行选择。

Next.js 10支持两种最常见的路由策略：子路径路由和域路由。对于这两种策略，都首先要在Next.js配置中配置语言环境。
```js
// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'nl'],
    defaultLocale: 'en'
  }
}
```
配置区域设置后，您可以选择子路径或域路由。

### 子路径路由

子路径路由将语言环境放入url中。这允许所有语言都生活在一个域中。

例如，你可以插入如URL的语言环境/nl-nl/blog和/en/blog。

### 域路由
域路由使您可以将语言环境映射到顶级域。例如，example.nl可以映射到nl语言环境，example.com也可以映射到en语言环境。
```js
// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'nl'],
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en'
      },
      {
        domain: 'example.nl',
        defaultLocale: 'nl'
      }
    ]
  }
}
```
## Next.js分析
发布Next.js Analytics。用于跟踪实际性能指标并将这些见解反馈到您的开发工作流程中的解决方案。

使用Next.js Analytics：
* 现在您将连续进行测量，而不是一次测量。
* 而不是在您的开发设备上进行测量，而是从访问者正在使用的实际设备上进行测量。
* Next.js Analytics旨在关注整个画面，深入了解您的受众以及您的应用程序对用户的性能。

访问[nextjs.org/analytics](https://nextjs.org/analytics)以了解如何立即在您的应用程序中启用它。

## React 17支持
React 17对Next.js没有重大更改，但是需要进行一些维护更改，例如更新对等项依赖关系。该新JSX变换自动启用React17时被使用，不需要任何配置改变。

开始使用React 17所需要做的就是升级Next.js和React：
```js
npm install next@latest react@latest react-dom@latest
```

## getStaticProps/getServerSideProps快速刷新

当对您的getStaticProps和getServerSideProps函数进行编辑时，Next.js现在将自动重新运行该函数并应用新数据。这使您可以更快地进行迭代而不必刷新页面。
![avatar](/img/nextjs.png)

## 自动解决 href
以前的动态路由 必须同时提供href和as属性
```js
<Link href="/categories/[slug]" as="/categories/books">
```

我们很高兴地宣布，作为Next.js 10的一部分，您不再需要as在大多数用例中使用该属性。消除开发人员的麻烦并改善最终用户体验。

## @next/codemod 命令行界面

当Next.js中的某个功能被弃用并需要更改较大的代码库时，我们的团队将为其创建一个codemod。codemod是一种自动化的代码转换，您可以在项目上运行以更新源代码。

例如：我们发布了一个codemod，用于将箭头功能和匿名功能更新为命名功能。需要进行[此转换](https://nextjs.org/docs/advanced-features/codemods#name-default-component)。
![avatar](/img/codemods.jpeg)

借助Next.js 10，我们将发布一个新的Next.js codemods CLI工具，该工具可让您运行一个命令来更新应用程序：
```js
npx @next/codemod <transform> <path>
```
* transfrom - 转换名称
* path - 要转换的文件或目录
* --dry - 试运行，不会编辑任何代码
* --print - 打印更改的输出以进行比较

要了解有关codemod的更多信息，可以查看[Next.js Codemods文档](https://nextjs.org/docs/advanced-features/codemods#name-default-component)。

## 参考链接
https://nextjs.org/blog/next-10#built-in-image-component-and-automatic-image-optimization