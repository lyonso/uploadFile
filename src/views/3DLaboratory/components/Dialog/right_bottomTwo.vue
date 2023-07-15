<template>
  <div class="details"  ref="details" @mousedown="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">
    <div class='dialogTitle'>
     <span>移动监测设备</span>
      <i class="el-icon-close close"   @click="closeDialog"></i>
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
import {map} from '@/api'
import { EventBus } from '@/mapJs/EventBus'

export default {
  name:'',
  components:{
    DialogTitle
  },
  data(){
    return{
      details:{},
      moveDataelse: {
        x: null,
        y: null
      },
      imgList: [
        { bg: require('../../../../assets/cl_1.png') },
        { bg: require('../../../../assets/cl_2.png') },
        { bg: require('../../../../assets/cl_3.png') },
      ]
    }
  },
  mounted() {
    EventBus.$emit('cameraPosition', 3)
    map.introductionId('5').then(res=>{
      this.details = res.data
    })
  },
  beforeDestroy() {
    EventBus.$emit('floor', '0')
  },
  methods:{
    closeDialog(){
      this.$store.dispatch('map/setOpenDialog',0)
    },
    mouseDownHandleelse (event) {
      this.moveDataelse.x = event.pageX - this.$refs.details.offsetLeft
      this.moveDataelse.y = event.pageY - this.$refs.details.offsetTop
      event.currentTarget.style.cursor = 'move'
      window.onmousemove = this.mouseMoveHandleelse
    },
    mouseMoveHandleelse (event) {
      let moveLeft = event.pageX - this.moveDataelse.x + 'px'
      let moveTop = event.pageY - this.moveDataelse.y + 'px'
      this.$refs.details.style.left = moveLeft
      this.$refs.details.style.top = moveTop
    },
    mouseUpHandleelse (event) {
      window.onmousemove = null
      event.currentTarget.style.cursor = 'move'
      console.log('鼠标松开了')
    }
  }
}
</script>
<style lang="less"scoped>
.details{
  position: absolute;
  top: 474px;
  left: 226px;
  width: 1000px;
  background: rgba(2, 19, 30, 0.6);
  .introduce{
    padding: 15px;
    font-size: 20px;
    font-family: PingFang SC;
    color: #FFFFFF;
    line-height: 36px;
  }
}
.dialogTitle{
  background: #2A3E41;
  height: 44px;
  line-height:44px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;
  >:first-child{
    margin-left: 20px;
  }

}
.close{
  float: right;
  margin-top: 16px;
  margin-right: 20px;
  cursor: pointer;
}
</style>
