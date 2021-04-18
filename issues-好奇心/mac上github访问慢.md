# Mac 访问github速度慢

## 解决方案

vim /etc/hosts
添加2行。
```
140.82.114.4    github.com
199.232.5.194   github.global.ssl.fastly.net
```
[Mac 访问github速度慢 解决方案！](https://www.cnblogs.com/chenyanbin/p/13836219.html)


## 上面hosts readonly
修改无权限

直接 sudo vim /etc/hosts 就行。

