<template>
  <div class='leftTop'>
    <DialogTitle dialogTitle='太湖水情'/>
    <lineEcharts/>
    <div class='line'/>
    <div class='body'>
      <div>太湖出入湖水量</div>
      <div class='item'>
        <div>累计入湖</div>
        <div>
          <span>{{ details.RHSL_YEAR}}</span>
          <span>亿</span>
          m³
        </div>
        <div>
          昨日 : {{ details.RHSL_YEST }}万m³
          <div :class='details.RHSL_TODAY<details.RHSL_YEST? "down":"up"' />
        </div>
      </div>
      <div class='item'>
        <div>累计出湖</div>
        <div>
          <span>{{ details.CHSL_YEAR }}</span>
          <span>亿</span>
          m³
        </div>
        <div>
          昨日 : {{ details.CHSL_YEST}}万m³
          <div :class='details.CHSL_TODAY<details.CHSL_YEST? "down":"up"' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DialogTitle from '@/components/DialogTitle'
import lineEcharts from './Echarts/lineEcharts'
import{ map } from '@/api'
export default {
  name: 'leftTop',
  components: {
    DialogTitle,
    lineEcharts
  },
  created(){
    map.crsl().then(res=>{
      this.details = res.data
    })
  },
  data() {
    return {
      details:{}
    }
  },

}
</script>

<style lang='less' scoped>
.leftTop {
  border: 1px solid rgba(229, 229, 229, 0.31);
  width: 516px;
  background: rgba(13, 22, 25, 0.69);
}

.line {
  width: 100%;
  height: 1px;
  background-image: linear-gradient(to right,
  rgba(229, 229, 229, 0.33) 0%,
  rgba(229, 229, 229, 0.33) 50%,
  transparent 70%);
  background-size: 4px 1px;
  background-repeat: repeat-x;
}

.body {
  height: 196px;

  > :first-child {
    padding: 15px 14px;
    font-size: 16px;
    font-family: FZLanTingHei-DB-GBK;
    font-weight: 400;
    color: #FFFFFF;
  }

  .item {
    display: inline-block;
    width: 50%;
    margin-top: 11px;

    > :first-child {
      margin-left: 18px;
      font-size: 16px;
      font-family: FZLanTingHei-DB-GBK;
      font-weight: 400;
      color: #FFFFFF;
      opacity: 0.8;
    }

    > :nth-child(2) {
      margin-top: 20px;
      margin-left: 18px;
      font-size: 20px;
      color: #fff;

      :first-child {
        color: #53FEFD;
        font-size: 40px;
        font-weight: bold;
        font-family: DS-DIGI;
      }
      :nth-child(2) {
        font-size: 24px;
        font-weight: bold;
        color: #53FEFD;
        margin-left: 4px;
        position: relative;
        bottom: 2px;
      }
    }

    > :last-child {
      margin-top: 8px;
      display: inline-block;
      margin-left: 18px;
      width: 160px;
      padding-left: 12px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      height: 29px;
      line-height: 29px;
      background: rgba(43, 60, 62, 0.72);
      border: 1px solid #2B3C3E;
    }

  }
}
.up{
  margin-left:6px ;
  display: inline-block;
  width: 4px;
  height: 16px;
  background: red;
  position: relative;
  top: 2px;
  vertical-align: middle;
}
.up::before{
  display: block;
  content: "";
  position: relative;
  right: 6px;
  bottom: 8px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid red;
}
.down{
  margin-left:4px ;
  display: inline-block;
  width: 4px;
  height: 16px;
  background: rgba(50, 201, 53, 1);
  position: relative;
  bottom: 2px;
  vertical-align: sub;
}
.down::after{
  display: inline-block;
  content: "";
  position: relative;
  right: 6px;
  top: 3px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid rgba(50, 201, 53, 1);
}

</style>
