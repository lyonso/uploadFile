<template>
  <div class='stationDetails'>
    <DialogTitle dialogTitle='自动监测站详情' />
    <RightTop @changeStatus='changeStatus' />
    <div v-if='showContent'>
      <RightCenter />
      <RightBottom />
      <RightImg />
    </div>
    <div class='mapControl'>
      <div :class='mapState==4? "chose":""' @click='changeMapStatus(4)'>
        <img src='../../../assets/map_status.png'>
        <div>矢量地图</div>
      </div>
      <div :class='mapState==5? "chose":""' @click='changeMapStatus(5)'>
        <img src='../../../assets/map_status2.png'>
        <div>倾斜影像</div>
      </div>
    </div>
  </div>
</template>
<script>
import DialogTitle from '@/components/DialogTitle'
import RightTop from './components/rightTop'
import RightCenter from './components/rightCenter'
import RightBottom from './components/rightBottom'
import RightImg from './components/rightImg'
import { mapGetters } from 'vuex'

export default {
  name: 'stationDetails',
  components: {
    DialogTitle,
    RightTop,
    RightCenter,
    RightBottom,
    RightImg
  },
  data() {
    return {
      showContent: true,
      chose: 1
    }
  },

  computed: {
    ...mapGetters([
      'mapState'
    ])
  },
  methods: {
    changeStatus(data) {
      if (data.flag) {
        this.showContent = false
      } else {
        this.showContent = true
      }
    },

    changeMapStatus(type) {
      this.$store.dispatch('map/setMapState', type)
    }
  }
}

</script>

<style lang='less' scoped>
.stationDetails {
  position: absolute;
  background: rgba(11, 37, 50, 0.64);
  top: 90px;
  left: 1190px;
  z-index: 10;
  width: 708px;
  border: 1px solid rgba(229, 229, 229, 0.56);
}

.mapControl {
  position: absolute;
  top: calc(100vh - 220px);
  left: -1100px;

  > div {
    display: inline-block;
    width: 78px;
    margin-right: 20px;
    cursor: pointer;
    border: 2px solid #89939A;
    border-radius: 8px;

    img {
      border-bottom: 2px solid #89939A;
      border-radius: 8px;
    }

    div {
      color: #fff;
      text-align: center;
      line-height: 24px;
      //border: 2px solid #89939A;
    }


  }

  .chose {
    color: #00FBFF;
    border-color: #00FBFF;


    img {
      border-color: #00FBFF;
    }
  }
}
</style>

