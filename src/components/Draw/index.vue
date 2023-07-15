<template>
  <div :class='isOpen? "rightPanel ":"rightPanel close"'>
    <slot></slot>
    <img v-if='isOpen' @click='closeDialog(false)' src='../../assets/closePanel.png'>
    <img v-else @click='closeDialog(true)' src='../../assets/openPanel.png'>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    closeDialog(type) {
      this.$emit('changOpen', type)
    }
  }
}
</script>

<style lang='less' scoped>
.rightPanel {
  position: absolute;
  top: 110px;
  right: 20px;
  background: rgba(11, 37, 50, 0.8);
  width: 422px;
  border: 1px solid rgba(229, 229, 229, 0.31);
  z-index: 10;
  transition: right 1s;

  > img {
    position: absolute;
    transform: rotateY(180deg);
    top: 0;
    width: 20px;
    left: -20px;
    cursor: pointer;
  }


  .isOpen {
    color: rgba(0, 246, 255, 1);
  }

}


.close {
  right: -422px;
  transition: right 1s;
}
</style>
