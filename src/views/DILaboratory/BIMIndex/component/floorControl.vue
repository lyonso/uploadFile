<template>
  <div :class='isOpen? "floorControl ":"floorControl close"'>
    <img v-if='chose===0' src='../../../../assets/icon_3D_hover.png' @click='changeChose(0)'>
    <img v-else src='../../../../assets/icon_3D.png' @click='changeChose(0)'>

    <img v-if='chose===1' src='../../../../assets/icon_qxsy_hover.png' @click='changeChose(1)'>
    <img v-else src='../../../../assets/icon_qxsy.png' @click='changeChose(1)'>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { EventBus } from '@/mapJs/EventBus'

export default {
  name: 'floorControl',
  data() {
    return {
      chose: 0
    }
  },
  computed: {
    ...mapState({
      isOpen: state => state.security.isOpen
    })
  },
  methods: {
    /**
     * 改变选中状态
     */
    changeChose(type) {
      if (type !== this.chose) EventBus.$emit('changeMap', type)
      this.chose = type
    }
  }
}
</script>

<style lang='less' scoped>
.floorControl {
  position: absolute;
  top: 110px;
  right: 470px;
  transition: right 1s;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  img {
    cursor: pointer;
    margin-bottom: 10px;
  }
}

.close {
  right: 30px;
  transition: right 1s;
}
</style>
