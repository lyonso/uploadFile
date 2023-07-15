<template>
  <div v-show="status" id="personDiv" style="position: absolute;">
    <div id="popup">
      <p id="popup_close" title="关闭" @click="closePerson()">×</p>
      <div id="p_div1">
        <p style="margin-left: 4%;font-size: 18px;line-height: 22px;" id="popup_text">基础信息</p>
      </div>
      <div id="p_div2">
        <div id="p_div2_div" style="width: 30%;">
          <!--               <img src="image/scene001/person_ico.png" id="popup_img">-->
        </div>
        <div style="width: 69%;">
          <ul>
            <li>
              <p class="p1" id="name1">姓名</p>
              <span>|</span>
              <p class="p2" id="p_username">张xx</p>
            </li>
            <li>
              <p class="p1" id="name2">职务</p>
              <span>|</span>
              <p class="p2" id="p_job">88888123</p>
            </li>
            <li id="doing_li">
              <p class="p1" id="name3">联系电话</p>
              <span>|</span>
              <p class="p2" id="p_number">13212345456</p>
            </li>
          </ul>
        </div>
      </div>
      <el-button type="primary" @click="showTrack()">轨迹回放</el-button>
      <div v-show="time" id="time">
        <el-date-picker
          v-model="value1"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="change"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </div>
    </div>
  </div>
</template>

<script>
import { PopupBus } from '@/mapJs/PopupBus'
import supermapJs from '@/mapJs/supermapJs'
import storage from 'store'
export default {
name: "index",
  data(){
     return{
       status:false,
       value1:'',
       time:false,
       layerType:null,
       globalId:null,
       pickerOptions: {
         disabledDate(time) {
           return time.getTime() > Date.now();
         },
       },
       webServer:"http://10.8.45.60:8088"
     }
  },
  mounted() {
    let self =this;
    PopupBus.$on("person",function(res) {
      document.getElementById('personDiv').style.top =res.y - 150 + 'px'
      document.getElementById('personDiv').style.left = res.x+50 + 'px'
    });

    PopupBus.$on('close',function() {
      self.status =false;
      PopupBus.$emit('closePerson',true)
    })

    PopupBus.$on("personValue",function(val) {
      self.status =true
      self.layerType="person";
      self.getPersonInfo(val);
    })

    PopupBus.$on("shipValue",function(val) {
      self.status = true
      self.layerType="ship";
      self.getShipInfo(val)
    })

    PopupBus.$on("carValue",function(val) {
      self.status = true
      self.layerType="car";
      self.getCarInfo(val)
    })

  },
  methods:{
    getShipInfo(id) {
      this.globalId=id;
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          "access_token":tokenValue
        },
        type:'get',
        url:self.webServer+"/api/jcsj/ship/"+id,
        data:{},
        dataType:'json',
        success:function(res){
          if(res.code==="200" || res.code ===200){
            $("#name1").html("船舶类型");
            $("#name2").html("船舶名称");
            $("#doing_li").hide();
            $("#p_username").html(res.data.shipName);
            $("#p_job").html(res.data.shipType);
            if(res.data.shipPhoto!==""){
              $("#popup_img").attr("src",res.data.shipPhoto);
            }
          }
        },
        err:function () {}
      })
    },
    closePerson(){
      this.status =false
      PopupBus.$emit("closeInfo",true)
    },
    showTrack(){
      this.time =true
    },
    change(){
      let startTime = this.value1[0]+' '+"00:00:00";
      let endTime = this.value1[1]+' ' +"00:00:00";
      this.time =false;
      this.ajaxGetCoordinates(this.globalId,this.layerType,this.globalId,startTime,endTime)

    },
    getCarInfo(id) {
      this.globalId=id;
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers:{
          "Content-type":"application/json",
          "access_token":tokenValue
        },
        type:'get',
        url:self.webServer+"/api/jcsj/car/"+id,
        data:{},
        dataType:'json',
        success:function (res) {
          if(res.code==="200" || res.code ===200){
            $("#name1").html("汽车类型");
            $("#name2").html("车牌号码");
            $("#doing_li").hide();
            $("#p_username").html(res.data.carName);
            $("#p_job").html(res.data.carNo);
            if(res.data.carPhoto!==""){
              $("#popup_img").attr("src",res.data.carPhoto);
            }
          }
        },
        err:function () {}
      })
    },
    getPersonInfo(id) {
      this.globalId=id;
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          "access_token":tokenValue
        },
        type:'get',
        url:self.webServer+"/api/jcsj/jcsjPerson/"+id,
        data:{},
        dataType:'json',
        success:function(res){
          if(res.code==="200" || res.code ===200){
            $("#name1").html("姓名");
            $("#name2").html("职务");
            $("#name3").html("联系电话");
            $("#p_username").html(res.data.userName);
            $("#p_job").html(res.data.userDutyTrans);
            $("#p_number").html(res.data.userPhone);
            if(res.data.userPhoto!==""){
              $("#popup_img").attr("src",res.data.userPhoto);
            }
          }
        },
        err:function () {}
      })
    },
    /**
     * 查询轨迹
     * @param id
     * @param layerType
     * @param entityId
     * @param startTime
     * @param endTime
     */
    ajaxGetCoordinates(id,layerType,entityId,startTime,endTime) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          "access_token":tokenValue
        },
        type:'get',
        url:self.webServer+"/api/yjyl/trajectory/list",
        data:{
          beginTime:startTime,
          endTime:endTime,
          jcsjPcsId:id,
          layerType:layerType,
        },
        dataType:'json',
        success:function (res) {
          console.log("返回数据");
          console.log(res);
          if(res.code===200 || res.code ==="200"){
            if(res.data.length>1){
              self.intervalUpdatePosition(entityId,res.data);
            }else{
              self.$message({
                message: '暂无轨迹数据！',
                type: 'success'
              });
            }
          }
        },
        err:function (err) {}
      })
    },
    intervalUpdatePosition(id,data) {
      console.log("111111111111")
      let self = this
      let pointArrayLine = [];
      let timePointArray = [];
      let entity = self.$parent.viewer.entities.getById(id);
      if(typeof(entity)!=="undefined"){
        for(let i=0;i<data.length;i++){
          let arrayPoint=[];
          pointArrayLine.push(parseFloat(data[i].longitude));
          pointArrayLine.push(parseFloat(data[i].latitude));
          pointArrayLine.push(parseFloat(16));
          arrayPoint.push(parseFloat(data[i].longitude));
          arrayPoint.push(parseFloat(data[i].latitude));
          timePointArray.push(arrayPoint);
        }
        supermapJs.addPolylineToMap(pointArrayLine,self.$parent.viewer);
        self.lineSegmentProcessing(timePointArray,entity);
      }
    },
    lineSegmentProcessing(arrayPoint,entity) {
      let time=200,record=0.01;
      let options = {units: 'miles'};
      let line = turf.lineString(arrayPoint);
      // let length = parseFloat(turf.length(line,options))*1609;
      let along = null;
      let index = 0.001;
      let pointArray =[];
      let self = this;
      self.closePerson();
      let s = setInterval(function () {
        along = turf.along(line,index,options);
        pointArray.push(along.geometry.coordinates[0]);
        pointArray.push(along.geometry.coordinates[1]);
        pointArray.push(2);
        let pt = turf.point([along.geometry.coordinates[0],along.geometry.coordinates[1]]);
        let isPointOnLine = turf.booleanPointOnLine(pt,line);
        entity.position = Cesium.Cartesian3.fromDegrees(parseFloat(along.geometry.coordinates[0]),parseFloat(along.geometry.coordinates[1]),15);
        if(isPointOnLine){
          window.clearInterval(s);
          self.removeEntityByIds("line001");
        }
        index+=record;
      },time);
    },
    removeEntityByIds(id) {
      let self = this
      let entity = self.$parent.viewer.entities.getById(id);
      if(typeof(entity)!=="undefined"){
        let status =self.$parent.viewer.entities.remove(entity);
        if(status) {
          return;
        }else{
          let status2 =self.$parent.viewer.entities.removeById(id);
          if(!status2){
            entity.show=false;
          }
        }
      }
      self.$parent.viewer.render();
    },
  }
}
</script>

<style scoped>
#time{
  margin-top: 40%;
}
#popup{
  width: 408px;
  height: 213px;
  position: absolute;
  top: 1%;
  left: 1%;
  background: url("../../../public/image/scene001/popup.png") no-repeat;
  display: flex;
  flex-wrap: wrap;
}

#p_div1{
  width: 100%;
  height: 50px;
  display: flex;
  color: white;
}

#p_div2{
  width: 100%;
  height: 120px;
  display: flex;
  position: absolute;
  margin-top: 11%;

}
#p_div2 ul{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 102%;
}

#p_div2 ul li{
  height: 30%;
  display: flex;
}

.p1{
  color: #0c82db;
  font-weight: bold;
  width: 40%;
  text-align: center;
  margin-top: 6%;
}

#p_div2 span{
  color: white;
  margin-top: 6%;
  width: 7%;
}

.p2{
  color: white;
  font-size: 14px;
  font-weight: bold;
  margin-top: 7%;
}

#p_div2_div{
  height: 90%;
  width: 25%;
  margin-left: 5%;
  margin-top: 3%;
}

#popup_close{
  position: absolute;
  right: 7px;
  color: #f7f7f7;
  cursor: pointer;
  font-size: 35px;
  margin-top: 1%;
}

#p_div2_div{
  background: url("../../../public/image/scene001/coner@2x.png") no-repeat;
  background-size: 100% 99.6%;
}

#p_div2_div img{
  width: 90%;
  height: 93%;
  margin-top: 3%;
  margin-left: 5%;
}

#playWnd{
  width: 406px;
  height: 163px;
  margin-left: 1px;
}

#popup button{
  margin-left: 8%;
  position: absolute;
  bottom: 3%;
  color: white;
  border: 1px;
  cursor: pointer;
  height: 35px;
}
</style>
