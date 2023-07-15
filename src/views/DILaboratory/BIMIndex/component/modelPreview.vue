<template>
  <div class='ModelPreview'>
    <div class='dialogTitle'>
      <img src='../../../../assets/icon_title.png'>
      <span>模型预览</span>
      <i class='el-icon-close close' @click='closeDialog' />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModelPreview',
  data() {
    return {}
  },
  methods: {
    /**
     * 关闭弹窗
     */
    closeDialog() {

    }
  }
}
</script>

<style lang='less' scoped>
.ModelPreview {
  position: absolute;
  top: 206px;
  right: 600px;
  width: 300px;
  background: rgba(2, 19, 30, 0.6);

}

.dialogTitle {
  position: relative;
  background: rgba(0, 51, 76, 0.49);
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  > :first-child {
    margin: 12px;
    vertical-align: top;
  }
}

.close {
  float: right;
  margin-top: 16px;
  margin-right: 20px;
  cursor: pointer;
}
</style>
