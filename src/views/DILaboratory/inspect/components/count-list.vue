<template>
  <div>
    <el-table
      :data='list'
      height='360px'
    >
      <el-table-column type='index' label='序号' width='60' />
      <el-table-column
        v-for='(item, index) in head'
        :key='index'
        :label='item.label'
        :width='item.width'
        :prop='item.prop'
        show-overflow-tooltip
      >
        <template slot-scope='{row,column,$index}'>
          <span v-if='item.initDate'>{{row[item.prop] | initTime}}</span>
          <span v-else>{{row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'count-list',
  props: {
    head: {
      type: Array,
      defaule: () => ([])
    },
    list: {
      type: Array,
      defaule: () => ([])
    }
  }
}
</script>

<style lang='less' scoped>
/deep/ .el-table::before{
  background-color:transparent;
}

/deep/ .el-table{
  background-color:transparent;
}
/deep/ .el-table th.el-table__cell>.cell{
  height: 25px;
  font-size: 16px;
  font-weight: 400;
  color: #9CCDFB;
}
/deep/ .el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf{
  padding: 5px;
  margin: 0;
}
/deep/ .el-table tr {
  background-color: transparent;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
  background-color: transparent;

}

/deep/ .el-table tr:nth-child(2n) {
  background-color: rgba(16, 62, 98, 0.5);
}

/deep/ .el-table tr:nth-child(2n+1) {
  background-color: rgba(48, 100, 145, 0.5);
}

/deep/ .el-table th.el-table__cell{
  background-color: rgba(16, 62, 98, 0.5);
}
</style>
