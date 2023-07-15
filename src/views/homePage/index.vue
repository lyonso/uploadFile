<template>
  <div class='HomePage' >
    <Dialog v-if="HomeDialogDetails" class='leftTop' />
    <div v-else>
      <leftTop class='leftTop'/>
      <leftBottom @setRivers="setRivers" class='leftBottom'/>
    </div>
    <panel  class='panel'/>
    <dataPanel :rivers="rivers" class='dataPanel'/>
  </div>
</template>

<script>
import Dialog from './components/Dialog'

import leftTop from '@/views/homePage/components/leftTop'
import leftBottom from '@/views/homePage/components/leftBottom'

import panel from './components/panel'
import dataPanel from './components/datePanel'

import {mapGetters} from 'vuex'
export default {
  name: 'HomePage',
  components: {
    leftTop,
    leftBottom,
    panel,
    dataPanel,
    Dialog
  },
  computed: {
    ...mapGetters([
      'HomeDialogDetails'
    ])
  },
  mounted() {
    this.$store.dispatch('map/setMapState',0)
  },
  beforeDestroy() {
    this.$store.dispatch('map/setHomeDialogDetails','')
  },  data(){
    return{
      rivers : {
        One:0,
        two:0,
        three:0
      }
    }
  },
  methods:{
    setRivers(data){
      this.rivers =  data
    }
  }
}
</script>

<style lang='less' scoped>
.HomePage{
  position: relative;
  z-index: 10;
}
.leftTop{
  position: absolute;
  left: 1374px;
  top: 80px;
}
.leftBottom{
  position: absolute;
  left: 1374px;
  top: 510px;
}
.panel{
  position: absolute;
  top:calc(100vh - 140px);
  left: 201px;
}
.dataPanel{
  position: absolute;
  left: 1118px;
  top: 80px;

}
</style>
