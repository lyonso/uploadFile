<template>
  <div class="rightCenter">
    <div class="title">
      指标数据
    </div>
    <div class="container">
      <el-row>
        <div class="container-label">
          <el-col :span="4" class="lineRight" style="line-height: 60px">月份</el-col>
          <el-col :span="4" class="lineRight">
            <div style="margin-top: 5px">溶解氧</div>
            <div>(mg/L)</div>
          </el-col>
          <el-col :span="4" class="lineRight">
            <div style="margin-top: 5px">高锰酸盐</div>
            <div>(mg/L)</div>
          </el-col>
          <el-col :span="4" class="lineRight">
            <div style="margin-top: 5px">总氮</div>
            <div>(mg/L)</div>
          </el-col>
          <el-col :span="4" class="lineRight">
            <div style="margin-top: 5px">氨氮</div>
            <div>(mg/L)</div>
          </el-col>
          <el-col :span="4">
            <div style="margin-top: 5px">总磷</div>
            <div>(mg/L)</div>
          </el-col>
        </div>
        <div v-if="List.length">
          <div class="container-list" v-for="(item,index) in List" :key="index">
            <el-col :span="4" class="month lineRight">
              <span class="item_first">{{ item.SPT || "-" }}</span>
            </el-col>
            <el-col :span="4" class="lineRight">
              <span :class='Number(item.DOX)>=Number(indexStandardValues.DOX)? "yellow":"red"'> {{item.DOX || "-" }}</span>
            </el-col>
            <el-col :span="4" class="lineRight">
              <span :class='Number(item.CODMN)>Number(indexStandardValues.CODMN)? "red":"yellow"'>{{item.CODMN || "-" }}</span>
            </el-col>
            <el-col :span="4" class="lineRight">
              <span :class='Number(item.TN)>Number(indexStandardValues.TN)? "red":"yellow"'>{{ item.TN || "-" }}</span>
            </el-col>
            <el-col :span="4" class="lineRight">
              <span :class='Number(item.NH3N)>Number(indexStandardValues.NH3N)? "red":"yellow"'>{{item.NH3N || "-"}}</span>
            </el-col>
            <el-col :span="4" class="lineRight">
              <span :class='Number(item.TP)>Number(indexStandardValues.TP)? "red item_last":"yellow item_last"'>{{item.TP || "-" }}</span>
            </el-col>
          </div>
        </div>
        <div class="noneData" v-else>
          暂无数据
        </div>
      </el-row>
    </div>
  </div>
</template>
<script>
import {map} from '@/api'

export default {
  name: 'RightCenter',
  components: {},
  watch:{
    $route(){
      this.getList()
    },
  },
  data() {
    return {
      details: {},
      chartData: [],
      List: [],
      indexStandardValues: {},
      jcTime: '-'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      map.dataByzdPoint({stcds: this.$route.query.id}).then(res => {
        this.List = res.data.list
        if (this.List.length >3){
          this.List.length = 3
        }
        this.indexStandardValues = res.data.indexStandardValues
      })
    }
  }
}

</script>

<style lang='less' scoped>
.rightCenter {
  .title {
    width: 100%;
    height: 32px;
    background: rgba(14, 78, 116, 0.31);
    padding-left: 20px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    box-sizing: border-box;
    line-height: 32px;
    color: #FFFFFF;
  }

  .container {
    .lineRight {
      border-right: 1px solid rgba(229, 255, 255, 0.23);
    }

    &-label {
      text-align: center;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #09ECF0;
      height: 50px;
      border-top: 1px solid rgba(11, 240, 240, 0.3);
      border-bottom: 1px solid rgba(11, 240, 240, 0.3);

      .el-col {
        height: 100%;
      }
    }

    &-list {
      text-align: center;
      line-height: 28px;
      font-size: 14px;
      font-weight: bold;
      border-bottom: 1px solid rgba(11, 240, 240, 0.3);
      height: 28px;

      .month {
        font-family: SSFangYuanTi;
        color: #FFFBFA;
      }

      .red {
        font-family: SSFangYuanTi;
        color: #FF755A;

      }

      .yellow {
        font-family: SSFangYuanTi;
        color: #FFDE00;

      }
    }
    .noneData{
      height: 105px;
      line-height: 105px;
      text-align: center;
      color: #09ECF0;
      border-bottom: 1px solid rgba(11, 240, 240, 0.3);
    }
  }
}
</style>

