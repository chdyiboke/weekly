# Mac 访问github速度慢
提升github上clone 或 push 慢的原因：不是 github.com 的域名被限制了，而是 github.global.ssl.fastly.net 这个域名被限制了，最终导致git的速度最高只能达到 20KB/S，通过以下方法解决：

## 解决方案

### 方法一 

vim /etc/hosts
添加2行。
```
192.30.253.113 github.com
151.101.229.194 github.global.ssl.fastly.net

原理

1.1 首先通过[DNS](http://tool.chinaz.com/dns)查询工具，查询域名的解析，输入"github.global.ssl.fastly.net"，查到""TTL"值最小的，以北京【联调】IP为例：151.101.229.194；

1.2 在mac总端执行：sudo vim /etc/hosts，在后面追加"151.101.229.194 github.global.ssl.fastly.net"，点击保存。

```


[Mac 访问github速度慢 解决方案！](https://www.cnblogs.com/chenyanbin/p/13836219.html)

### 方法二：
将github.com 进行替换为github.com.cnpmjs.org
如：git clone https://github.com.cnpmjs.org/wlwenming/brotli.git


## 上面hosts readonly
修改无权限

直接 sudo vim /etc/hosts 就行。

