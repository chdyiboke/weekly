/**
 * 数组方法
 * 
 * push/pop
 * unshift/shift
 * forEach
 * splice??
 * map
 * filter
 * find/findIndex
 * indexOf/lastIndexOf
 * reduce
 * includes
 * some
 * ervey
 * slice
 * concat
 * sort
 * reserve
 * Array.from()
 * fill
 * 
 * 
 * 
 * 
 * str.splite
 * 
 */

 const arr = [0, 12, 2, 3,];
 for(item in arr) {
  console.error(item);
 }


function round(arr){
  return arr.reduce((sum, item)=> sum.concat(Array.isArray(item)? round(item): item),[])
}
round([1,2,3,[4,5,[6,7]]]);




