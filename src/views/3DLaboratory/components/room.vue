<template>
  <div class="room">
    <div class='dialogTitle'>
      <span>房间位置</span>
    </div>
    <div class="CAD" />
    <div class='dialogTitle'>
      <span>房间简介</span>
    </div>
    <div class='details' v-html="details" />
  </div>
</template>
<script>
import {map} from '@/api'
export default {
  name:'room',
  mounted() {
    map.introductionId(19).then(res=>{
      this.details = res.data.introduction
    })
  },
  data(){
    return{
      details:''
    }
  }
}

</script>
<style lang="less" scoped>
.dialogTitle{
  background: rgba(37, 82, 88,  0.49);
  height: 40px;
  line-height:40px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  span:before{
    display: inline-block;
    content: '';
    width: 4px;
    height: 24px;
    background: #00CCFF;
    vertical-align: top;
    margin: 10px;
  }
}
.CAD{
  height:250px ;
}
.details{
  min-height: calc(100vh  - 450px);
  padding: 20px 27px 0 14px;
  color: #fff;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 30px;
}

</style>