<template>
  <div class='BIMIndex'>
        <rightPanel v-if='BIMIndexStatus===1' />
        <imgList v-else />
        <floorControl />
<!--        <modelPreview />-->
<!--    <modelview />-->
<!--    <modelView2  model='YiQi'/>-->
  </div>
</template>

<script>
import floorControl from './component/floorControl'
import rightPanel from './component/rightPanel'
import imgList from './component/imgList'
// import modelPreview from '@/views/DILaboratory/BIMIndex/component/modelPreview'
import modelview from '@/views/3DLaboratory/components/model'
import modelView2 from '@/views/model'

import { mapState } from 'vuex'

export default {
  components: {
    floorControl,
    rightPanel,
    imgList,
    modelview,
    modelView2
  },
  computed: {
    ...mapState({
      BIMIndexStatus: state => state.security.BIMIndexStatus
    })
  },
  created() {
    this.$store.dispatch('map/setMapState', 8)
  },
  beforeDestroy() {
    this.$store.commit('security/SET_BIMDETAILSSTATUS', 1)
  },
  data() {
    return {}
  }

}
</script>

<style lang='less' scoped>
.BIMIndex {
  position: relative;
  z-index: 10;
}
</style>
