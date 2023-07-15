<template>
  <div class='dialogTitle'>
    <span class="titleBox">
      {{ dialogTitle }}
    </span>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'dialogTitle',
  props: {
    dialogTitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang='less' scoped>
.dialogTitle {
  background: #2A3E41;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  .titleBox:before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 20px;
    background: #00CCFF;
    vertical-align: top;
    margin: 10px;
  }
}
</style>




