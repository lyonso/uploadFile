<template>
  <div>
    <div id="pop1" class="pop" v-show="index1">
      <div class="pop_content" id="pop_content1"></div>
      <div class="pop_bot" id="pop_bot1"></div>
    </div>
    <div id="pop2" class="pop" v-show="index2">
      <div class="pop_content" id="pop_content2"></div>
      <div class="pop_bot" id="pop_bot2"></div>
    </div>
    <div id="pop3" class="pop" v-show="index3">
      <div class="pop_content" id="pop_content3"></div>
      <div class="pop_bot" id="pop_bot3"></div>
    </div>
    <div id="pop4" class="pop" v-show="index4">
      <div class="pop_content" id="pop_content4"></div>
      <div class="pop_bot" id="pop_bot4"></div>
    </div>
    <div id="pop5" class="pop" v-show="index5">
      <div class="pop_content" id="pop_content5"></div>
      <div class="pop_bot" id="pop_bot5"></div>
    </div>
  </div>

</template>

<script>
import {EventBus} from '@/mapJs/EventBus'

export default {
 name: "index",
 data(){
   return {
     index1:false,
     index2:false,
     index3:false,
     index4:false,
     index5:false,
     divIndex:false
   }
 },
 mounted() {

   let self = this
   EventBus.$on("getValueInfo",function(obj) {
      console.log(obj)
     this.index1=false;
     this.index2=false;
     this.index3=false;
     this.index4=false;
     this.index5=false;
     if(obj.data.length>0){
       for(let i=0;i<obj.data.length;i++){
         self.addData(obj.data[i]);
       }
     }
   })
  },
  methods:{
    /**
     * 数据添加
     * @param data
     */
    addData(data){
      let name =null,arr;
      if(typeof(data['有机指标检测区'])!=="undefined"){
        name="有机指标检测区";
        arr=data['有机指标检测区']
        this.setLocation(name,arr.length);
        $("#pop_content1").html("")
        this.dataAddToDiv(arr,"#pop_content1")
      }else if(typeof(data['常规理化检测区'])!=="undefined"){
        name="常规理化检测区";
        arr=data['常规理化检测区'];
        $("#pop_content2").html("")
        this.setLocation(name,arr.length);
        this.dataAddToDiv(arr,"#pop_content2")

      }else if(typeof(data['无机指标前处理区'])!=="undefined"){
        name="无机指标前处理区";
        arr=data['无机指标前处理区']
        $("#pop_content3").html("")
        this.setLocation(name,arr.length);
        this.dataAddToDiv(arr,"#pop_content3")

      }else if(typeof(data['无机指标检测区'])!=="undefined"){
        name="无机指标检测区";
        arr=data['无机指标检测区']
        $("#pop_content4").html("")
        this.setLocation(name,arr.length);
        this.dataAddToDiv(arr,"#pop_content4")

      }else if(typeof(data['生态指标检测区'])!=="undefined"){
        name="生态指标检测区";
        arr=data['生态指标检测区']
        $("#pop_content5").html("")
        this.setLocation(name,arr.length);
        this.dataAddToDiv(arr,"#pop_content5")
      }
    },
    dataAddToDiv(arr,element){
      console.log(arr)
      let p_html="";
      if(arr.length<8){
        for(let i=0;i<arr.length;i++){
          p_html+="<p>"+arr[i]['分析项']+":"+arr[i]['分析结果']+arr[i]['单位']+"</p>";
        }
        $(element).html(p_html);
      }else{
        for(let i=0;i<6;i++){
          p_html+="<p>"+arr[i]['分析项']+":"+arr[i]['分析结果']+arr[i]['单位']+"</p>";
        }
        $(element).html(p_html);
      }


    },
    setLocation(name,length){
      let self =this;
      switch (name) {
        case '有机指标检测区':
          $('#pop1').css("left","517px");
          $('#pop1').css("top","120px");
          self.setElementLocation("#pop1","#pop_bot1",length)
          self.index1=true;
          break;
        case '常规理化检测区':
          $('#pop2').css("left","40%");
          $('#pop2').css("top","40%");
          self.setElementLocation("#pop2","#pop_bot2",length)
          self.index2=true;
          break;
        case '无机指标前处理区':
          $('#pop3').css("left","25%");
          $('#pop3').css("top","66%");
          self.setElementLocation("#pop3","#pop_bot3",length)
          self.index3=true;
          break;
        case '无机指标检测区':
          $('#pop4').css("left","25%");
          $('#pop4').css("top","66%");
          self.setElementLocation("#pop4","#pop_bot4",length)
          self.index4=true;
          break;
        case '生态指标检测区':
          $('#pop5').css("left","40%");
          $('#pop5').css("top","60%");
          self.setElementLocation("#pop5","#pop_bot5",length)
          self.index5=true;
          break;
        default:
          break;
      }
    },
    setElementLocation(elementName,elementName1,length){
      if(length>2 && length<5){
        $(elementName).css("width","400px");
      }
      if(length>4 && length<7){
        $(elementName).css("width","600px");
        $(elementName1).css("margin-left","45%");
      }
      if(length>6){
        $(elementName).css("width","600px");
        $(elementName1).css("margin-left","45%");
      }
      // if(length>8 &&length<11){
      //   $(elementName).css("width","1000px");
      //   $(elementName1).css("margin-left","49%");
      // }
      // if(length>10 &&length<13){
      //   $(elementName).css("width","1200px");
      //   $(elementName1).css("margin-left","49%");
      // }
      // if(length>12 &&length<15){
      //   $(elementName).css("width","1400px");
      //   $(elementName1).css("margin-left","49%");
      // }
    }
  }
}
</script>

<style>


.pop{
  width: 220px;
  height: 100px;
  background-color: #1a5e79;
  color: white;
  position: absolute;
  top: 1%;
  left: 1%;
  border-radius: 5px;
  border: 1px solid #1a5e79;
}

.pop_content{
  width: 100%;
  height:100%;
  display: flex;
  flex-wrap: wrap;
}

.pop_bot{
  width: 0;
  height: 0;
  border: 25px solid;
  border-color: transparent transparent #322a2a;
  transform: rotateZ(180deg);
  margin-left: 35%;
}

.pop_content p{
  margin: 0;
  padding: 0;
  font-size: 15px;
  text-align: center;
  line-height: 40px;
  font-weight: bold;
  width: 200px;
  height: 50px;
}



</style>
