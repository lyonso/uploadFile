<template>
  <div class="system">
    <div class="system-left">
      <el-menu
          :default-active='activeIndex'
          class="el-menu-vertical-demo"
          background-color="transparent"
          text-color="#EBF0FF"
          @select='handleSelect'
          style='border: 0px;'
          active-text-color="#F9D000">
        <el-menu-item :index="item.path" v-for="(item,index) in listArr" :key="index">
          <svg-icon :icon-class="item.path == activeIndex ?item.iconSelect:item.icon" style="margin-right: 10px"/>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="system-right">
      <div class="title">

        {{$route.meta.title}}
        <i  @click="goBack"class="el-icon-s-unfold button_right"></i>
      </div>
      <transition name="fade-transform" mode="out-in">
        <router-view :key="activeIndex" />
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'System',
  data() {
    return {
      listArr: [
        {
          name: '固定视频点管理',
          value: 1,
          path: '/monitor/system/videoPoints',
          icon: 'video',
          iconSelect: 'videoSelect'
        },
        {
          name: '车辆管理',
          value: 2,
          path: '/monitor/system/carManage',
          icon: 'car',
          iconSelect: 'carSelect'
        },
        {
          name: '船舶管理',
          value: 3,
          path: '/monitor/system/boatsManage',
          icon: 'ship',
          iconSelect: 'shipSelect'
        },
        {
          name: '人员管理',
          value: 4,
          path: '/monitor/system/peopleManage',
          icon: 'person',
          iconSelect: 'personSelect'
        },
        {
          name: '无人机管理',
          value: 5,
          path: '/monitor/system/unmannedManage',
          icon: 'uas',
          iconSelect: 'uasSelect'
        },
        {
          name: '自动监测站管理',
          value: 6,
          path: '/monitor/system/pointsStation',
          icon:'station',
          iconSelect: 'stationSelect'
        },
        {
          name: '标签管理',
          value: 7,
          path: '/monitor/system/stationManage',
          icon:'station',
          iconSelect:'stationSelect'
        },
        {
          name: '标注管理',
          value: 8,
          path: '/monitor/system/markerManage',
          icon: 'marker',
          iconSelect: 'markerSelect'
        }
      ]
    }
  },
  computed: {
    activeIndex() {
      return this.$route.path
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push({ path: key })
    },
    goBack(){
      this.$router.push('/monitor/monitorList')
    }
  }
}
</script>
<style lang="less" scoped>
.system {
  position: relative;
  z-index: 10;
  background: url("../../assets/bg.png");
  background-size: 100% 100%;
  height: 100vh;
  &-left {
    position: absolute;
    top: 100px;
    left:37px;
    width: 276px;
    height: calc(100vh - 120px);
    background: rgba(1, 41, 61, 0.48);
    .el-menu-item {
      font-size: 16px;
      height: 60px;
    }
    ::v-deep .el-menu-item.is-active {
      background-color: #053340!important;
      border-right: 4px solid #F9D000;
    }
    ::v-deep .el-menu-item:focus, .el-menu-item:hover {
      background-color: #053340!important;
      border-right: 4px solid #F9D000;
      color: #FFD200!important;
    }
  }
  &-right {
    position: absolute;
    top: 100px;
    left: 333px;
    width: 1553px;
    height: calc(100vh - 120px);
    background: rgba(1, 41, 61, 0.48);
    border: 1px solid rgba(0, 204, 255, 0.08);
    .title {
      width: 100%;
      height: 44px;
      background: rgba(0, 0, 0, 0.4);
      line-height: 44px;
      font-size: 24px;
      font-family: PingFang SC;
      padding-left: 25px;
      font-weight: 500;
      color: #FFD200;
      box-sizing: border-box;
    }
    .title::before {
      position: absolute;
      content: '';
      left: 10px;
      top: 8px;
      width: 5px;
      height: 28px;
      background: rgba(0, 255, 255, 0.76);
    }
  }
}
.button_right{
  position: absolute;
  right: 20px;
  top: 10px;
  color: #98A2A3;
  cursor: pointer;
}
</style>
