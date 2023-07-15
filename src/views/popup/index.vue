<template>
   <div id="popup" v-show="status">
     <img src="../../../public/label/floor.png" height="150" width="207" />
   </div>
</template>

<script>
import {EventBus} from '@/mapJs/EventBus';

export default {
  name: "popup",
  data(){
    return{
      status:false
    }
  },
  mounted() {
     let self = this
     EventBus.$on("popup",function(obj) {
       if(obj.status){
         self.status=obj.status;
         self.setDivInScreenLocation(obj)
       }else{
         self.status =false;
       }
     })
  },
  methods:{
    setDivInScreenLocation(obj){
       if(Number(obj.x)>0 && Number(obj.y)>0){
         this.status =true
         document.getElementById('popup').style.top=obj.y-140+'px';
         document.getElementById('popup').style.left=obj.x+'px';
       }else{
         this.status =false
       }

    }
  }
}
</script>

<style scoped>
#popup{
  position: absolute;
  width:270px;
  height: 150px;
}

</style>
