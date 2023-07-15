<template>
  <div>
    <div class='top'>
      <div class='top_tip'>
        <img src='@/assets/title-icon.png' alt=''>
        <span :class='chose===0? "chose":""' @click='chose=0'>水文</span>
        <span :class='chose===1? "chose":""' @click='chose=1'>水质</span>
        <img src='@/assets/line.png' alt=''>
      </div>
      <div class='top_center'>
        <div>监测断面：{{ mtitle }}</div>
        <div>监测时间：{{ taskTime.substring(0, 10) }}</div>
      </div>
    </div>


    <div class='down'>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { swszyDataAuto } from '@/api/baseInfo'

export default {

  props: {
    mtitle: {
      type: String,
      default: ''
    }

  },
  watch: {},
  computed: {
    ...mapState({
      taskTime: state => state.security.taskTime
    })
  },
  data() {
    return {
      showSW: true,
      showSZ: true,
      chose: 0,
      topData:{

      }
    }
  },
  methods: {
    personSWdata(data) {
      swszyDataAuto(data).then(res => {
        if (res.thwb_rtflow_info_getWxList_response.code == '10000') {
          let odata = []
          const records = res.thwb_rtflow_info_getWxList_response.data.records[0]
          this.mtitle = records.stnm
          odata = [
            { name: '水位', shuizhi: records['shuiwei'], tagUnit: 'm', type: 'shuiwei' },
            { name: '断面流量', shuizhi: records['dmll'], tagUnit: 'm3/s', type: 'liuliang' }
          ]
          this.shuizhidata = odata
        }
      })
    },
  }
}
</script>

<style lang='less' scoped>
.top {
  width: 430px;
  height: 380px;
  padding: 15px;
  background: rgba(4, 16, 27, 0.8);

  &_tip {
    :first-child {
      vertical-align: top;
    }

    span {
      color: #15CFF7FF;
      cursor: pointer;
      margin-left: 20px
    }

    :last-child {
      margin-left: 30px;
      width: calc(100% - 40px);
    }

    .chose {
      color: #3cb79c;
    }
  }

  &_center {
    font-size: 20px;

    div {
      margin: 10px 0 0 20px;
      color: #15CFF7FF
    }
  }
}
</style>
