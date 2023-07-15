<template>
  <div class='leftBottom'>
    <div class='title'>
      <span>水质评价</span>
      <span :class='choseOne===0? "choseOne":""'  @click="choseOne = 0">省际河流</span>
      <span :class='choseOne===1? "choseOne":""'  @click="choseOne = 1">省际湖泊</span>
      <span :class='choseOne===2? "choseOne":""'  @click="choseOne = 2">主要入湖河道</span>
    </div>
    <pieEcharts ref="pieEcharts" :nowData="nowData"  v-if="choseOne!==1"/>
    <pieEchartsList  :nowData="nowData" v-else />
    <div class="line" />
    <el-row class="OverItems">
      <el-scrollbar style="height:100%">
          <el-col :span="24">未达到地表水Ⅲ类标准的指标</el-col>
          <el-col :span="8" v-for="(item,index) in nowData.OverItems" :key='index' class="item">
            <span v-if="index==0" class="red">{{index+1}}</span>
            <span v-else-if="index==1" class="org">{{index+1}}</span>
            <span v-else-if="index==2" class="yellow">{{index+1}}</span>
            <span v-else >{{index+1}}</span>
            <span>{{ item }}</span>
          </el-col>
      </el-scrollbar>
    </el-row>
  </div>
</template>

<script>
import pieEcharts from './Echarts/pieEcharts'
import pieEchartsList from './Echarts/pieEchartsList'
import { map } from  '@/api'
import _ from 'lodash'
export  default {
  name:'leftBottom',
  components: {
    pieEcharts,
    pieEchartsList
  },
  watch:{
    choseOne(val){
      this.nowData = _.cloneDeep(this.Echarts[val])
    }
  },
  mounted(){
    map.waterQualityGrade({category:0}).then(res=>{
      this.rivers.One= res.data.num
      this.Echarts[0] = res.data
      this.nowData = res.data
      this.$emit('setRivers',this.rivers)
    })
    map.waterQualityGrade1().then(res=>{
      this.rivers.two= res.data.num
      this.Echarts[1] = res.data
      this.$emit('setRivers',this.rivers)
    })
    map.waterQualityGrade({category:2}).then(res=>{
      this.rivers.three= res.data.num
      this.Echarts[2] = res.data
      this.$emit('setRivers',this.rivers)
    })
  },
  data(){
    return{
      choseOne:0,
      Echarts:{
        0:{},
        1: {},
        2: {}
      },
      nowData:{},
      rivers:{
        One:0,
        two:0,
        three:0
      }
    }
  },

}
</script>

<style lang='less' scoped>
.leftBottom{
  width: 516px;
  border: 1px solid rgba(229, 229, 229, 0.31);
  background: rgba(13, 22, 25, 0.69);
}
.title{
  background: #2A3E41;
  height: 44px;
  line-height:44px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  :first-child:before{
    display: inline-block;
    content: '';
    width: 4px;
    height: 24px;
    background: #00CCFF;
    vertical-align: top;
    margin: 10px;
  }
  :first-child{
    margin-right: 60px;
  }
  :nth-child(2),
  :nth-child(3),
  :nth-child(4){
    margin-left: 34px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    cursor: pointer;
    padding-bottom: 6px;
  }
  .choseOne{
    color: #2DD5FF;
    border-bottom: 2px solid #2DD5FF ;
  }
  .pieEcharts{

  }
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
.OverItems{
  width: 100%;
  height: 172px;
  padding: 15px;
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  .item{
    margin: 10px 0;
    :first-child{
      display: inline-block;
      width: 20px;
      height: 20px;
      font-size: 11px;
      background: #00A9DA;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      margin-right: 10px;
    }
  }
  .red{
    background: #FF0000 !important ;
  }
  .org{
    background: #FF6C00 !important;
  }
  .yellow{
    background: #DCAB00 !important;
  }
  ::v-deep .el-scrollbar__wrap{
    overflow-x: hidden;
  }
}





</style>
