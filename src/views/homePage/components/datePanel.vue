<template>
  <div >
    <div class='datePanel'>
      <div class='title'>
        <span>监测时间</span>
        <span></span>
      </div>
      <div class='date'>
        {{ date.year }}
        <span>年</span>
        {{ date.month }}
        <span>月</span>
      </div>
      <div class='line' />
    </div>
    <div class='item grean'>
      <div>{{rivers.One}}</div>
      <div class='item_body'>
        <div>优质省际河流</div>
        <div>(优于Ⅲ类)</div>
      </div>
    </div>
    <div class='item blue'>
      <div>{{rivers.two}}</div>
      <div class='item_body blue'>
        <div>优质省际湖泊</div>
        <div>(优于Ⅲ类)</div>
      </div>
    </div>
    <div class='item org'>
      <div>{{rivers.three}}</div>
      <div class='item_body'>
        <div>优质入湖河道</div>
        <div>(优于Ⅲ类)</div>
      </div>
    </div>

  </div>


</template>
<script>
  import moment from 'moment'
  export default {
    name:'datePanel',
    props:{
      rivers:{
        type: Object,
        default: () => {
          return {
            One:0,
            two:0,
            three:0
          }
        }
      },
    },
    watch:{
      rivers(val){
        console.log(val)
      }
    },
    data(){
      return{
        date: {}
      }
    },
    mounted() {
      // const that = this
      // this.timer = setInterval(() => {
      //   that.date = new Date()
      // }, 1000)
      const  todayDate  = new Date()
      let month= todayDate.getMonth();
      let year= todayDate.getFullYear();
      if(month == 0){
        year = year -1;
        month = 12;
      }
      this.date = {
        month,
        year,
      }
    },
    beforeDestroy() {
      if (this.timer) clearInterval(this.timer)
    },
    // filters: {
    //   timeFormat(value, format = 'HH:mm:ss') {
    //     return moment(value).format(format)
    //   }
    // },
  }
</script>
<style lang='less' scoped>
.datePanel{
  width: 226px;
  background: rgba(20, 31, 31, 0.61);
  padding:5px 7px;
}
.title{
  padding-bottom: 6px;
  border-bottom:1px solid rgba(238, 238, 238, 0.45);
  >:first-child{
    display:inline-block;
    text-align: center;
    width: 68px;
    height: 18px;
    line-height: 18px;
    background: #F9D000;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #0C1111;
  }
  :nth-child(2){
    display:inline-block;
    margin-left: 5px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF
  }

}
.date{
  width: 227px;
  height: 49px;
  background: #F9D000;
  margin-top: 5px;
  line-height: 49px;
  font-size: 45px;
  font-family: DS-DIGIB;
  font-weight: bold;
  color: #0B2834;
  text-align: center;
  span{
    font-size: 28px !important;
  }

}
.line{
  width: 100%;
  height:1px;
  margin-top: 5px;
  background: rgba(238, 238, 238, 0.45);
}
.item{
  position: relative;
  width: 164px;
  height: 55px;
  margin: 15px 0 0 70px;
  background: rgba(0, 0, 0, 0.29);
  >:first-child{
    display:inline-block ;
    font-size: 43px;
    width: 60px;
    text-align: center;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 55px;
  }
}

.item_body{
  display:inline-block;
  :first-child{
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #D7D8D8;
  }
  :nth-child(2){
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(215, 216, 216, 0.73) !important;
  }
}
.item:before{
  position: absolute;
  display: block;
  content:'';
  width: 0;
  height: 0;
  border-right: 12px solid transparent;
}

.grean{
  color: #34AF5A;
}
.item:before{
  border-top: 14px solid #34AF5A;
}
.blue{
  color: #2ACDD2;
}
.blue:before{
  border-top: 14px solid #2ACDD2;
}
.org{
  color: #E95200;
}
.org:before{
  border-top: 14px solid #E95200;
}
</style>