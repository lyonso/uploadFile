<template>
  <div class="panel">
    <div />
    <div>
      <div class="left">
        <div>片状</div>
        <div>带状</div>
        <div>颗粒</div>
      </div>
      <div class="center" />
      <div class="right">
        <div>重度</div>
        <div>中度</div>
        <div>轻度</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'panel',
    data(){
      return{
      }
    }
  }
</script>

<style lang="less" scoped>
.panel{
  width: 122px;
  height: 251px;
  background: rgba(5, 26, 18, 0.84);
  border: 1px solid #055C6C;
  border-radius: 4px;
  >:first-child{
    padding: 22px 23px 13px 49px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
  }
  .left{
    display: inline-block;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    vertical-align: top;
    margin: 0 11px;
    div{
      margin-bottom: 56px;
    }
  }
  .center{
    display: inline-block;
    width: 14px;
    height: 170px;
    background: linear-gradient(0deg, #44F527, #F5D127, #F59727, #FF4D4D);
    border-radius: 7px;
    vertical-align: top;
  }
  .right{
    display: inline-block;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    margin: -30px 8px;
    div{
      margin:45px 0;
    }

  }
}


</style>