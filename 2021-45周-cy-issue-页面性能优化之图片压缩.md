# 页面性能优化之图片压缩

质量变换：https://cloud.baidu.com/doc/BOS/s/Ukbisw1em

## bos提供的质量转化

```js

function initUrl(url: string): string {
    if (!url || typeof url !== 'string') {
        return '';
    }
    //  \s \S 非空白符 *匹配无数个字符  $匹配结尾
    return url.replace(/@[\s\S]*$/, '');
}

export function w900q80(url: string): string {
    let tmp = initUrl(url);
    // 质量变换：https://cloud.baidu.com/doc/BOS/s/Ukbisw1em
    return tmp === '' ? tmp : `${tmp}@w_900,q_80`;
}
```

原图片：
https://midpf-mp-pub.cdn.bcebos.com/afe064e47d19c2e8bd3cfb93c4e76a1c_1618220429057.jpeg@s_2,w_1242,h_828

