# Webpack中publicPath

## 引言

publicPath解释最多的是说访问静态资源时的路径，当我们把资源放到CDN上的时候，把 publicPath设为CDN的值就行了，这种使用方法适用于生产环境

而使用webpack-dev-server开发时,publicPath指的是使用webpack-dev-server打包后生成的资源存放的位置。  

默认情况下，webpack-dev-server打包的资源放在根目录下，即localhost:8000/下，只是它打包的资料是存放在内存中，在项目目录里看不到，打开浏览器的开发者模式，在source里可以看到。

## output.publicPath和webpack-dev-server中publicPath

### output.publicPath
output选项指定webpack输出的位置，其中比较重要的也是经常用到的有path和publicPath
#### output.path

默认值：process.cwd()

output.path只是指示输出的目录，对应一个绝对路径，例如在项目中通常会做如下配置：
```js
output: {
	path: path.resolve(__dirname, 'build'),
}
```
#### output.publicPath

默认值：空字符串  
官方文档中对publicPath的解释是：
```
webpack 提供一个非常有用的配置，该配置能帮助你为项目中的所有资源指定一个基础路径，它被称为公共路径(publicPath)。
```

其实这里说的所有资源的基础路径是指项目中引用css，js，img等资源时候的一个基础路径，这个基础路径要配合具体资源中指定的路径使用，所以其实打包后资源的访问路径可以用如下公式表示：
```
静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径
```
这个最终静态资源访问路径在使用html-webpack-plugin打包后得到的html中可以看到。  

但是这里有一个问题，相对路径在访问本地时可以，但是如果将静态资源托管到CDN上则访问路径显然不能使用相对路径，但是如果将publicPath设置成/，则打包后访问路径为localhost:8080/dist/main.js，本地无法访问，所以这里需要在上线时候手动更改publicPath

### webpack-dev-server中的publicPath

在开发阶段，我们借用devServer启动一个开发服务器进行开发，这里也会配置一个publicPath，这里的publicPath路径下的打包文件可以在浏览器中访问。而静态资源仍然使用output.publicPath。

webpack-dev-server打包的内容是放在内存中的，这些打包后的资源对外的的根目录就是publicPath，换句话说，这里我们设置的是打包后资源存放的位置

## html-webpack-plugin
这个插件用于将css和js添加到html模版中

### template
作用：用于定义模版文件的路径

### filename
作用：输出的HTML文件名，默认为index.html，可以直接配置带有子目录

filename的路径是相对于output.path的，而在webpack-dev-server中，则是相对于webpack-dev-server配置的publicPath。

如果webpack-dev-server的publicPath和output.publicPath不一致，在使用html-webpack-plugin可能会导致引用静态资源失败，因为在devServer中仍然以output.publicPath引用静态资源，和webpack-dev-server的提供的资源访问路径不一致，从而无法正常访问。

### node中的路径
* __dirname: 总是返回被执行的 js 所在文件夹的绝对路径
* __filename: 总是返回被执行的 js 的绝对路径
* process.cwd(): 总是返回运行 node 命令时所在的文件夹的绝对路径

## 参考
https://www.cnblogs.com/SamWeb/p/8353367.html

