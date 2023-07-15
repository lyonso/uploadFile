<template>
  <div>
    <!--流程节点-->
    <flow-points />

    <!--动态组件-->
    <component :is='currentCom' @openDialog='openDialog' />

    <fixed-modal v-model='visible' :title='visibleTitle'>
      <sp-table
        :height='300'
        :list='componentData.list'
        :columns='componentData.head'
      />
    </fixed-modal>

    <!--静态弹窗-->
    <fixed-modal v-model='dialogVisible' :title='visibleTitles'>
      <!--ADCP遥控船-->
      <div v-if='visibleTitles==="ADCP遥控船"' class='dialog_center ADCP'>
        <el-scrollbar style='height: 360px' class='scroll'>
          <img src='../../../assets/ADCP_1.png' />
          &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;利用遥控电动船可携带走航式声学多普勒剖面仪、多参数水质仪、采样设备等各类仪
          器，完成流量流速检测、水质在线监测和水下地形地貌测绘等任务
          <img src='../../../assets/ADCP_2.png' />
          &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;手持式电波流速仪：主要用于野外巡测和洪水、溃坝、决口、泥石流等应急测量，尤
          其适用于汛期抢测洪峰，其优点是自动化程度高、性能可靠、工作稳定。
        </el-scrollbar>
      </div>
      <!--无人船-->
      <div v-else-if='visibleTitles==="无人船"' class='dialog_center WRC'>
        <el-scrollbar style='height: 360px' class='scroll'>
          <img src='../../../assets/WRC_1.png' />
          <img src='../../../assets/WRC_2.png' />
          &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;无人船搭载DT-X多功能回声探测仪监测调查太湖水草<br>
          &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;检测原理：将电子信号转换成声音脉冲并发射到水中，并根据回声信号，检测目标物，具备检测沉水
          植物盖度、底质类型及鱼类功能。<br>
          <img src='../../../assets/WRC_3.png' />
          <img src='../../../assets/WRC_4.png' />
          &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;2018年以来，连续多年开展太湖贡湖、东太湖等水域沉水植物调查。
        </el-scrollbar>
      </div>
      <!--水生态检测区-->
      <div v-else-if='visibleTitles==="生态指标检测区"' class='dialog_center SSTJCQ'>
        <el-scrollbar style='height: 360px' class='scroll'>
          <div class='dialog_top'>
            <span :class='chose===1? "chose":""' @click='chose=1' class=''>藻类在线监测</span>
            <span :class='chose===2? "chose":""' @click='chose=2'>致嗅藻类检测</span>
          </div>
          <div v-if='chose===1'>
            <img class='img1' src='../../../assets/SSTJCQ_1.png' />
            <div>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;流式细胞仪：实现藻类检测的自动化操作</div>
            <img class='img1' src='../../../assets/SSTJCQ_2.png' />
            <div>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;检测原理：藻体高速列队通过激光照射区，通过光学特征（荧光）结合拍摄的藻体影像，提供藻体的外形、 结构与色素体信息。</div>
            <img class='img2' style='margin-right: 10px' src='../../../assets/SSTJCQ_3.png' />
            <img class='img2' src='../../../assets/SSTJCQ_4.png' />
            <div style='margin-bottom: 20px'>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;应用情况：实时监控贡湖水源地的藻类数量与变化情况，多次及时反映贡湖藻类情况，为供水安全、引江
              济太调度提供数据支撑。
            </div>
          </div>
          <div v-else>
            <img class='img1' src='../../../assets/SSTJCQ_5.png' />
            <div>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;制片：采用抽滤萃取法进行样本制备</div>
            <img class='img1' src='../../../assets/SSTJCQ_6.png' />
            <div>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;鉴定与计数：采用斜对角视野法，根据监测目的分别选取常规检测计数法或快速检测计数法。</div>
            <el-carousel :interval='4000' type='card' height='200px'>
              <el-carousel-item v-for='item in imglist' :key='item.name'>
                <img class='img3' :src='item.bg'>
                <div class='img_text'>{{ item.name }}</div>
              </el-carousel-item>
            </el-carousel>
            <div>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;主要针对颤藻属、束丝藻、伪鱼腥藻进行计数统计。</div>

          </div>
        </el-scrollbar>
      </div>
      <!--有机检测区-->
      <div v-else-if='visibleTitles==="有机指标检测区"' class='dialog_center YJJCQ'>
        <el-scrollbar style='height: 360px' class='scroll'>
          <div style='margin: 10px 0'>1、藻类在线监测（贡湖水源地）</div>
          <img src='../../../assets/YJJCQ_1.png' />
          <div>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;2021年8月19日，金泽水库太浦河取水口2-MIB（二甲基异莰醇）浓度出现异常，监测中心持续监测35天，形成和上
            报监测数据约5000组。
          </div>
          <img src='../../../assets/YJJCQ_2.png' />
          <div>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;检测原理：顶空富集、固相微萃取纤维吸附样品中的土臭素和2-MIB,解析后气相色谱-质谱联用仪测定。</div>
        </el-scrollbar>
      </div>
      <!--有机检测区-->
      <div v-else-if='visibleTitles==="现场数据采集处理"'>
        <video width='460' height='350' controls>
          <source src='http://10.8.45.67:8888/vedio/23f92968cfc3af92912e0ed3dab99907.mp4' type='video/mp4'>
          您的浏览器不支持 video 标签。
        </video>
        <video></video>
      </div>
    </fixed-modal>
  </div>
</template>

<script>
import {
  flowPoints,
  CountBox,
  fixedModal,
  MonitorTask,
  TaskCommitment,
  MonitoringAnalysis,
  countList,
  collectionData
} from '@/views/DILaboratory/inspect/components'
import SpTable from '@/components/SpTable'

import { mapState } from 'vuex'

export default {
  name: 'Inspect',
  components: {
    flowPoints,
    CountBox,
    fixedModal,
    MonitorTask,
    TaskCommitment,
    MonitoringAnalysis,
    countList,
    collectionData,
    SpTable
  },
  computed: {
    ...mapState({
      currentFlow: state => state.inspect.currentFlow,
      dialogVisible: state => state.inspect.dialogVisible,
      visibleTitles: state => state.inspect.visibleTitle
    }),
    currentCom() {
      let res = 'CountBox'
      switch (this.currentFlow) {
        case 1:
          res = 'TaskCommitment'
          break
        case 2:
          res = 'MonitorTask'
          break
        case 3:
          res = 'MonitoringAnalysis'
          break
        case 4:
          res = 'collectionData'
          break
      }
      return res
    }
  },
  data() {
    return {
      visible: false,
      visibleTitle: '',
      componentData: {},
      imglist: [
        {
          name: '颤藻属',
          bg: require('../../../assets/SSTJCQ_7.png')
        }, {
          name: '束丝藻',
          bg: require('../../../assets/SSTJCQ_8.png')
        }, {
          name: '伪鱼腥藻',
          bg: require('../../../assets/SSTJCQ_9.png')
        }
      ],
      chose: 1
    }
  },
  mounted() {
    this.$store.dispatch('map/setMapState', 9)
  },
  methods: {
    openDialog(data) {
      this.visible = true
      const { head, list, title } = data
      this.visibleTitle = title
      this.componentData = data

    }
  }
}
</script>

<style lang='less' scoped>
.dialog_center {
  color: #FFFFFF;
  font-size: 18px;
  //font-weight: bold;
  line-height: 28px;
}

.ADCP {
  img {
    display: block;
    width: 300px;
    margin: 10px auto;
    text-align: center
  }
}

.WRC {
  img {
    display: inline-block;
    width: 225px;
    margin: 15px auto;
  }
}

.SSTJCQ {
  .dialog_top {
    margin: 10px;
    margin-bottom: 20px;
    padding-left: 65px;

    span {
      display: inline-block;
      background-image: url("../../../assets/but_bg_hover.png");
      background-size: 100% 100%;
      margin-right: 10px;
      height: 32px;
      width: 150px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
    }

    .chose {
      background-image: url("../../../assets/but_bg.png");
      background-size: 100% 100%;
    }
  }

  .img1 {
    display: block;
    width: 300px;
    margin: 0 auto 20px;
    text-align: center
  }

  .img2 {
    display: inline-block;
    width: 225px;
    margin: 15px auto;
    vertical-align: top;
  }

  .img3 {
    width: 230px;
    height: 200px;
  }

  .img_text {
    position: relative;
    top: -40px;
    text-align: center;
    color: black;
    font-weight: bold;
  }
}

.YJJCQ {
  img {
    width: 100%;
    margin: 15px 10px;
  }
}


</style>
