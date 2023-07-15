<template>
  <div class='panel'>
    <el-radio-group v-model="checkList">
      <el-radio label="1">
        <img src='@/assets/icon_he_One.png'>
        <span class='label'>省际河流（  {{numList.sjhl}} 个）</span>
      </el-radio>
      <el-radio label="2">
        <img src='@/assets/icon_he_Two.png'>
        <span class='label'>省际湖泊（{{numList.sjhp}}个）</span>
      </el-radio>
      <el-radio label="3">
        <img src='@/assets/icon_he_Three.png'>
        <span class='label'>主要入湖河道（{{numList.zyrhhd}} 个）</span>
      </el-radio>
    </el-radio-group>
  </div>
</template>
<script>
import {map} from "@/api";
import {EventBus} from '@/mapJs/EventBus'

export default {
  name:'panel',
  watch:{
    checkList:{
      deep:true,
      handler(val) {
        EventBus.$emit("layer", val);
      },
    }
  },
  mounted() {
    map.pointCategoryNum().then(res=>{
      this.numList = res.data
    })
  },
  data(){
    return{
      checkList:[],
      numList:{}
    }
  },
  methods:{


  }
}

</script>
<style lang='less' scoped>
.panel{
  position: relative;
  padding: 15px 10px;
  width: 215px;
  height: 90px;
  border: 1px solid rgba(0, 255, 255, 0.26);
  background: rgba(0, 12, 8, 0.46);
  z-index: 100;
}
img{
  width:20px;
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
  border-radius: 0%;
}
::v-deep .el-radio__inner::after{
  width:3px;
  height:10px;
  top: 0;
  left: 5px;
  border:1px solid #fff;
  border-left:0;
  border-top:0;
  border-radius: 0%;
  background: none;
  //transform:rotate(45deg) scaleY(1);
  //transition:transform .15s ease-in .05s;
  //transform-origin:center;
}
::v-deep .el-radio__label{
  font-size: 16px;
  color: #FFFFFF;

}
::v-deep .el-radio{
  margin-bottom: 10px;
}
::v-deep .el-radio__input.is-checked .el-radio__inner::after{
  transform: rotate(45deg) scaleY(1);
}
</style>
