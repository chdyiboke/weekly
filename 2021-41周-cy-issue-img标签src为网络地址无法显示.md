# Img标签 src为网络地址无法显示图片问题

## 百度
```HTML
<!--vue中使用-->
<img 
src="https://img.ivsky.com/img/tupian/pre/202004/18/hongchanhua-001.jpg" 
alt="" style="width: 100%;height: 300px">
<!--图片不显示-->
```
在public中的html中，header内加上:

```HTML
<meta name="referrer" content="no-referrer">
```

## 我的解决
```HTML
      <image
        src="https://midpf-material.cdn.bcebos.com/a24bc0c98ebbee181186307197e5b4bf.png"
      />

      改为：

    <img
        src="https://midpf-material.cdn.bcebos.com/a24bc0c98ebbee181186307197e5b4bf.png"
      >
```

## image src与img src都是插入图片有什么区别？

image是小程序的组件，img是html的标签。它们俩默认样式不一样  

### 当然啦，这个 img 才是对的 `<img src=“” alt=“”>`
