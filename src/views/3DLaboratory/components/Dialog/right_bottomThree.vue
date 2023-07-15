<template>
  <div class='details'>
    <div>
      <div class='dialogTitle'>
        <img src='../../../../assets/icon_title.png'>
        <span>详细信息</span>
        <i class='el-icon-close close' @click='closeDialog'></i>
      </div>
      <div class='body'>
        <img v-if='chose===1&&modelId=="22"' src='../../../../assets/yq.png'>
        <img v-if='chose===1&&modelId=="30"' src='../../../../assets/yq_1.png'>
        <img v-if='chose===1&&modelId=="31"' src='../../../../assets/yq_2.png'>

        <div :style="{'width': (chose == 1 ? ' calc(100% - 300px)':'100%')}">
          <div class='top'>
            <span :class="chose===1? 'chose':''" @click='chose=1'>仪器简介</span>
            <span :class="chose===4? 'chose':''" @click='chose=4'>视频介绍</span>
            <span :class="chose===2? 'chose':''" @click='chose=2'>监测数据</span>
            <span :class="chose===3? 'chose':''" @click='chose=3'>检定信息</span>
          </div>
          <div v-if='chose===1' class='introduce'>
            <div class='introduce' v-html='details.introduction' />
          </div>
          <div v-if='chose===2'>
            <el-row class='List'>
              <div class='list_top'>
                <el-col class='borderLine' :span='7'>采样日期</el-col>
                <el-col class='borderLine' :span='5'>点位名称</el-col>
                <el-col class='borderLine' :span='6'>监测指标</el-col>
                <el-col class='borderLine noLine' :span='6'>分析结果</el-col>
              </div>
              <div v-for='(item,index) in list' class='item' :key='index'>
                <el-col class='borderLine' :span='7'>{{ item['采样日期'] }}</el-col>
                <el-col class='borderLine' :span='5'>{{ item['点位名称'] }}</el-col>
                <el-col class='borderLine' :span='6'>{{ item['SINONYM'] }}</el-col>
                <el-col class='borderLine  noLine' :span='6'>{{ item['分析结果'] }}/{{ item['单位'] }}</el-col>
              </div>
            </el-row>
          </div>
          <div v-if='chose===4'>
            <video v-if='modelId=="22"' width='400' height='240' controls style='display: block;margin: 0 auto'>
              <source src='http://10.8.45.67:8888/vedio/20220415171936.mp4' type='video/mp4'>
            </video>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DialogTitle from '@/components/DialogTitle'
import { map } from '@/api'
import { EventBus } from '@/mapJs/EventBus'
import { mapGetters } from 'vuex'

export default {
  name: '',
  components: {
    DialogTitle
  },
  watch: {
    modelId(val) {
      if (val == '') {
        this.details = {}
      } else {
        this.introductionId()
      }
    },
    equipmentId(val) {
      this.FRESULTS()
    }
  },
  data() {
    return {
      details: {},
      moveDataelse: {
        x: null,
        y: null
      },
      chose: 1,
      list: []
    }
  },
  computed: {
    ...mapGetters([
      'buildingControl',
      'modelId',
      'equipmentId'
    ])
  },
  mounted() {
    EventBus.$emit('setLookDown', '')
    this.introductionId()
    this.FRESULTS()

  },
  beforeDestroy() {
    EventBus.$emit('floor', this.buildingControl)
  },
  methods: {
    closeDialog() {
      this.$store.dispatch('map/setOpenDialog', 0)
    },
    // 获取简介
    introductionId() {
      map.introductionId(this.modelId).then(res => {
        this.details = res.data
      })
    },
    // 获取仪器数据
    FRESULTS() {
      if (this.equipmentId != '') {
        map.FRESULTS({ code: this.equipmentId }).then(res => {
          this.list = res.data
        })
      }
    }
  }
}
</script>
<style lang='less' scoped>
.details {
  position: absolute;
  top: 468px;
  left: 300px;
  width: 1200px;
  background: rgba(2, 19, 30, 0.6);

  .introduce {
    padding: 15px;
    font-size: 20px;
    font-family: PingFang SC;
    color: #FFFFFF;
    line-height: 36px;
  }
}

.dialogTitle {
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

.body {
  padding-left: 20px;

  img {
    display: inline-block;
    width: 300px;
    vertical-align: top;
    margin: 100px 0 20px 0;
  }

  > div {
    display: inline-block;
    //width:;
  }
}

.top {
  margin: 16px 33px;
  height: 40px;
  border: 1px solid rgba(0, 235, 253, 0.34);
  border-radius: 20px;
  color: #FFFFFF;

  span {
    display: inline-block;
    width: 24%;
    height: 38px;
    text-align: center;
    cursor: pointer;
    line-height: 40px;
  }

  .chose {
    border: 1px solid rgba(0, 235, 253, 0.34);
    background: rgba(179, 250, 255, 0.34);
    border-radius: 20px;
  }
}

.close {
  float: right;
  margin-top: 16px;
  margin-right: 20px;
  cursor: pointer;
}

.List {
  margin-top: 2px;
  margin-bottom: 10px;
}

.list_top {
  color: #02ECEF;
  text-align: center;
  height: 36px;
  line-height: 36px;
}

.item {
  color: #fff;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  //font-size: 14px;
  //margin: 8px 0 8px 4px;
}

.borderLine {
  border-bottom: 1px solid #72827E;
  border-right: 1px solid #72827E;
}

.noLine {
  border-right-width: 0px;
}

.item:last-child {
  height: 30px;
}

</style>
