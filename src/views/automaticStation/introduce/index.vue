<template>
  <div class='introduce'>
    <DialogTitle dialogTitle='自动监测站' />
    <img src='../../../assets/site.png'>
    <div class='text'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ introduce }}</div>
  </div>
</template>

<script>
import DialogTitle from '@/components/DialogTitle'
export default {
  components:{
    DialogTitle
  },
  created() {
    this.$store.dispatch('map/setMapState', 4)
  },
  data() {
    return {
      introduce: '水文监测系统适用于水文部门对江、河、湖泊、水库、渠道和地下水等水文参数进行实时监测，监测内容包括：水  位、流量、流速、降雨（雪）、' +
        '蒸发、泥沙、冰凌、墒情、水质等。水文监测系统采用无线通讯方式实时传送监测数据，可以大大提高水文部门的工作效率。'
    }
  }
}
</script>

<style lang='less' scoped>
.introduce {
  position: absolute;
  top: 80px;
  right: 32px;
  z-index: 10;
  width: 518px;
  height: calc(100vh - 120px);
  background: rgba(13, 22, 25, 0.69);
  border: 1px solid rgba(229, 229, 229, 0.31);

  img {
    margin: 20px;
    width: calc(100% - 40px);
    height: 263px;
  }

  .text {
    margin: 20px;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 32px;
  }
}

</style>
