<template>
  <div class="rightPage">
    <DialogTitle dialogTitle='自动监测站' />
    <div class="rightPage-container">
      <div class="rightPage-container-images">
      </div>
      <div class="rightPage-container-text">
        {{text}}
      </div>
    </div>
  </div>
</template>
<script>
import DialogTitle from '@/components/DialogTitle'
export  default {
  name:'RightPage',
  components: {
    DialogTitle
  },
  data(){
    return{
      text: '水文监测系统适用于水文部门对江、河、湖泊、水库、渠道和地下水等水文参数进行实时监测，监测内容包括：水位、流量、流速、降雨（雪）、蒸发、泥沙、冰凌、墒情、水质等。水文监测系统采用无线通讯方式实时传送监测数据，可以大大提高水文部门的工作效率。'
    }
  },
  methods:{

  }
}

</script>

<style lang='less' scoped>
.rightPage {
  width: 518px;
  height: 937px;
  border: 1px solid rgba(229, 229, 229, 0.31);
  background: rgba(13, 22, 25, 0.69);
  &-container {
    padding: 20px;
    &-images {
      width: 100%;
      height: 263px;
      background-color: #999494;
    }
    &-text {
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 43px;
      margin-top: 20px;
    }
  }
}
</style>

