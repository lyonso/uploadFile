<template>
  <div class='security'>
    <rightPanel />
    <layerControl />
    <videoPlayer v-if='openDialog===1' />
    <doorControl v-else-if='openDialog===2' />
    <alertDialog v-else-if='openDialog===3' />
  </div>
</template>

<script>
import rightPanel from './components/rightPanel'
import floorControl from './components/floorControl'
import layerControl from './components/layerControl'
import videoPlayer from './components/videoPlayer'
import doorControl from './components/doorControl'
import alertDialog from './components/alertDialog'
import { mapState } from 'vuex'

export default {
  name: 'security',
  components: {
    rightPanel,
    floorControl,
    layerControl,
    videoPlayer,
    doorControl,
    alertDialog
  },
  computed: {
    ...mapState({
      openDialog: state => state.security.openDialog
    })
  },
  mounted() {
    this.$store.dispatch('map/setMapState', 6)
  },
  data() {
    return {
      details: {}
    }
  },
  beforeDestroy() {
    this.$store.dispatch('security/setCloseDialog', false)
    this.$store.commit('security/SET_OPENDIALOG', 0)

  },
  methods: {}
}
</script>

<style lang='less' scoped>
.security {
  position: relative;
  z-index: 10;;
}
</style>

