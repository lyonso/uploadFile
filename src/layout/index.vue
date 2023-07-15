<template>
    <div class="app-wrapper">
      <div class="main-container">
        <!--顶部-->
        <div class="fixed-header">
          <navbar />
        </div>

        <!--左侧转盘-->
        <div class="fixed-left">
          <left-nav />
        </div>

        <!--内容-->
        <app-main  class="main"/>
      </div>
    </div>
</template>

<script>
import { AppMain, Navbar, LeftNav } from './components'
// import ScreenContainer from '@/components/ScreenContainer'

export default {
  name: 'Layout',
  data() {
    return {

    }
  },
  components: {
    AppMain,
    Navbar,
    LeftNav,
    // ScreenContainer,
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.app-wrapper {
  position: relative;
  overflow: hidden;
  height: 1080px;
  width: 1920px;

  &:after {
    content: "";
    display: table;
    clear: both;
  }
}
.fixed-header{
  position: absolute;
  width:100%;
  z-index: 99;
}
.main-container {
  width: 100%;
  height: 100%;
}
.main{
  //position: absolute;
  height: 100%;
}


</style>
