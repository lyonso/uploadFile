<template>
  <div class='details' ref='details'>
    <div class='dialogTitle'>
      <span>实验室简介</span>
      <i class='el-icon-close close' @click='closeDialog'></i>
    </div>
    <div class='introduce' v-html='details.introduction' />
    <el-carousel :interval='2000' type='card' height='200px' style='margin: 0 20px'>
      <el-carousel-item v-for='(item,index ) in imgList' :key='index'>
        <img style='width:578px;height: 200px;margin: 0 auto' :src='item.bg'>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import DialogTitle from '@/components/DialogTitle'
import { map } from '@/api'
import { EventBus } from '@/mapJs/EventBus'

export default {
  name: '',
  components: {
    DialogTitle
  },
  data() {
    return {
      details: {},
      moveDataelse: {
        x: null,
        y: null
      },
      imgList: [
        { bg: require('../../../../assets/sys_1.jpg') },
        { bg: require('../../../../assets/sys_2.jpg') },
        { bg: require('../../../../assets/sys_3.jpg') },
        { bg: require('../../../../assets/sys_4.jpg') },
        { bg: require('../../../../assets/sys_5.jpg') },
        { bg: require('../../../../assets/sys_6.jpg') },
        { bg: require('../../../../assets/sys_7.jpg') },
        { bg: require('../../../../assets/sys_8.jpg') },
        { bg: require('../../../../assets/sys_9.jpg') },
        { bg: require('../../../../assets/sys_10.jpg') },
        { bg: require('../../../../assets/sys_11.jpg') },
        { bg: require('../../../../assets/sys_12.jpg') },
      ]
    }
  },
  mounted() {
    EventBus.$emit('cameraPosition', 1)
    map.introductionId('1').then(res => {
      this.details = res.data
    })
  },
  beforeDestroy() {
    EventBus.$emit('floor', '0')
  },
  methods: {
    closeDialog() {
      this.$store.dispatch('map/setOpenDialog', 0)
    }
  }
}
</script>
<style lang='less' scoped>
.details {
  position: absolute;
  top: 401px;
  left: 112px;
  width: 1196px;
  background: rgba(2, 19, 30, 0.6);

  .introduce {
    padding: 15px;
    font-size: 20px;
    font-family: PingFang SC;
    color: #FFFFFF;
    line-height: 36px;
  }
}

.dialogTitle {
  background: #2A3E41;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  > :first-child {
    margin-left: 20px;
  }

}

.close {
  float: right;
  margin-top: 16px;
  margin-right: 20px;
  cursor: pointer;
}

::v-deep .el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
</style>

