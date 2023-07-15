<template>
  <div>
    <div class='dialogTitle'>
      <span>楼层简介</span>
    </div>
    <div class='center' v-html='details.introduction' />
    <div class='dialogTitle'>
      <span>实时工况</span>
    </div>
    <div class='bottom'>
      <div class='item'>
        <img src='../../../assets/icon_sd.png'>
        <span>环境湿度</span>
        <span>
          <span> {{ detail.humiMin }}--{{ detail.humiMax }}%</span>
          RH
        </span>
      </div>
      <div class='item'>
        <img src='../../../assets/icon_wd.png'>
        <span>室内温度</span>
        <span>
          <span>{{ detail.tempMin }}</span>℃~
          <span>{{ detail.tempMax }}</span>℃
        </span>
      </div>
      <div class='item'>
        <img src='../../../assets/icon_pm2.5.png'>
        <span>甲醛 </span>
        <span>
          <span>{{ detail.ch2oMin }} ~ {{ detail.ch2oMax }}</span>
          mg/m³</span>
      </div>
      <div class='item'>
        <img src='../../../assets/icon_kqzl.png'>
        <span>VOC</span>
        <span>
          <span>{{ detail.vocMin }} ~ {{ detail.vocMax }}</span>
          mg/m³</span>
      </div>
    </div>
    <div class='dialogTitle'>
      <span>智能设备</span>
    </div>
    <el-row class='floor'>
      <el-col :span='6'>
        <div class='sb_img' :style="{ borderColor:chose===1?'#00FFFF':'#678589'}" @click='choseOne(1)'>
          <img v-if='dkChose' src='../../../assets/sb_dk.png'>
          <img v-else src='../../../assets/sb_dk_no.png'>
        </div>
        <div :style="{color:dkChose? '#00FFFF':''}">灯 控</div>
      </el-col>
<!--      <el-col :span='6'>-->
<!--        <div class='sb_img' :style="{ borderColor:chose===2?'#00FFFF':'#678589'}" @click='choseOne(2)'>-->
<!--          <img v-if='mjChose' src='../../../assets/sb_mj.png'>-->
<!--          <img v-else src='../../../assets/sb_mj_no.png'>-->
<!--        </div>-->
<!--        <div :style="{color:mjChose? '#00FFFF':''}">门 禁</div>-->
<!--      </el-col>-->
      <el-col :span='6'>
        <div class='sb_img' :style="{ borderColor:chose===3?'#00FFFF':'#678589'}" @click='choseOne(3)'>
          <img v-if='spjkChose' src='../../../assets/sb_spjk.png'>
          <img v-else src='../../../assets/sb_spjk_no.png'>
        </div>
        <div :style="{color:spjkChose? '#00FFFF':''}">视频监控</div>
      </el-col>
      <el-col :span='6'>
        <div class='sb_img' :style="{ borderColor:chose===4?'#00FFFF':'#678589'}" @click='choseOne(4)'>
          <img v-if='hjjcChose' src='../../../assets/sb_hjjc.png'>
          <img v-else src='../../../assets/sb_hjjc_no.png'>

        </div>
        <div :style="{color:hjjcChose? '#00FFFF':''}">环境监测</div>
      </el-col>
      <el-col :span='6'>
        <div class='sb_img' :style="{ borderColor:chose===5?'#00FFFF':'#678589'}" @click='choseOne(5)'>
          <img v-if='chose===5' src='../../../assets/sb_tfxt.png'>
          <img v-else src='../../../assets/sb_tfxt_no.png'>
        </div>
        <div :style="{color:tfxtChose? '#00FFFF':''}">通风系统 <br>( 模拟 )</div>
      </el-col>
      <el-col :span='6'>
        <div class='sb_img' :style="{ borderColor:chose===6?'#00FFFF':'#678589'}" @click='choseOne(6)'>
          <img v-if='qlxtChose' src='../../../assets/sb_qlxt.png'>
          <img v-else src='../../../assets/sb_qlxt_no.png'>
        </div>
        <div :style="{color:qlxtChose? '#00FFFF':'',borderColor:chose===6?'#00FFFF':'#678589'}">
          气路系统
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { EventBus } from '@/mapJs/EventBus'
import { map } from '@/api'
import { mapGetters } from 'vuex'

export default {
  name: 'totalFloor',

  watch: {
    buildingControl(val) {
      this.dkChose = false
      this.mjChose = false
      this.spjkChose = false
      this.hjjcChose = false
      this.tfxtChose = false
      this.qlxtChose = false
      this.value1 = 0
      map.getEnvironmentInfoByFloor({ floor: val }).then(res => {
        this.detail = res.data
      })
      map.introductionId(Number(val) + 1).then(res => {
        this.details = res.data
      })
    }
  },
  computed: {
    ...mapGetters([
      'buildingControl'
    ])
  },
  mounted() {
    map.getEnvironmentInfoByFloor({ floor: this.buildingControl }).then(res => {
      this.detail = res.data
    })
    map.introductionId(Number(this.buildingControl) + 1).then(res => {
      this.details = res.data
    })
  },
  data() {
    return {
      chose: 0,
      dkChose: false,
      mjChose: false,
      spjkChose: false,
      hjjcChose: false,
      tfxtChose: false,
      qlxtChose: false,
      value1: 20,
      details: {},
      detail: {}
    }
  },
  methods: {
    choseOne(type) {
      switch (type) {
        case 1:
          this.dkChose = !this.dkChose
          EventBus.$emit('light', { floor: this.buildingControl, status: this.dkChose })
          break
        case 2:
          if (this.mjChose){
            this.$store.dispatch('map/setOpenDialog',0)
          }else {
            EventBus.$emit('doorCamera')
            this.$store.dispatch('map/setOpenDialog',7)
          }
          this.mjChose = !this.mjChose
          break
        case 3:
          this.spjkChose = !this.spjkChose
          break
        case 4:
          this.hjjcChose = !this.hjjcChose
          break
        case 5:
          if(this.tfxtChose){
            EventBus.$emit("switch", {floor:this.buildingControl,value:1,status:false})
          }else{
            EventBus.$emit("switch", {floor:this.buildingControl,value:1,status:true})
          }
          this.tfxtChose = !this.tfxtChose
          break
        case 6:
          if(this.qlxtChose){
            EventBus.$emit("switch", {floor:this.buildingControl,value:2,status:false})
          }else{
            EventBus.$emit("switch", {floor:this.buildingControl,value:2,status:true})
          }
          this.qlxtChose = !this.qlxtChose
          break
      }
    }
  }
}
</script>

<style lang='less' scoped>
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

.center {
  height: 190px;
  padding: 20px 27px 0 14px;
  color: #fff;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 30px;
}

.bottom {
  height: 221px;

  .item {
    margin: 19px 24px 0;
    height: 34px;
    background: rgba(26, 44, 54, 0.6);
    border: 1px solid #0C6869;
    border-radius: 6px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF;

    img {
      width: 18px;
      height: 20px;
      margin: 8px 14px;
      vertical-align: middle;
    }

    > :last-child {
      float: right;
      margin: 8px 16px 0;

      span {
        color: rgba(0, 251, 255, 1);
      }
    }
  }
}

.floor {
  color: #fff;
  text-align: center;
  margin-bottom: 20px;

  .sb_img {
    margin: 22px auto 10px;
    width: 54px;
    height: 54px;
    background: #214C55;
    border: 1px solid #678589;
    border-radius: 4px;
    cursor: pointer;

    img {
      margin: 3px;
      width: 48px;
      height: 48px;
    }
  }

}

::v-deep .el-slider__button {
  width: 10px;
  height: 10px;
}
</style>
