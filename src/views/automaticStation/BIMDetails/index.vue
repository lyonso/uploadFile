<template>
  <div class='stationDetails'>
    <div class='Back' @click='goback'>返回</div>
    <floorControl :class='BIMDetailsStatus<3? "floorControlHide":"floorControl" ' />
    <siteOutside v-if='BIMDetailsStatus===1' class='siteOutside' />
    <siteInside v-else-if='BIMDetailsStatus===2' class='siteOutside' />
    <equipmentImg v-else-if='BIMDetailsStatus===3'  />
  </div>
</template>
<script>
import floorControl from './components/floorControl'
import siteOutside from './components/siteOutside'
import siteInside from './components/siteInside'
import equipmentImg from './components/equipmentImg'

import { mapGetters } from 'vuex'

export default {
  name: 'stationDetails',
  components: {
    siteOutside,
    siteInside,
    floorControl,
    equipmentImg
  },

  data() {
    return {
      activeType: 0
    }
  },
  created() {
  },
  computed: {
    ...mapGetters([
      'BIMDetailsStatus'
    ])
  },
  methods: {
    /**
     * 返回事件
     */
    goback() {
      switch (this.BIMDetailsStatus) {
        case 4:
          this.$store.dispatch('automaticStation/setBIMDetailsStatus', 2)
          break
        case 3:
          this.$store.dispatch('automaticStation/setBIMDetailsStatus', 2)
          break
        case 2:
          this.$store.dispatch('automaticStation/setBIMDetailsStatus', 1)
          break
        case 1:
          this.$store.dispatch('map/setMapState', 4)
          this.$router.push({
            path: '/automaticStation/stationDetails',
            query: { id: this.$route.query.id, name: this.$route.query.name }
          })
          break
      }
    }
  }
}

</script>

<style lang='less' scoped>
.stationDetails {
  width: 100%;
  position: absolute;
  z-index: 10;

  .Back {
    position: relative;
    top: 90px;
    left: 20px;
    width: 116px;
    height: 38px;
    text-align: center;
    font-weight: 400;
    font-size: 20px;
    line-height: 38px;
    color: #FFFFFF;
    background: rgba(8, 78, 95, 0.41);
    border: 1px solid #0089D7;
    border-radius: 3px;
    cursor: pointer;
  }
  .siteOutside {
    position: absolute;
    top: 90px;
    right: 20px;
  }
  .floorControl{
    position: absolute;
    right: 20px;
    top: 110px;
  }
  .floorControlHide{
    position: absolute;
    right: 415px;
    top: 110px;
  }
}
</style>

