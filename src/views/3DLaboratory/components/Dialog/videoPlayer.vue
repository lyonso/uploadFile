<template>
  <div class='Player'>
    <div class='dialogTitle'>
      <div class='chose'>
        <div />
      </div>
      <span>视频监控</span>
      <i class='el-icon-close close' @click='closeDialog' />
    </div>
    <videoPlayer style='display: inline-block' :monitorDeviceNo='videoCode' :width='400' />
    <div class='body_right'>
      <div> AI 识别：建设中</div>
    </div>
<!--    <div class='gj' v-if='videoCode==="bcd536a1dcda4583916b7ed421899b2d"'>-->
<!--      <img src='@/assets/img_cr.png' alt='' />-->
<!--      <div>告警类型：闯入</div>-->
<!--      <div>告警时间：2022/04/15</div>-->
<!--      <div>告警结果：2号摄像头发送人员闯入告警</div>-->
<!--    </div>-->
  </div>
</template>
<script>
import videoPlayer from '@/components/video'
import { mapGetters } from 'vuex'
import { EventBus } from '@/mapJs/EventBus'

export default {
  components: {
    videoPlayer
  },
  mounted() {
    EventBus.$emit('setLookDown', '')
  },
  computed: {
    ...mapGetters([
      'videoCode',
    'buildingControl'
    ])
  },
  beforeDestroy() {
    EventBus.$emit('floor', this.buildingControl)
  },
  methods: {
    closeDialog() {
      this.$store.dispatch('map/setOpenDialog', 0)
    }
  }
}
</script>

<style lang='less' scoped>
.Player {
  width: 800px;
  background: rgba(0, 0, 0, 0.3);
}

.dialogTitle {
  background: #2A3E41;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 255, 241, 1);

  .chose {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1px solid #0BF0F0;
    border-radius: 50%;
    vertical-align: middle;
    margin-left: 10px;
    margin-right: 10px;

    div {
      width: 6px;
      height: 6px;
      margin: 3px;
      border-radius: 50%;
      background: #0BF0F0;
    }
  }

  .close {
    float: right;
    margin-top: 16px;
    margin-right: 20px;
    cursor: pointer;
    color: #FFFFFF;
  }
}

.gj {
  padding-bottom: 10px;
  background: rgba(2, 19, 30, 0.6);

  img {
    width: 100%;
    margin: 8px auto 4px;
  }

  color: #fff;

  div {
    margin: 4px;
    font-size: 18px;
    font-weight: 500;
  }
}

.body_right {
  display: inline-block;
  width: calc(100% - 400px);
  margin-top: 90px;
  text-align: center;
  color: #fff;
  vertical-align: top;
}

</style>
