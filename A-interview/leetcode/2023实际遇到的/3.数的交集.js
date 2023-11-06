// 示例 1:

// 输入: nums1 = [1,2,2,1], nums2 = [2,2]
// 输出: [2,2]
// 示例 2:

// 输入: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
// 输出: [4, 9]
const nums1 = [1, 2, 2, 1],
  nums2 = [2, 2];
function func(ns1, ns2) {
  const newArr = [];
  ns1.forEach((item) => {
    if (ns2.indexOf(item) !== -1) {
      newArr.push(item);
      ns2.splice(ns2.indexOf(item), 1);
    }
  });

  return newArr;
}

func(nums1, nums2);
