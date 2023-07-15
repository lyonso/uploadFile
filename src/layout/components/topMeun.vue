<template>
  <div class="TopMenu">
    <span @click="openPage(item)" v-for="(item,index) in list" :key="index" :class="activeIndex === item.path ? ' commonStyle' : 'commonStyle'">
      {{ item.name }}
    </span>
  </div>
</template>

<script>


export default {
  name: 'TopMenu',
  data() {
    return {
      list: [
        {
          path: '/automaticStation/stationDetails',
          name: '仪表仪器',
          params: { userId: '123' }
        }
      ]
    }
  },
  computed: {
    activeIndex() {
      return this.$route.path
    }
  },
  components: {

  },
  methods: {
    openPage() {
      this.$store.dispatch('map/setMapState', 3)
      this.$router.push({
        path: '/automaticStation/BIMDetails',
        query: {
          id:'63205300',
          name:'太浦河口站'
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.topMenu {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  opacity: 0.7;
  .commonStyle {
    display: inline-block;
    margin-right: 50px;
    cursor: pointer;
    .svgBackground {
      position: absolute;
      width: 72px;
      top: 50px;
    }
  }
  .selectMenu {
    color: #00FFFF;
  }
}


</style>
