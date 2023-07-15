<template>
  <div class="details"  ref="details" @mousedown="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">
    <div class='dialogTitle'>
     <span>水草浮台简介</span>
      <i class="el-icon-close close"   @click="closeDialog"></i>
    </div>
    <div v-html="details.introduction" />
  </div>
</template>
<script>
import DialogTitle from '@/components/DialogTitle'
import {map} from '@/api'

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
      }

    }
  },
  mounted() {
    map.introductionId('6').then(res=>{
      this.details = res.data
    })
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
  top: 401px;
  left: 701px;
  width: 410px;
  background: rgba(2, 19, 30, 0.6);
  >:last-child{
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
