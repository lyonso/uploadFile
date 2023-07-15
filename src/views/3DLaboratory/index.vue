<template>
  <div class='Laboratory'>
    <rightTop v-show='openDialog >= 0 && openDialog!==8' @openDialog='openDialogs' />
    <videoPlayer v-if='openDialog === 1 ' class='videoPlayer' />
    <rightBottom v-if='openDialog === 2 ' />
    <rightBottomOne v-if='openDialog === 3 ' />
    <rightBottomTwo v-if='openDialog === 4 ' />
    <right_bottomThree v-if='openDialog === 5 ' />
    <right_bottomFour v-if='openDialog === 6' />
    <right_BottomFive v-if='openDialog === 7' />
    <accessRecord v-if='openDialog === 8' />
  </div>
</template>
<script>
import videoPlayer from './components/Dialog/videoPlayer'
import rightTop from './components/right_top'
import rightBottom from './components//Dialog/right_bottom'
import rightBottomOne from './components//Dialog/right_bottomOne'
import rightBottomTwo from './components//Dialog/right_bottomTwo'
import right_bottomThree from './components//Dialog/right_bottomThree'
import right_bottomFour from './components//Dialog/right_bottomFour'
import right_BottomFive from './components//Dialog/right_BottomFive'
import accessRecord from './components//Dialog/accessRecord'
import { map } from '@/api'
import { mapGetters } from 'vuex'

export default {
  name: 'monitor',
  components: {
    videoPlayer,
    rightTop,
    rightBottom,
    rightBottomOne,
    rightBottomTwo,
    right_bottomThree,
    right_bottomFour,
    right_BottomFive,
    accessRecord
  },
  data() {
    return {
      dialogVisible: false,
      isOpen: true,
      timer: ''

    }
  },
  computed: {
    ...mapGetters([
      'openDialog',
      'alarmList'
    ])
  },
  mounted() {
    this.getEnvironmentWarning()
    this.timer = setInterval(() => {
      this.getEnvironmentWarning()
    }, 1800000)
  },
  created() {
    this.$store.dispatch('map/setMapState', 2)
  },
  beforeDestroy() {
    this.$store.dispatch('map/setOpenDialog', -1)
    this.$store.dispatch('map/setShowModel', false)
    this.$store.dispatch('map/setBuildingControl', '-1')
    this.$store.dispatch('map/equipmentId', '')
    clearInterval(this.timer)
  },
  methods: {
    openDialogs(type) {
      this.isOpen = type
    },
    getEnvironmentWarning() {
      map.getEnvironmentWarning().then(res => {
        let arr =  res.data.wsd.concat(res.data.kqzl)
        let obj = {}
        let newArray = arr.reduce((pre, cur) => {
          if (!obj[cur.DeviceID]) {
            obj[cur.DeviceID] = true
            pre.push(cur)
          }
          return pre
        }, [])
        this.$store.dispatch('ThreeDLaboratory/setwsdList', res.data.wsd)
        this.$store.dispatch('ThreeDLaboratory/setkqzlList', res.data.kqzl)
        this.$store.dispatch('ThreeDLaboratory/setDuplicateList', newArray)
      })
    }
  }
}

</script>

<style lang='less' scoped>
.Laboratory {
  position: absolute;
  height: 0;
  width: 0;
  z-index: 10;
}

.videoPlayer {
  position: absolute;
  top: 470px;
  left: 300px;
}

.open {
  img {
    width: 24px;
  }

  position: absolute;
  top: 95px;
  left: 1896px;
  cursor: pointer;
  transform: rotate(180deg);
}

.button_list {
  text-align: right;
  width: 31px;
  position: absolute;
  top: 110px;
  left: 1856px;

  div {
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    border: 3px solid #001825;
    border-radius: 50%;
    background: rgba(5, 48, 63, 0.9);
    color: #FFFFFF;
    font-size: 14px;
    margin-bottom: 8px;
    position: relative;
  }

  div::after {
    display: block;
    content: '';
    position: absolute;
    width: 10px;
    height: 14px;
    background: #001825;
    left: 8px;
  }

  span {
    cursor: pointer;
  }

  > :last-child::after {
    display: none;
  }

  .chose {
    width: 141px;
    left: -110px;
    background: #001825;
    border-radius: 14px !important;

    span {
      background: rgba(5, 47, 63, 0.9);
      margin-left: 2px;
      display: inline-block;
      width: 25px;
      height: 25px;
      line-height: 25px;
      background: rgba(5, 47, 63, 0.9);
      opacity: 0.95;
      border-radius: 50%;
      font-size: 14px;
    }

    :first-child {
      margin-left: 0px;
    }

    //:last-child{
    //  background: rgba(2, 116, 147, 0.9);;
    //}
  }

  .chose::after {
    left: 117px;
  }
}
</style>

