<template>
   <div id="wearth">
     <img src="../../../../../public/image/qing.png" height="24" width="24" @click="changeScene(1)"/>
     <img src="../../../../../public/image/rain.png" height="24" width="24" @click="changeScene(2)"/>
     <img src="../../../../../public/image/snow.png" height="24" width="24" @click="changeScene(3)"/>
   </div>
</template>

<script>
export default {
  name: "index",
  methods:{
    changeScene(val){
      this.$parent.earthScene(val)
    }
  }
}
</script>

<style scoped>
#wearth{
  position: absolute;
  width: 150px;
  height: 50px;
  top: 10%;
  right: 25%;
}

#wearth img{
  padding: 5px;
  cursor: pointer;
}
</style>
