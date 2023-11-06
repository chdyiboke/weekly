/**
 * 给定一个 m x n 的矩阵，如果一个元素为 0，则将其所在行和列的所有元素都设为 0。请使用原地算法。
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 * O(1)空间的暴力
 * 方法1：MODIFIED 不太严谨
 * 方法2：标记 行列第一个元素
 * 方法3：0 === -0 漏洞=》标记 -0
 */
var setZeroes = function(matrix) {
    // const MODIFIED = -1000000;
    // const R = matrix.length;
    // const C = matrix[0].length;

    // for (let r = 0; r < R; r++) {
    //   for (let c = 0; c < C; c++) {
    //     if (matrix[r][c] == 0) {
    //       for (let k = 0; k < C; k++) {
    //         if (matrix[r][k] != 0) {
    //           matrix[r][k] = MODIFIED;
    //         }
    //       }
    //       for (let k = 0; k < R; k++) {
    //         if (matrix[k][c] != 0) {
    //           matrix[k][c] = MODIFIED;
    //         }
    //       }
    //     }
    //   }
    // }

    // for (let r = 0; r < R; r++) {
    //   for (let c = 0; c < C; c++) {
    //     if (matrix[r][c] == MODIFIED) {
    //       matrix[r][c] = 0;
    //     }
    //   }
    // }

    let isCol = false;
    let R = matrix.length;
    let C = matrix[0].length;

    for (let i = 0; i < R; i++) {
      if (matrix[i][0] == 0) {
        isCol = true;
      }

      for (let j = 1; j < C; j++) {
        if (matrix[i][j] == 0) {
          matrix[0][j] = 0;
          matrix[i][0] = 0;
        }
      }
    }
    for (let i = 1; i < R; i++) {
      for (let j = 1; j < C; j++) {
        //如果被标记的为0，则此项为0
        if (matrix[i][0] == 0 || matrix[0][j] == 0) {
          matrix[i][j] = 0;
        }
      }
    }

    if (matrix[0][0] == 0) {
      for (let j = 0; j < C; j++) {
        matrix[0][j] = 0;
      }
    }
    if (isCol) {
      for (let i = 0; i < R; i++) {
        matrix[i][0] = 0;
      }
    }

    /**
     * 标记 -0 有些作弊
     */
    // let i, j;
    // i = matrix.length;
    // while(i--){
    //     j = matrix[i].length;
    //     while(j--){
    //         if(checkIsZero(i, j)){
    //             setZero(i, j);      
    //         }
    //     }
    // }
    
    // function checkIsZero(i, j){
    //     return !matrix[i][j] && 1 / matrix[i][j] > 0;
    // }
    // function setZero(i, j){
    //     let k;
    //     k = 0;
    //     while(k < matrix.length){
    //         matrix[k][j] = matrix[k][j] ? -0 : matrix[k][j];
    //         k++;
    //     }
    //     k = 0;
    //     while(k < matrix[i].length){
    //         matrix[i][k] = matrix[i][k] ? -0 : matrix[i][k];
    //         k++;
    //     }
    // }
};