# echarts 如何设置X轴文字 第一个左对齐 第二个右对齐

设计要求实现，办法总比困难多

```js

    axisLabel: {
        textStyle: {
            fontSize: '13px',
            color: '#858585'
        },
        formatter: function (value, index) {
            // x轴，左侧左对齐；右侧右对齐
            if (index === 0) {
                return '     ' + value;
            }
            if (index === 5) {
                return value + '     ';
            }
            return value;
        }
    },

```

效果可以看线上。

https://fang.baidu.com/pc/trend

## 参考

https://segmentfault.com/q/1010000019739603

