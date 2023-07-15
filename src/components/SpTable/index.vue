<template>
  <div class='sp-table'>
    <div class='thead'>
      <div class='th' :class='`mw-${item.width}`' v-for='(item, index) in columns' :key='`title-${index + 1}`'>{{ item.label }}</div>
    </div>
    <el-scrollbar :style='`height: ${height}px`' class='scroll' v-if='list.length > 0'>
      <div class='tbody' v-for='(item, index) in list' :key='`tr-${index + 1}`' :class='[index % 2 === 0 ? "highlight" : "", checkSelected && checkSelected(item, index) ? "selected" : ""]' @click='$emit("detail", item, index)'>
        <div class='td hideText-1' :class='`mw-${val.width}`' :title='item[val.prop]' v-for='(val, idx) in columns' :key='`prop-${idx + 1}`'>{{ item[val.prop] }}</div>
      </div>
    </el-scrollbar>
    <div v-else :style='`height: ${height}px`' class='empty'>暂无数据</div>
  </div>
</template>

<script>
export default {
  name: 'SpTable',
  props: {
    height: Number,
    list: Array,
    columns: Array,
    checkSelected: Function
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>
