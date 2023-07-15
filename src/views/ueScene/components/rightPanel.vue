<template>
  <div :class='isOpen? "rightPanel ":"rightPanel close"'>
    <DialogTitle dialogTitle='资质与能力' />
    <div class='panel_Top'>
      <div v-for='(item,index) in list' :key='item.value' :style='item.img' class='item'>
        <div>{{ item.name }}</div>
        <div>{{ item.value }}</div>
      </div>
      <img src='../../../assets/zhengshu.png'>
    </div>
    <DialogTitle dialogTitle='服务流域治理与管理' />
    <div class='panel_Center'>
      <img src='../../../assets/BIMIndex_icon5.png'>
      {{ text }}
    </div>
    <DialogTitle dialogTitle='近期检测业务量' />
    <lineEcharts />
    <!--    收缩图片-->
    <img v-if='isOpen' @click='closeDialog(false)' src='../../../assets/closePanel.png'>
    <img v-else @click='closeDialog(true)' src='../../../assets/openPanel.png'>
  </div>
</template>

<script>
import DialogTitle from '@/components/DialogTitle'
import lineEcharts from '../Echarts/lineEcharts'
import { mapState } from 'vuex'
import { EventBus } from '@/mapJs/EventBus'

const list = [
  {
    name: '资质认证',
    value: 'CMA 216项',
    img: {
      backgroundImage: 'url(' + require('../../../assets/BIMIndex_icon1.png') + ')',
      backgroundSize: '100% 100%'
    }
  },
  {
    name: '水体类型',
    value: '地表水、地下水和饮用水',
    img: {
      backgroundImage: 'url(' + require('../../../assets/BIMIndex_icon1.png') + ')',
      backgroundSize: '100% 100%'
    }
  },
  {
    name: '监测指标',
    value: '常态化开展水质、蓝藻、富营养化、底栖动物、鱼类等',
    img: {
      backgroundImage: 'url(' + require('../../../assets/BIMIndex_icon2.png') + ')',
      backgroundSize: '100% 100%'
    }
  },
  {
    name: '大型检测仪器  120余台',
    value: '配备气相色谱质谱联用仪、气相色谱仪、液相色谱仪等',
    img: {
      backgroundImage: 'url(' + require('../../../assets/BIMIndex_icon2.png') + ')',
      backgroundSize: '100% 100%'
    }
  }
]
const text = '数据积累超过25年，其中全指标和底栖动物、鱼类等数据有近10年，多年来持续为流域治理管理提供 水资源数量、水资源质量、水生态健康状' +
  '况信息，在服务水资源水生态调度、供水安全、省际涉水利益关系协调、河湖治理见成效评估等方面发挥了尖兵和耳目的作用。'
export default {
  components: {
    DialogTitle,
    lineEcharts
  },
  computed: {
    ...mapState({
      isOpen: state => state.security.isOpenTwo
    })
  },
  data() {
    return {
      list,
      text,
      modelStatus: 0,
      modelStatus1: false
    }
  },
  methods: {
    /**
     * 左侧收缩
     * @param status
     */
    closeDialog(status) {
      this.$store.commit('security/SET_ISOPENTWO', status)
    }
  }
}
</script>

<style lang='less' scoped>
.rightPanel {
  position: absolute;
  top: 110px;
  right: 20px;
  background: rgba(11, 37, 50, 0.8);
  width: 422px;
  //height: 978px;
  border: 1px solid rgba(229, 229, 229, 0.31);
  transition: right 1s;
  z-index: 999;
  //background-image: url("");
  > img {
    position: absolute;
    transform: rotateY(180deg);
    top: 0;
    width: 20px;
    left: -20px;
    cursor: pointer;
  }
}

.close {
  right: -425px;
  transition: right 1s;
}

.item {
  position: relative;
  margin: 20px 11px;
  padding-left: 49px;
  font-size: 13px;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 22px;
}

.panel_Top {
  position: relative;

  img {
    width: 98px;
    height: 120px;
    position: absolute;
    right: 10px;
    top: 0;
  }

  > :first-child,
  > :nth-child(2) {
    width: 58%;
  }

  > :first-child,
  > :nth-child(3) {
    :first-child {
      color: rgba(22, 173, 223, 1);
    }
  }

  > :nth-child(2),
  > :nth-child(4) {
    :first-child {
      color: rgba(0, 240, 255, 1);
    }
  }
}

.panel_Center {
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 25px;
  padding: 15px;

  img {
    margin: 0 15px 13px 0;
    float: left;
    cursor: pointer;
  }
}
</style>
