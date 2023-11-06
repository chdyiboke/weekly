/**
 * @param {number} x
 * @return {number}
 * 核心就是 转为字符串 (x+"").split("").reverse().join("")
 */
var reverse = function(x) {
    let fh = "", str;
    // 先处理符号
    if(x<0){
        fh = "-";
        x = 0 - x;
    }
    str = (x+"").split("").reverse().join("");
    //都是整数。 溢出条件判断
    if(str.length>10 || str.length === 10 && str > (x<0?"2147483648":"2147483647")){
        return 0;
    }else{
        return +(fh + str);
    }
};