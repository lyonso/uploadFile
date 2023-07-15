<template>
  <div class='container'>
    <div class='tool-box' :class='isOpen ? "" : "close"'>
      <!--隐藏/展示切换-->
      <div class='visibleBtn'>
        <img v-show='isOpen' src='@/assets/closePanel.png' alt='' @click='isOpen = false' />
        <img v-show='!isOpen' src='@/assets/openPanel.png' alt='' @click='isOpen = true' />
      </div>

      <dialog-title dialog-title='环境监测' />

      <record />

      <record-list />

      <machine />

      <days />

      <div class='checkList'>
        <check-list />
      </div>

    </div>

    <modal v-if='visible' />

    <warn-modal v-if='vb' />
  </div>
</template>

<script>
import DialogTitle from '@/components/DialogTitle'
import { record, recordList, machine, days, checkList, modal, warnModal } from './components'
import bus from '@/bus'
import _ from 'lodash'

export default {
  name: 'Environment',
  components: {
    DialogTitle,
    record,
    recordList,
    machine,
    days,
    checkList,
    modal,
    warnModal
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.state.environment.isOpen
      },
      set(val) {
        this.$store.commit('environment/SET_OPEN', val)
      }
    },
    visible: {
      get() {
        return this.$store.state.environment.visible
      },
      set(val) {
        this.$store.commit('environment/SET_VISIBLE', val)
      }
    },
    vb: {
      get() {
        return this.$store.state.environment.vb
      },
      set(val) {
        this.$store.commit('environment/SET_VB', val)
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    handleMsg: _.throttle(function(message) {
      console.log(message)
      this.$store.dispatch('environment/eventNum')
      this.$store.dispatch('environment/singleRoom')
    }, 300)
  },
  mounted() {
    this.$store.dispatch('environment/getCurrentTime')
    this.$store.dispatch('map/setMapState', 7)
    this.$store.dispatch('environment/eventNum')
    this.$store.dispatch('environment/tempAndHumiRange')
    this.$store.dispatch('environment/singleRoom')

    bus.on('hjjk', this.handleMsg)
    window.addEventListener('beforeunload', () => {
      bus.removeListener('hjjk', this.handleMsg)
    })
  },
  beforeDestroy() {
    bus.removeListener('hjjk', this.handleMsg)
  }
}
</script>

<style lang='less' scoped>
.container {
  //height: 100vh;
  position: relative;
  z-index: 9;

  .tool-box {
    position: absolute;
    right: 20px;
    top: 110px;
    width: 422px;
    height: 978px;
    border: 1px solid rgba(229, 229, 229, 0.31);
    transition: right 300ms ease-in-out;
    background: RGBA(9, 34, 48, .65);

    &.close {
      right: -424px !important;
    }

    .visibleBtn {
      position: absolute;
      left: -20px;
      cursor: pointer;

      img {
        width: 20px;
        height: 40px;
        transform: rotate(180DEG);
        transition: all 200ms linear;
      }
    }
  }

  .checkList {
    position: absolute;
    right: 450px;
    top: 50px;
  }
}

::v-deep .el-dialog {
  background: transparent !important;
}
</style>
