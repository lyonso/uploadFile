<template>
  <div class='DILaboratory'>
    <span @click='openPage(item)' v-for='(item,index) in list' :key='index'
          :class="activeIndex === item.path? ' selectMenu' : 'commonStyle'">
      {{ item.name }}
    </span>
  </div>
</template>
<script>
export default {
  name: 'DILaboratory',
  data() {
    return {
      list: [
        {
          path: '/DILaboratory/IntelligentBuilding/security',
          pathOne: '',
          name: '安全监控'
        },
        {
          path: '/DILaboratory/IntelligentBuilding/environment',
          pathOne: '',
          name: '环境监测'
        }
      ]
    }
  },
  computed: {
    activeIndex() {
      return this.$route.path
    }
  },
  components: {},
  methods: {
    openPage(item) {
      this.$router.push({
        path: item.path
      })
    }
  }
}
</script>

<style lang='less' scoped>
.DILaboratory {
  position: absolute;
  line-height: 32px;
  top: 65px;
  right: 60px;
  text-align: center;
  display: inline-block;
  font-size: 16px;

  span {
    display: inline-block;
    background-image: url("../../assets/but_bg_hover.png");
    background-size: 100% 100%;
    font-weight: 400;
    color: #FFFFFF;
    width: 110px;
    height: 32px;
    cursor: pointer;
    margin-right: 44px;
  }

  .selectMenu {
    background-image: url("../../assets/but_bg.png");
    //border-bottom: 2px solid rgba(239, 200, 0, 1);
  }
}
</style>
