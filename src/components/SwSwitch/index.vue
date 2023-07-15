<template>
  <el-switch class='SwSwitch' :value='value' @change='change' />
</template>

<script>
export default {
  name: 'SwSwitch',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Boolean
  },
  methods: {
    change(val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style lang='less'>
@primary: #00F6FF;
@close: #959F9F;

.el-switch.SwSwitch {

  &.is-checked {

    .el-switch__core {
      border-color: @primary !important;
      background-color: transparent !important;

      &:after {
        background-color: @primary !important;
      }
    }
  }

  .el-switch__core {
    border: 1px solid @close;
    background-color: transparent;

    &:after {
      background-color: @close;
    }
  }
}
</style>
