# el-table前端分页排序
element-ui表格分页以后，只是对当前页面排序，没有对整个数据排序

```js
<el-table            
:data="tableData.slice((pageIndex-)*pageSize,pageIndex*pageSize)"
@sort-change="sortChange">
......

<el-table-column prop="reserve" label="库存量" sortable='custom'></el-table-column>
......

sortChange(column) {
  this.pageIndex = 1; // 排序后返回第一页
  if (column.order === "descending") {
    this.tableData.sort((a, b) => b[column.prop] - a[column.prop]);
  } else if (column.order === "ascending") {
    this.tableData.sort((a, b) => a[column.prop] - b[column.prop]);
  }
}

```

https://segmentfault.com/q/1010000015100357?sort=created


