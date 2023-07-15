<template>
  <div class='modelDetails'>
    <div class='dialogTitle'>
      <span>设备介绍</span>
    </div>
    <div class='line' />
    <el-row>
      <el-col :span='8'>
        <div :class='chose===0? "typeItem chose":"typeItem "' @click='chose=0'>设备简介</div>
      </el-col>
      <el-col :span='8'>
        <div :class='chose===1? "typeItem chose":"typeItem "' @click='chose=1'>检测数据</div>
      </el-col>
      <el-col :span='8'>
        <div :class='chose===2? "typeItem chose":"typeItem "' @click='chose=2'>定检数据</div>
      </el-col>
    </el-row>
    <div class='line' />
    <div v-if='chose===1'>
      <el-row class='List'>
        <div class='list_top'>
          <el-col class='borderLine' :span='6'>采样日期</el-col>
          <el-col class='borderLine' :span='6'>点位名称</el-col>
          <el-col class='borderLine' :span='6'>监测指标</el-col>
          <el-col class='borderLine noLine' :span='6'>分析结果</el-col>
        </div>
        <div v-for='(item,index) in list' class='item' :key='index'>
          <el-col class='borderLine' :span='6'>{{ item['采样日期'] }}</el-col>
          <el-col class='borderLine' :span='6'>{{ item['点位名称'] }}</el-col>
          <el-col class='borderLine' :span='6'>{{ item['SINONYM'] }}</el-col>
          <el-col class='borderLine  noLine' :span='6'>{{ item['分析结果'] }}/{{ item['单位'] }}</el-col>
        </div>
      </el-row>
    </div>
    <div v-else class='top'>
      <div>
        <span>设备名称：</span>
        <span></span>
      </div>
      <div>
        <span>品牌型号：</span>
        <span></span>
      </div>
      <div>
        <span>设备编号：</span>
        <span></span>
      </div>
      <div>
        <span>资产价值：</span>
        <span></span>
      </div>
      <div>
        <span>设备来源：</span>
        <span> </span>
      </div>
      <div>
        <span>购置年份：</span>
        <span></span>
      </div>
      <div>
        <span>出厂编号：</span>
        <span></span>
      </div>
      <div>
        <span>维护人员：</span>
        <span></span>
      </div>
      <div>
        <span>售后服务电话：</span>
        <span></span>
      </div>

    </div>
    <div class='dialogTitle'>
      <span>设备简介</span>
    </div>
    <div class='center' v-html='details.introduction' />

  </div>
</template>
<script>
import { map } from '@/api'

export default {
  name: 'modelDetails',
  data() {
    return {
      chose: 0,
      details: {},
      list: []
    }
  },
  mounted() {
    // map.introductionId(19).then(res => {
    //   this.details = res.data
    // })
    // map.FRESULTS({ code: 'A010011' }).then(res => {
    //   this.list = res.data
    // })
  },
  methods:{
    showInfo(code){
      map.FRESULTS({ code: code }).then(res => {
        this.list = res.data
      })
    }
  }
}
</script>
<style lang='less' scoped>
.modelDetails {
  width: 400px;
  position: absolute;
  top: 100px;
  right: 20px;
  background: rgba(2, 19, 30, 0.6);
}

.dialogTitle {
  background: rgba(37, 82, 88, 0.49);
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  span:before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 24px;
    background: #00CCFF;
    vertical-align: top;
    margin: 10px;
  }
}

.line {
  width: 100% !important;
  height: 1px !important;
  background-image: linear-gradient(to right,
  rgba(0, 255, 255, 1) 0%,
  rgba(0, 255, 255, 1) 50%,
  transparent 70%);
  background-size: 8px 1px;
  background-repeat: repeat-x;
}

.typeItem {
  height: 46px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #00FFFD;
  text-align: center;
  line-height: 46px;
  cursor: pointer;
}

.chose {
  background: rgba(0, 255, 255, 0.17);
}

.center {
  min-height: calc(100vh - 650px);
  padding: 20px 27px 0 14px;
  color: #fff;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 30px;
}

.top {
  div {
    height: 40px;
    border-bottom: 1px solid #678589;

    span {
      display: inline-block;
      line-height: 40px;
      color: #fff;
    }

    :first-child {
      width: 151px;
      text-align: right;
      border-right: 1px solid #678589;
    }

    :nth-child(2) {
      margin-left: 10px;
    }
  }
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

::v-deep .el-col-6 {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
