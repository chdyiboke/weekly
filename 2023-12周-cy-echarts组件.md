# echarts 组件总结

https://echarts.apache.org/handbook/zh/get-started/

## 最大值。最小值

```js
opt.yAxis[0].min
opt.yAxis[0].max

存在问题：双Y轴，差距大时，左侧没显示 -- 同时设置 max 和 min
```

## X 轴文字按规则，截断

```js
(opt.xAxis as any).axisLabel.formatter = (params: any) => {
  let newParams = params;
  return newParams;
};

```

## 堆叠显示

```js
showSymbol: true,
stack: it.stack || "",
// item.stack = "total";
```

## X 轴文字按规则，截断

```js
/**
 * params: 123***4567
 */
const params = '123***4567';
(opt.xAxis as any).axisLabel.formatter = () => {
  const n = 4
  let news = params;
  if (params.match(/***/)) {
    news =
      params.substring(0, params.match(/***/).index - n) +
      "\n" +
      params.substring(params.match(/***/).index - n, params.length);
  }
  return news;
};

```

## 排序

## dataZoom

```js
(opt as any).dataZoom = [
  {
    show: true,
    showDataShadow: false, // 不显示数据阴影
    start: 0,
    end: 5
  },
  {
    type: "slider",
  }
];

```

## 添加 tags 能力

```js
opt.series.markLine;
```

## 图例排序

```js
@legendselectchanged

opt.xAxis.data 排序
```

## 带百分比的双 y 轴

```js
yAxis: [
  {
    type: 'value',
  },
  {
    type: 'value',
    axisLabel: {
      formatter: '{value} %'
    }
  }
],
```

等
