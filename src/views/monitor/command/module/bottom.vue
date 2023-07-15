<template>
  <div class="bottom" v-if="hideing">
    <div class="box"></div>
    <div class="bottom-paging">
      <div class="bottom-paging-left" @click="previousPage" v-if="showFy.showFyall&&showFy.showFyLeft">
        <img src="@/assets/back.png" alt="">
      </div>
      <div class="bottom-paging-right" @click="nextPage" v-if="showFy.showFyall&&showFy.showFyRight">
        <img src="@/assets/next.png" alt="">
      </div>
    </div>
    <div class="bottom-containet">
      <div class="bottom-left"></div>

      <div class="bottom-center">

        <div class="bottom-list" @click="changeactive(item)" v-for="(item,index) in mapaddress" :key="index">
          <div class="bottom-list-img">
            <img v-if="activeid==item.yjylAnchorPointId" src="@/assets/select.png" alt="">
            <img v-else src="@/assets/default.png" alt="">
          </div>
          <div class="bottom-list-title" :class="{active:item.yjylAnchorPointId==activeid}">
            <span> {{item.pointName}}</span>
          </div>
        </div>
      </div>
      <div class="bottom-right"></div>
    </div>
    <div class="box3" />
    <div class="clearfloat" />
    <div class="bottom-bg" />
  </div>
</template>

<script>
  import { anchorPointList } from '@/api/command'
  export default{

    props:{
      mid:{
        type:String
      }
    },
    data(){
      return{
        hideing:true,
        mapaddress:[],
        activeid:"",
        total:0,
        showFy:{
          showFyall:false,
          showFyLeft:false,
          showFyRight:false,
        },
        pageNum:1,
        pageSize:4,
        isfirst:true,
      }
    },
    created() {
      this.init(this.pageNum,this.pageSize,{missionId:this.$props.mid})
    },
    methods:{
      // 上一页
      previousPage(){
        if(this.pageNum>1){
          this.pageNum--
          console.log(this.pageNum)
          this.init(this.pageNum,this.pageSize,{missionId:this.$props.mid})
        }
      },
      // 下一页
      nextPage(){
        this.pageNum++
        this.init(this.pageNum,this.pageSize,{missionId:this.$props.mid})
      },

      // 切换点位
      changeactive(item){
				console.log(item)
        if(this.activeid==item.yjylAnchorPointId){
          // 不做操作
        }else{
          this.activeid=item.yjylAnchorPointId
          // 发送 数据
          this.$emit("changepoint",item)
        }
      },
      init(pageNum,pageSize,pagams){
        anchorPointList(pageNum,pageSize,pagams).then(res=>{
          console.log(res)
          if(res.code==200){
            if(res.data.total==0){
              this.hideing = false
              return
            }
            // this.activeid = res.data[0].yjylAnchorPointId
            this.hideing = true
            this.mapaddress = res.data.rows
            this.total = res.data.total
            let total = res.data.total
            let id = res.data.rows[0].yjylAnchorPointId
            if(pageNum==1&&this.isfirst){
              // this.activeid = id
              this.isfirst = false
            }
            // 如果 点位超过4 做分页
            if(total >4){
              this.showFy.showFyall=true
              //  判断当前页 是否大于 总数
              let nowSize = (this.pageNum*4)<total;
              if(nowSize){
                // 释放下一页功能
                this.showFy.showFyRight = true
              }else{
                // 关闭下一页功能
                this.showFy.showFyRight = false
              }
              // 判断上一页是否存在
              if(this.pageNum==1){
                // 不存在上一页
                this.showFy.showFyLeft = false
              }else{
                this.showFy.showFyLeft = true
              }
            }else{
              this.showFy.showFyall=false
              this.showFy.showFyLeft =false
              this.showFy.showFyRight =false
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .bottom{
    margin: auto;
    width: 868px;
    height: auto;
    position: relative;
    &-paging{
      color: white;
      width: 100%;
      height: 100px;
      position: absolute;
      top: -50px;
      left: 0px;
      &-left{
        position: absolute;
        left: 0px;
      }
      &-right{
        position: absolute;
        right: 0px;
      }
    }
    &-containet{
      background: rgba(3, 45, 96, 0.8);
      width: 794px;
      float: left;
      height: 35px;
    }
    &-bg{
      width: 864px;
      height: 12px;
      background-color: #0B4499;
    }
    &-list{
      width: 146px;
      height: 90px;
      float: left;
      cursor: pointer;
      // border: 5px solid;
      position: relative;
      // border-image: linear-gradient(0deg, #2460EA, #126FD8, #18ABE9) 10 10;
      // background: linear-gradient(0deg, #2460EA 0%, #126FD8 48%, #18ABE9 100%);
      margin-top: -64px;
      &-title{
        line-height: 90px;
        left: 100px;
        width: 100%;
        position: absolute;
        height: 100%;
        top: 0px;
        left: 0px;
        text-align: center;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        text-shadow: 0px 2px 3px rgba(14, 36, 65, 0.5);
        background: linear-gradient(180deg, #FCFCFC 0%, #A5C7EB 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  .active{
          line-height: 90px;
          left: 100px;
          width: 100%;
          position: absolute;
          height: 100%;
          top: 0px;
          left: 0px;
          text-align: center;
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
          text-shadow: 0px 2px 3px rgba(14, 36, 65, 0.5);
          background: linear-gradient(0deg, #FCC9B5 10.595703125%, #FFFFFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

  .box{
    width: 0;
    height: 0;
    border-bottom: 35px solid rgba(3, 45, 96, 0.8);
    border-left: 35px solid transparent;
    float: left;
  }
  .box3{
    width:0px;
    height:0px;
    float: left;
    border-bottom: 35px solid rgba(3, 45, 96, 0.8);
    border-right: 35px solid transparent;
    // margin-top:-35px
  }
  .box3{
    transform:translate(0px,0px)
  }
  .box{
    transform:translate(0px,0px)
  }

</style>
