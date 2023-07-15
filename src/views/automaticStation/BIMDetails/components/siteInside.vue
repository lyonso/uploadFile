<template>
  <div class='siteInside'>
    <DialogTitle dialogTitle='当前运行状态' />
    <div class='siteInside-status'>
      <span>正在运行</span>
      <span>正常</span>
    </div>
    <div class='divisionLine' />
    <div class='siteInside-control'>
      <div :class='chose===2? "chose":""'>
        <div @click=openSystem(true)>
          <img v-if='chose===2' src='../../../../assets/control_true.png'>
          <img v-else src='../../../../assets/control_false.png'>
        </div>
        <div>系统打开</div>
      </div>
    </div>
    <DialogTitle dialogTitle='仪器仪表数据' />
    <div class='siteInside-container'>
      <el-row>
        <el-col :span='11' class='leftLine'>
          <div v-for='(item,index) in list' :key='index' class='tabsStyle'>
            {{ item.label }}
          </div>
        </el-col>
        <el-col :span='13' class='rightInfo'>
          <div>
            <div v-for='(item,index) in list' :key='index' class='tabsStyle'>
              {{ item.value || '-' }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import DialogTitle from '@/components/DialogTitle'
import { map } from '@/api'
import { EventBus } from '@/mapJs/EventBus'

export default {
  components: {
    DialogTitle,
  },
  data() {
    return {
      chose: 1,
      list: [
        { label: '采样时间', value: '' },
        { label: '水温（℃）', value: '6.3' },
        { label: 'pH值', value: '10' },
        { label: '电导率（us/cm）', value: '10' },
        { label: '溶解氧（mg/L）', value: '10' },
        { label: '浊度（NTU）', value: '10' },
        { label: '氧化还原电位（mV）', value: '10' },
        { label: '高锰酸盐指数（mg/L）', value: '10' },
        { label: '总氮（mg/L）', value: '10' },
        { label: '氨氮（mg/L）', value: '10' },
        { label: '总磷（mg/L）', value: '10' }
      ]
    }
  },
  created() {
    this.getDel()
  },
  methods: {
    getDel() {
      map.getNewestData({ stcds: this.$route.query.id }).then(res => {
        // map.getNewestData({stcds:'63205300'}).then(res=>{
        this.list[0].value = res.data.SPT
        this.list[1].value = res.data.WT
        this.list[2].value = res.data.PH
        this.list[3].value = res.data.COND
        this.list[4].value = res.data.DOX
        this.list[5].value = res.data.TURB
        this.list[6].value = res.data.REDOX
        this.list[7].value = res.data.CODMN
        this.list[8].value = res.data.TN
        this.list[9].value = res.data.NH3N
        this.list[10].value = res.data.TP
      })
    },

    openSystem(type) {
      this.chose = 1
      EventBus.$emit("system",type)
      this.$store.dispatch('automaticStation/setBIMDetailsStatus', 0)
    }

  }
}
</script>


<style lang='less' scoped>
.siteInside {
  width: 380px;
  //height: calc(100vh - 120px);
  border: 1px solid rgba(229, 229, 229, 0.31);
  font-family: PingFang SC;
  background: rgba(0, 50, 65, 0.8);


  &-status {
    height: 185px;
    background-image: url("../../../../assets/bg_status.png");
    background-position: center;
    background-repeat: no-repeat;
    color: rgba(13, 219, 224, 1);

    :first-child {
      position: relative;
      font-size: 30px;
      top: 40px;
      left: 120px;
    }

    :nth-child(2) {
      position: relative;
      top: 65px;
      font-size: 36px;
      left: 153px;
    }
  }

  .divisionLine {
    height: 15px;
    background: rgba(37, 82, 88, 0.49);
  }

  &-control {
    height: 125px;
    font-size: 16px;
    color: #FFFFFF;
    padding: 10px;

    > div {
      display: inline-block;
      width: 80px;
      margin-top: 21px;

      > :first-child {
        width: 54px;
        height: 54px;
        background: rgba(33, 76, 85, 1);
        border: 1px solid #678589;
        border-radius: 4px;
        margin: 10px auto;
        cursor: pointer;


        img {
          display: block;
          width: 30px;
          height: 41px;
          margin: 6px auto;
        }
      }

      > :nth-child(2) {
        text-align: center;
      }
    }

    .chose {
      color: rgba(0, 255, 255, 1);

      > :first-child {
        background: rgba(7, 99, 104, 1);
        border: 1px solid rgba(0, 255, 255, 1);
      }
    }
  }

  &-container {
    color: #FFFFFF;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;

    .el-row {
      height: 100%;
    }

    .el-col {
      height: 100%;
    }

    .leftLine {
      background-color: rgba(0, 42, 62, 0.45);
      border-right: 1px solid rgba(255, 255, 255, 0.59);
    }

    .rightInfo {
      background: rgba(2, 19, 30, 0.8);
    }

    .tabsStyle {
      padding: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.59);
    }
  }
}

</style>
