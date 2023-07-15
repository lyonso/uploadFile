<template>
  <div class='panel'>
    <el-radio-group v-model="checkList">
      <el-radio label="1">
        <img src='@/assets/icon_green.png'>
        <span class='label'>太湖湖体（{{numList.ht }} 处）</span>
      </el-radio>
      <el-radio label="2">
        <img src='@/assets/icon_young.png'>
        <span class='label'>太湖水源地（{{ numList.syd}} 处）</span>
      </el-radio>
      <el-radio label="3">
        <img src='@/assets/icon_zi.png'>
        <span class='label'>环湖视频图像站（{{ numList.spjk}} 处）</span>
      </el-radio>
      <el-radio label="4">
        <img src='@/assets/icon_blue.png'>
        <span class='label'>湖区自动站（{{numList.zdz}} 处）</span>
      </el-radio>
      <el-radio label="5">
        <img src='@/assets/icon_red.png'>
        <span class='label'>蓝藻调查点（{{numList.lzdcd}} 处）</span>
      </el-radio>
    </el-radio-group>
  </div>
</template>
<script>
  import {map} from '@/api'
  import {EventBus} from '@/mapJs/EventBus'

  export default {
    name:'panel',
    watch:{
      checkList:{
        deep:true,
        handler(val) {
          this.$store.dispatch('map/setBluePanel',val)
          EventBus.$emit("layer1", val);
        },
      }
    },
    mounted() {
      map.pointNum().then(res=>{
        this.numList = res.data
      })
    },
    beforeDestroy(){
      this.$store.dispatch('map/setBluePanel','')
    },
    data(){
      return{
        checkList:'',
        numList:[]
      }
    },
    methods:{


    }
  }

</script>
<style lang='less' scoped>
.panel{
  position: absolute;
  top:calc(100vh - 210px);
  left: 201px;
  padding: 15px 10px;
  width: 270px;
  height: 165px;
  border: 1px solid rgba(0, 255, 255, 0.26);
  background: rgba(0, 12, 8, 0.68);
  z-index: 100;
}
img{
  width:18px;
  height: 24px;
  vertical-align: top;

}
.label{
  margin-left: 5px;
  vertical-align: middle;
}

::v-deep .el-radio-group{
  display:block;
  margin-bottom: 14px;
}
::v-deep .el-radio__inner{
  width: 16px;
  height: 16px;
  background: rgba(9, 84, 78, 0.36);
  border: 1px solid #0CD2D5;
}
::v-deep .el-radio__inner::after{
  top: 7px;
  border:1px solid #fff;
}
::v-deep .el-radio__label{
  font-size: 20px;
  color: #FFFFFF;
}
::v-deep .el-radio{
  margin-bottom: 10px;
}

</style>
