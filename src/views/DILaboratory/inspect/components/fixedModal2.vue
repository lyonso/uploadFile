<template>
  <div class='modal-container' v-if='value'>
    <div class='dialogTitle'>
      <div>
        <div class='split' />
        <span class='title'>{{ title }}</span>
      </div>
      <img src='@/assets/inspect/close.png' alt='' class='close' @click='closeDialog' />
    </div>
    <div class='modal-content'>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FixedModal2',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Boolean,
    title: {
      type: String,
      default: '详细信息'
    }
  },
  data() {
    return {}
  },
  methods: {
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.$emit('change', false)
      this.$store.commit('inspect/SET_DIALOG_VISIBLE', false)
    }
  }
}
</script>

<style lang='less' scoped>
.modal-container {
  position: absolute;
  left: 1%;
  top: 10%;
  width: 60%;
  height: 80%;
  background: url("~@/assets/inspect/modal_bg.png") no-repeat;
  background-size: cover;
  z-index: 999999;

  .dialogTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px 10px 30px;

    .split {
      width: 4px;
      height: 22px;
      background: #00CCFF;
      display: inline-block;
      margin-right: 10px;
      position: relative;
      top: 4px;
    }

    .title {
      font-size: 20px;
      font-weight: 500;
      color: #FFFFFF;
    }

    .close {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }

  .modal-content {
    padding: 0 30px;
  }
}
</style>
