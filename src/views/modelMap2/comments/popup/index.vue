<template>
   <div id="popInfo" v-show="status">
     <img src="../../../../../public/image/p1.png"/>
     <p id="p1">{{name}}</p>
     <div id="border_div">
       <p>{{textValue}}</p>
     </div>
   </div>
</template>

<script>
export default {
  name: "index",
  data(){
    return{
      name:"第一环节排水:开3#阀",
      status:false,
      textValue:"排空沉沙桶清洗水"
    }
  },
  methods:{
    changeStatus(status){
      if(status){
        $("#popInfo").show(1000)
      }
      this.status = status
    },
    changeDivScreenPosition(obj,text,info){
      if(!this.status){
        this.status =true
      }
      this.name = text;
      this.textValue = info
      document.getElementById("popInfo").style.top =obj.top+'px';
      document.getElementById("popInfo").style.left =obj.left+"px";
    }
  }
}
</script>

<style scoped>
#popInfo {
  position: absolute;
  width: 490px;
  height: 80px;
}
#popInfo img{
  width: 100%;
  height: 100%;
}
#popInfo #p1{
  position: absolute;
  margin: 0;
  padding: 0;
  top: 1%;
  font-size: 18px;
  line-height: 48px;
  left: 35%;
  color: white;
}

#border_div{
  width: 322px;
  height: 140px;
  border: 2px solid #47817b;
  margin-left: 33.5%;
  position: absolute;
  top: 47px;
  text-align: left;
  background-color: #38424b;
}

#border_div p{
  font-size: 20px;
  padding: 0;
  margin: 0;
  color: white;
}
</style>
