# 如何将 Canvas 绘制过程转为视频

如果我们用 Canvas 实现了一些动画效果，需要将它回放出来，很多人通常就是用录屏工具将屏幕内容录下来播放，很少有人知道，Canvas 可以直接通过现代浏览器支持的 Media Streams API 来转成视频。

Canvas 对象支持 captureStream 方法，这个方法会返回一个 MediaStream 对象。然后，我们可以通过这个对象创建一个 MediaRecorder 来录屏。


## 例子
```js
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const {width, height} = canvas;

ctx.fillStyle = 'red';

function draw(rotation = 0) {
  ctx.clearRect(0, 0, 1000, 1000);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(rotation);
  ctx.translate(-width / 2, -height / 2);
  ctx.beginPath();
  ctx.rect(200, 200, 200, 200);
  ctx.fill();
  ctx.restore();
}

function update(t) {
  draw(t / 500);
  requestAnimationFrame(update);
}
update(0);
```
这个效果实现一个 200 宽高的矩形在画布中心旋转。

接下来，我们将这个效果录制下来，假设我们录制 6 秒的视频，首先我们要获取 MediaStream 对象：
```js
const stream = canvas.captureStream();
```
然后，我们创建一个 MediaRecorder：
```js
const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
```

接着我们可以注册 ondataavailable 事件，将数据记录下来：
```js
const data = [];
recorder.ondataavailable = function (event) {
  if (event.data && event.data.size) {
    data.push(event.data);
  }
};
```
在 onstop 事件里，我们通过 Blob 对象，将数据写入到页面上的 video 标签中。

```js
recorder.onstop = () => {
  const url = URL.createObjectURL(new Blob(data, { type: 'video/webm' }));
  document.querySelector("#videoContainer").style.display = "block";
  document.querySelector("video").src = url;
};
```

最后，我们开始录制视频，并设定在 6 秒钟之后停止录制：
```js
recorder.start();

setTimeout(() => {
  recorder.stop();
}, 6000);
```
