<template>
  <div :class='isOpen? "details ":"details close"'>
    <model v-show="showModel"/>
    <div v-show="!showModel">
      <building v-if="buildingControl<1" />
      <floor  v-else-if="buildingControl<4"  />
      <room  v-else  />
    </div>
    <floorControl />
    <img v-if="isOpen" @click="isOpen=false" src="../../../assets/closePanel.png">
    <img v-else @click="isOpen=true" src="../../../assets/openPanel.png">
  </div>
</template>
<script>

import building from './building'
import floor from './floor'
import room from './room'
import model from './model'
import floorControl from './floorControl'
import {mapGetters} from 'vuex'
export default {
  name:'rightTop',
  components:{
    building,
    floor,
    room,
    floorControl,
    model
  },
  computed: {
    ...mapGetters([
      'buildingControl',
      'showModel'
    ])
  },

  data(){
    return{
      isOpen:true,

    }
  },
  methods:{


  }
}
</script>
<style lang="less" scoped>
.details{
  width: 380px;
  top: 80px;
  left: 1514px;
  transition:left 1s;
  position: relative;
  border: 1px solid rgba(229, 229, 229, 0.31);
  background: rgba(0, 50, 65, 0.8);
  >img{
    position: absolute;
    left: -24px;
    top: 0;
    width: 24px;
    right: -24px;
    cursor: pointer;
    transform: rotate(180deg);
  }
}

.close{
  left: 1920px;
  transition:left 1s;
}
</style>
