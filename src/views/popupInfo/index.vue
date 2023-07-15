<template>
  <div id="event" v-show="status">
    <div class="event_div event_header">
      <p id="header_title">事件详情</p>
      <p id="event_close" title="关闭" @click="closeInfo()">×</p>
    </div>
    <div class="event_div event_body">
      <div style="width: 100%;margin-left: 2%;">
        <ul>
          <li style="margin-top: 4%;">
            <p class="event_p">事件名称</p>
            <span class="event_span" style="margin-left: 4.5%;">|</span>
            <p id="event_p1">太浦河北岸部分</p>
          </li>
          <li>
            <p class="event_p">事件类型</p>
            <span class="event_span" style="margin-left: 4.5%;">|</span>
            <p id="event_p4">污染事件</p>
          </li>
          <li>
            <p class="event_p">事件等级</p>
            <span class="event_span" style="margin-left: 4.5%;">|</span>
            <p id="event_p5">中</p>
          </li>
          <li>
            <p class="event_p">发生时间</p>
            <span class="event_span" style="margin-left: 4.5%;">|</span>
            <p id="event_p2">2021-02-11 13:00</p>
          </li>
          <li>
            <p class="event_p" style="width:45%;">事件描述</p>
            <span style="color: white;margin-top: 1%;margin-left: 3.5%;">|</span>
            <div id="event_p3">
              京杭大运河无锡段柴油运输船与运沙船相撞，柴油泄漏，污染物可能影响太浦河下游水源地。
            </div>
          </li>
          <li style="margin-top: 17%;">
            <p class="event_p" style="width: 19%;">现场情况</p>
            <span style="color: white;margin-top: 1%;margin-left: 3.5%;">|</span>
            <div id="event_div"></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {PopupBus} from '@/mapJs/PopupBus'
import storage from 'store'
export default {
name: "index",
  data(){
     return{
       status:false,
       webServer:process.env.VUE_APP_BASE_API
     }
  },
  mounted() {
    let self =this;
    PopupBus.$on("popup",function(res) {
      console.log(res)
      document.getElementById('event').style.top =res.y - 150 + 'px'
      document.getElementById('event').style.left = res.x+50 + 'px'
    });

    PopupBus.$on('close',function() {
      self.closeInfo();
    })

    PopupBus.$on("infoVue",function(val) {
      self.status =true
      self.getWaringInfo(val);
    })

  },
  methods:{
    closeInfo(){
      console.log(11111)
      this.status =false
      PopupBus.$emit('closeInfo',true);
    },
    getWaringInfo(id) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers:{
          "access_token":tokenValue
        },
        type:'get',
        url:self.webServer+"/api/yjyl/missionInfo/"+id,
        data:{},
        dataType:'json',
        success:function (res) {
          if(res.code==="200" || res.code ===200){
            $("#event_p1").html(res.data.infoName);
            $("#event_p4").html(res.data.eventType);
            $("#event_p5").html(res.data.eventLevel);
            $("#event_p2").html(res.data.infoTime);
            $("#event_p3").html(res.data.infoContent);
            if(res.data.eventPic!=="null" && res.data.eventPic!==null){
              // let files = res.data.eventPic.split(",");
              let files = JSON.parse(res.data.eventPic)
              if(files.length>0){
                let imgs ="";
                for(let i=0;i<files.length;i++){
                  imgs+="<img src='"+files[i]+"'>";
                }
                $("#event_div").html(imgs);
              }
            }
          }
        },
        err:function () {}
      })
    },
  }
}
</script>

<style scoped>
/**
  事件提示框
 */
#event{
  position: absolute;
  width: 408px;
  height: 389px;
  border-image: linear-gradient(-30deg, #000000, #FD2B3F) 10 10;
  background: url('../../../public/image/scene001/waring_event_b2.png') no-repeat;
  opacity: 0.9;
  border-radius: 20px 0px 20px 0px;
  display: flex;
  top: 1%;
  flex-wrap: wrap;
  background-color: #1d2325;
  background-color: whitesmoke;
  /*display: none;*/
}

#event .event_div{
  width: 100%;
}


.event_header{
  height: 40px;
  /*background: rgba(253, 43, 63, 0.3);*/
  border-radius: 20px 20px 0px 0px;
  display: flex;
}

.event_body{
  height: 343px;
  display: flex;
}



#event_p1{
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #FFD905;
}

.event_p{
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #15CFF7;
  margin-top: 1%;
}

#event_p1,#event_p2{
  margin-top: 1%;
  margin-left: 3%;
}


#event_p2,#event_p3{
  color: #FFFFFF;
  font-family: PingFang SC;
  font-weight: 400;
}


#event_p6{
  margin-top: 1%;
  margin-left: 3%;
  color: white;
}

#event_p5{
  margin-top: 1%;
  margin-left: 2.5%;
  color: white;
}

#event_p4{
  margin-top: 1%;
  margin-left: 3%;
  color: white;
}


#event_p3{
  margin-left: 4%;
  margin-top: 1%;
  width: 174%;
  height: 100px;
  text-overflow: ellipsis;
  overflow-y: auto;
}

.event_body ul{
  width: 100%;
  height: 100%;
  padding: 0;
  margin-top: -5%;
}

.event_body ul li{
  width: 100%;
  height: 35px;
}

.event_body ul li{
  display: flex;
}


.event_header #header_title {
  margin-left: 2%;
  color: white;
  font-size: 20px;
  font-family: Source Han Sans SC;
  font-weight: 400;
  margin-top: 5px;
}


.event_span{
  color: white;
  width: 2%;
  margin-top: 1%;
}



#event_close{
  font-size: 35px;
  color: white;
  position: absolute;
  right: 3%;
  margin-top: 1%;
  cursor: pointer;
}

#event_div{
  width: 75%;
  height: 95px;
  margin-left: 3%;
  margin-top: 5px;
  overflow-x: auto;
  display: flex;
}

#event_div img{
  width: 85px;
  height: 73px;
}

</style>
