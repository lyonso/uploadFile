<template>
   <div id="popup" style="width: 230px;height: 170px;">
     <img src="../../../public/image/pou1.png" width="100%" height="100%" />
   </div>
</template>

<script>
import {EventBus} from '@/mapJs/EventBus';

export default {
  name: "index",
  data(){
    return{

    }
  },
  mounted() {
    EventBus.$on('popup',function(obj) {
      document.getElementById("popup").style.width =obj.x+"px"
      document.getElementById("popup").style.height =obj.y+"px"
    })
  },
  methods:{

  }

}
</script>

<style scoped>
#popup{
  position: absolute;
}
</style>
