<template>
  <div>
    <dialog-title dialog-title='近7日环境指标小时走势' />
    <div class='t'>
      <label>甲醛：<span class='a'>{{ standard.CH2O }}</span></label>
      <label>VOC：<span class='b'>{{ standard.VOC }}</span></label>
<!--      <label>甲醛：<span class='c'></span></label>-->
<!--      <label>VOC：<span class='d'></span></label>-->
    </div>

    <div class='charts'>
      <line-echart />
    </div>
  </div>
</template>

<script>
import DialogTitle from '@/components/DialogTitle'
import lineEchart from './lineEchart'
import { mapState } from 'vuex'

export default {
  name: 'Days',
  components: {
    DialogTitle,
    lineEchart
  },
  computed: {
    ...mapState({
      standard: state => state.environment.standard
    })
  },
  data() {
    return {

    }
  }
}
</script>

<style lang='less' scoped>
.t {
  display: flex;
  align-items: center;
  padding: 10px 30px;

  label {
    font-size: 15px;
    font-family: PingFang SC;
    color: #F5FDFD;
    width: 50%;

    span {
      font-size: 27px;
      font-family: PingFang SC;
      font-weight: bold;
      font-style: italic;

      &.a {
        color: #31D3F3;
      }

      &.b {
        color: #F33131;
      }

      &.c {
        width: 35px;
        height: 4px;
        background: #16ADDF;
        display: inline-flex;
        top: -3px;
        position: relative;
      }

      &.d {
        width: 35px;
        height: 4px;
        background: #F33131;
        display: inline-flex;
        top: -3px;
        position: relative;
      }
    }
  }
}

.charts {
  padding-top: 10px;
}
</style>