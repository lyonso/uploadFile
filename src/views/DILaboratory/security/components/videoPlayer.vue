<template>
  <div class='Player'>
    <div class='dialogTitle'>
      <div class='chose'>
        <div />
      </div>
      <span>视频监控</span>
      <i class='el-icon-close close' @click='closeDialog' />
    </div>
    <videoPlayer videoName='name' :monitorDeviceNo='videoID.relationId' :playHeight='400' :width='600' />
  </div>
</template>
<script>
import videoPlayer from '@/components/video'
import { mapGetters, mapState } from 'vuex'
import { EventBus } from '@/mapJs/EventBus'
import { DILaboratory } from '@/api'

export default {
  components: {
    videoPlayer
  },
  watch: {
    videoID: {
      deep: true,
      handler() {
        if (this.videoID.eventNum > 0) this.cameraAI()
      }
    }
  },
  data() {
    return {
      details: {}
    }
  },
  mounted() {
    EventBus.$emit('setLookDown', '')
    if (this.videoID.eventNum > 0) this.cameraAI()
  },
  beforeDestroy() {
    if (this.videoID.eventNum > 0) this.$store.dispatch('security/setCloseDialog', true)
  },
  computed: {
    ...mapState({
      videoID: state => state.security.videoID
    })
  },
  methods: {
    closeDialog() {
      this.$store.commit('security/SET_OPENDIALOG', 0)
    },
    cameraAI() {
      DILaboratory.cameraAI({ modelDeviceId: this.videoID.id }).then(res => {
        this.details = res.data
        DILaboratory.readByCamera({ modelDeviceId: res.data.id })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.Player {
  position: absolute;
  top: 400px;
  left: 273px;
  //width: 800px;
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
  display: inline-block;
  height: 100%;
  vertical-align: top;
  background: rgba(2, 19, 30, 0.6);
  color: #fff;

  img {
    height: 200px;
    margin-left: 10px;
  }

  > :last-child {
    display: inline-block;
    vertical-align: top;
    padding: 10px;

    div {
      margin-bottom: 20px;
    }
  }

}
.nogj{
  vertical-align: top;
  width: 400px;
  text-align: center;
  height: 100%;
  font-size: 35px;
  line-height: 206px;
  color: rgb(21, 92, 135);
  display: inline-block;
}

</style>
