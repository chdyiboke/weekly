// 快速排序
function sort(arr) {
  //递归结束条件🔚
  if (arr.length <= 1) return arr;

  let midIndex = arr.length >> 1;
  let midValue = arr.splice(midIndex, 1)[0];
  let left = [],
    right = [];
  //和基准值比较,分别插入left,right数组
  arr.forEach((item) => {
    item <= midValue ? left.push(item) : right.push(item);
  });

  return [...sort(left), midValue, ...sort(right)];
}

sort([3, 2, 1, 4, 6, 8]);

// 二分法查找 其输入是一个有序的元素列表（必须是有序的）
function search(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
}
search([1, 3, 5, 7, 9, 11, 14, 16], 7);
