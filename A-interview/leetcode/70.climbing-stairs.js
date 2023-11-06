
/**
 * 70 爬楼梯
 * 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
 * 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 * 注意：给定 n 是一个正整数。
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    // if(n <= 1) return 1;
    // return climbStairs(n-1)+climbStairs(n-2);
    if(n==1) return 1;
    let s =[];
    s[1]=1;
    s[2]=2;
    for(let i=3;i<=n;i++)
    {
        s[i]=s[i-1]+s[i-2];
    }
    return s[n];
};

