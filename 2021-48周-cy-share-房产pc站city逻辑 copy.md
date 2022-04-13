# 房产PC站 city 逻辑

## ssr 城市基本逻辑

query > cookie > ip > 北京  存入 store

服务端先写入，然后

## cookie

```js
@Injectable()
export class AddCityMiddleware implements NestMiddleware {
    // eslint-disable-next-line @typescript-eslint/ban-types
    use(@Req() req: Request, res: Response, next: Function) {
        try {
            let CITY: string = '';
            if (req.query.city as string) {
                CITY = (req.query.city as string || '').replace('市', '');
            }
            else {
                if (req.headers.cookie) {
                    CITY = this.getCookie('CITY', req.headers.cookie);
                }
            }

            res.cookie('CITY', CITY || '北京', {
                maxAge: 1000 * 60 * 60 * 24 * 365,
                domain: isDev
                    ? '.baidu.com'
                    : 'fang.baidu.com',
                path: '/'
            });

            next();
        }
        catch (error) {
            next();
        }
    }
    getCookie(name, cookies) {
        let arr = [];
        let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        if (arr = cookies?.match(reg)) {
            return decodeURIComponent(arr[2]);
        }

        return null;
    }
}


```


服务端入口文件

```js
    // query > cookie > '北京'; 统一写入store

    let city = '';
    try {
        if (to.value.query.city || typeof to.value.query.city === 'string') {
            city = to.value.query.city.replace('市', '');
        }
        else {
            const cookieCity = getCookie('CITY', context.headers.cookie);
            city = cookieCity;
        }
    }
    catch (err) {
        // city = '北京';
        console.error(err);
    }
    store.commit('setCityInfo', city || '北京');

```

## 最后
0-baidu 记录一些工作常用的网站，欢迎添加。
