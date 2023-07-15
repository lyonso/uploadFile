<template>
  <div class='rightCenter'>
      <div class='title'>
        <span>蓝藻图像影像资料</span>
        <span :class=" chose === 0 ? 'item chose':'item'" @click="lzImgList('卫星遥感影像',0)">卫星影像</span>
        <span :class=" chose === 1 ? 'item chose':'item'" @click="lzImgList('中分辨率太湖草藻分布图',1)">草藻分布图</span>
        <span :class=" chose === 2 ? 'item chose':'item'" @click="lzImgList('人工调查太湖蓝藻分布图',2)">人工观测图</span>
        <i @click="chageSteps" class="el-icon-s-unfold icon"></i>
      </div>
      <div class='body'>
        <el-row :gutter='16'>
          <el-col v-for="(item,index) in imglist" :key="index" :span='6'>
            <img  :src="item.selfUrl">
            <div style="margin-top: 2px"> {{ item.makeTime.slice(0,10) }}</div>
          </el-col>
        </el-row>
      </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {map}from '@/api'
export default {
  name:'rightCenter',
  data(){
    return{
      chose:0,
      imglist:[]
    }
  },
  mounted() {
    this.lzImgList('卫星遥感影像',0)

  },
  computed: {
    ...mapGetters([
      'dialogDetails'
    ]),
  },
  methods:{
    chageSteps(){
      const obj = this.chose === 0 ? '卫星遥感影像':(this.chose === 1 ? '中分辨率太湖草藻分布图':'人工调查太湖蓝藻分布图')
      this.$store.dispatch('map/setFileTheme',obj )
      this.$emit('chageSteps',6)
    },
    lzImgList(fileTheme,chose){
      const data = {
        limit:4,
        pageNum:1,
        fileTheme
      }
      this.chose = chose
      map.lzImgList(data).then(res=>{
        let imgList = res.data.rows
      //   imgList.forEach((item,index)=>{
      //     map.downloadImg({ imgId:item.imgId }).then(res=>{
      //       const dataInfo =res
      //       let reader = new window.FileReader()
      //       reader.readAsArrayBuffer(dataInfo)
      //       let url = ''
      //       reader.onload = function (e) {
      //         const result = e.target.result
      //         const contentType = dataInfo.type
      //         // 生成blob图片,需要参数(字节数组, 文件类型)
      //         const blob = new Blob([result], { type: contentType })
      //         // 使用 Blob 创建一个指向类型化数组的URL, URL.createObjectURL是new Blob文件的方法,可以生成一个普通的url,可以直接使用,比如用在img.src上
      //         url = window.URL.createObjectURL(blob)
      //         imgList[index]['selfUrl'] = url
      //       }
      //     })
      // })
        this.imglist = imgList

      })
    }
  }
}
</script>
<style lang='less' scoped>
.rightCenter{
  width: 714px;
  background:  rgba(11, 37, 50, 0.64);
  border: 1px solid rgba(229, 229, 229, 0.31);
}
.title{
  background: #2A3E41;
  height: 40px;
  line-height:40px;
  font-size: 15px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  :first-child:before{
    display: inline-block;
    content: '';
    width: 4px;
    height: 20px;
    background: #00CCFF;
    vertical-align: top;
    margin: 10px;
  }
  :first-child{
    margin-right: 190px;
  }
  .item{
    cursor: pointer;
    margin-left: 20px;
  }
  .chose{
    display: inline-block;
    position: relative;
    color: rgba(0, 255, 255, 1);
    line-height: 30px;
    border-bottom: 4px solid rgba(0, 255, 255, 1) ;
  }
  .icon{
    position: absolute;
    right: 16px;
    top: 11px;
    opacity: 0.52;
    font-size: 24px;
    cursor: pointer;
  }
}
.body{
  width: calc(100% - 32px);
  padding:15px 16px 2px;
  img{
    width: 100%;
    height: 158px;
    background: #2A3E41;
  }
  div{
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    text-align: center;
    margin-top: -4px;
  }
}

</style>
