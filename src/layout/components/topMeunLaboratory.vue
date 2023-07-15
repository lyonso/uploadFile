<template>
  <div class='TopMenu'>
    <span @click='openPage(item)' v-for='(item,index) in list' :key='index'
          :class="activeIndex === item.path||activeIndex === item.path1 ? ' selectMenu' : 'commonStyle'">
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
          path: '/DILaboratory/BIMIndex',
          name: '实验室全景'
        },
        {
          path: '/DILaboratory/inspect',
          name: '数字检测'
        },
        {
          path: '/DILaboratory/IntelligentBuilding/security',
          path1: '/DILaboratory/IntelligentBuilding/environment',
          name: '智能物联'
        },
        // {
        //   path: '/DILaboratory/UETestScene',
        //   name: '测试场景'
        // }
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
.TopMenu {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 44px;
  color: #FFFFFF;

  span {
    display: inline-block;
    cursor: pointer;
    margin-right: 44px;
  }

  .selectMenu {
    color: rgba(239, 200, 0, 1);
    border-bottom: 2px solid rgba(239, 200, 0, 1);
  }
}


</style>
