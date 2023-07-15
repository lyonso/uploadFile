<template>
  <div class='siteOutside'>
    <DialogTitle dialogTitle='基础信息' />
    <div class='siteOutside-introduce'>{{ text }}</div>
    <DialogTitle dialogTitle='环境监测' />
    <div class='siteOutside-data'>
      <div>
        <img src='../../../../assets/icon_sd.png'>
        湿度
        <span>{{ datalist.sd }}</span>
        RH
      </div>
      <div>
        <img src='../../../../assets/icon_wd.png'>
        温度
        <span>{{ datalist.sd }}</span>
        ℃
      </div>
    </div>
    <DialogTitle dialogTitle='实验室实时运行概况' />
    <div class='siteOutside-survey'>
      <div>
        今日监测次数
        <span>{{ frequency }}</span>

      </div>
      <div>
        今日监测次数
        <span>{{ frequency }}</span>
      </div>
    </div>
    <DialogTitle dialogTitle='近12月监测频次' />
    <div class='siteOutside-echart'>
      <lineEcharts />
    </div>
  </div>
</template>
<script>
import DialogTitle from '@/components/DialogTitle'
import lineEcharts from '../Echart/lineEcharts'

export default {
  components: {
    DialogTitle,
    lineEcharts
  },
  data() {
    return {
      text: '二楼介绍  水温（工作原理：热电阻温度传感器是利用导体或半导体的电阻值随温度变化而变化的原理进行测温的）；',
      datalist: {
        wd: '-1— 5',
        sd: '45— 60%'
      },
      frequency: '2'
    }
  },
  methods: {}
}
</script>
<style lang='less' scoped>
.siteOutside {
  width: 380px;
  height: calc(100vh - 120px);
  border: 1px solid rgba(229, 229, 229, 0.31);
  font-family: PingFang SC;
  background: rgba(0, 50, 65, 0.8);

  &-introduce {
    padding: 20px;
    font-size: 16px;
    font-weight: 500;
    color: #FFFFFF;
  }

  &-data {
    color: #FFFFFF;
    padding: 20px;

    img {
      width: 20px;
      height: 20px;
      vertical-align: bottom;
    }

    span {
      margin-left: 50px;
      color: rgba(0, 251, 255, 1);
    }

    > :first-child {
      margin-bottom: 30px;
    }
  }

  &-survey {
    padding: 20px;
    color: #fff;

    > :first-child {
      background-image: url("../../../../assets/bg_rw.png");
      background-size: 100% 100%;
      height: 49px;
      margin-bottom: 20px;
      padding: 36px 0 0 95px;
    }

    > :nth-child(2) {
      background-image: url("../../../../assets/bg_bj.png");
      background-size: 100% 100%;
      height: 49px;
      padding: 36px 0 0 95px;
    }

    span {
      font-family: DS-DIGI;
      font-size: 30px;
      margin-left: 80px;
      vertical-align: middle;
    }
  }
}
</style>
