<template>
  <div class="main" >
    <div class="main-topimg">
      <div class="main-containers">
        <router-link to="/monitor/system/videoPoints">
          <div class="main-containers-list">
            <div class="main-containers-bg">
              <img src="../../../assets/bglist.png" alt="" />
            </div>
            <div class="main-containers-content">
              <div class="main-containers-icon">
                <img src="../../../assets/icon_info.png" alt="" />
              </div>
              <div class="main-containers-title">基础数据管理</div>
            </div>
          </div>
        </router-link>
        <router-link to="/monitor/monitorExercise">
          <div class="main-containers-list" >
            <div class="main-containers-bg">
              <img src="../../../assets/bglist.png" alt="" />
            </div>
            <div class="main-containers-content">
              <div class="main-containers-icon">
                <img src="../../../assets/icon_gl.png" alt="" />
              </div>
              <div class="main-containers-title">业务场景管理</div>
            </div>
          </div>
        </router-link>
        <router-link to="/monitor/monitorCommand">
          <div class="main-containers-list" >
            <div class="main-containers-bg">
              <img src="../../../assets/bglist.png" alt="" />
            </div>
            <div class="main-containers-content">
              <div class="main-containers-icon">
                <img src="../../../assets/icon_yjzh.png" alt="" />
              </div>
              <div class="main-containers-title">应急监测指挥</div>
            </div>
          </div>
        </router-link>
      </div>>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  created() {
    this.$store.dispatch('map/setMapState',-1)
  },
  mounted() {

  },
  methods: {

  },
};
</script>

<style scoped lang="less">
@-webkit-keyframes move {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-40px);
  }
  100% {
    transform: translateY(0);
  }
}
.left {
  float: left;
}
.main {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100vh;
  background: url(../../../assets/bg_yjzh.png);
  background-size: 100% 100%;
  &-containers {
    width: 80%;
    height: auto;
    padding-top: 230px;
    margin: auto;
    &-title {
      width: 100%;
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-top: 4%;
    }
    &-tips {
      width: 100%;
      text-align: center;
      color: #7babdd;
      font-size: 14px;
      line-height: 24px;
      margin-top: 3%;
    }
    &-list {
      width: 25%;
      height: 100px;
      float: left;
      margin-left: 7.5%;
      position: relative;
      animation: move 5s ease-in-out infinite;
    }
    &-bg {
      width: 100%;
      position: absolute;
      height: auto;
      top: 0px;
      left: 0rem;
      img {
        width: 100%;
      }
    }
    &-content {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0rem;
      z-index: 9;
    }
    &-icon {
      width: 49%;
      margin: auto;
      margin-top: 30%;
      cursor: pointer;
      img {
        width: 100%;
        transition: transform 2s;
        &:hover {
          transform: rotateY(3.142rad);
        }
      }
    }
  }
  &-topimg {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
  }
  &-title {
    width: 100%;
    height: auto;
    font-family: YouSheBiaoTiHei;
    color: white;
    font-size: 16px;
    position: relative;
  }
  &-out {
    width: auto;
    font-family: sbold;
    position: absolute;
    left: 10.0625rem;
    color: #9fceff;
    height: auto;
    top: 12px;
    img {
      width: 2.5rem;
      height: 2.5rem;
      float: left;
    }
    div {
      line-height: 2.5rem;
    }
    z-index: 9;
  }
  &-center {
    width: 100%;
    position: absolute;
    left: 0%;
    top: 20px;
    text-align: center;
    font-size: 20px;
    line-height: 3.125rem;
    font-weight: bold;
  }
  &-right {
    width: auto;
    position: absolute;
    z-index: 99;
    right: 10%;
    top: 10px;
    &-day {
      width: auto;
      float: left;
      margin-top: 12px;
      &-time {
        float: left;
        font-size: 36px;
        color: #ffffffff;
        width: 160px;
      }
      &-mouth {
        float: left;
        font-size: 16px;
        color: #ffffffff;
        margin-left: 10px;
        &-top {
          color: #33d2fbff;
        }
      }
    }
  }
}
</style>
