<template>
  <div
    class="infoLock"
    :style="{
      width: kanBanSize.divWidth + 'px',
    }"
    v-drag
  >
    <div class="infoLock-title">
      <div class="infoLock-title-icon">
        <img src="@/assets/title-icon.png" alt="" />
      </div>
      <div class="infoLock-title-text">{{ title }}</div>
      <div
        class="el-icon-error"
        @click="sendmessages"
        style="
          position: absolute;
          right: 10px;
          top: 10px;
          color: white;
          font-size: 30px;
        "
      ></div>
      <div class="infoLock-title-line">
        <img
          style="width: 100%; display: block"
          src="@/assets/line.png"
          alt=""
        />
      </div>
      <div class="clearfloat"></div>
    </div>

    <div class="infoLock-container">
      <div class="infoLock-container-left">
        <video-player
          v-if="showPlayer"
          v-show="showPlayer"
          :show="false"
          class="player"
          v-bind:monitorDeviceNo="monitorDeviceNo"
          :width="kanBanSize.playerWidth"
          :height="kanBanSize.playerHeight"
          :playHeight="kanBanSize.playerHeight"
        />
        <div class="infoLock-container-bottpm">
          <el-button
            v-for="(item, index) in botton"
            :key="index"
            class="button"
            @click="changeSize(index)"
            >{{ item.label }}</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { headquarterslist } from "@/api/baseInfo";
import videoPlayer from "@/components/video/index";
export default {
  components: {
    videoPlayer,
  },
  props: {
    //视频频id
    monitorDeviceNo: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "实时视频",
    },
  },
  data() {
    return {
      showPlayer: true,
      botton: [
        {
          label: "1X",
          divWidth: 400,
          playerHeight: 180,
          playerWidth: 320,
        },
        {
          label: "2X",
          divWidth: 760,
          playerHeight: 360,
          playerWidth: 680,
        },
        {
          label: "3X",
          divWidth: 920,
          playerHeight: 540,
          playerWidth: 840,
        },
        {
          label: "4X",
          divWidth: 1080,
          playerHeight: 600,
          playerWidth: 1000,
        },
      ],
      kanBanSize: {
        label: "4X",
        divWidth: 1080,
        playerHeight: 600,
        playerWidth: 1000,
      },
      zhbwidth: "2000px",
      list: [
        {
          userName: "test1",
          userDuty: "test1",
          userPhone: "test1",
        },
      ],
      activeId: 0,
    };
  },
  mounted() {
    console.log('222222222222222222222222222222',this.monitorDeviceNo)
    this.init(this.$route.query.id);
  },
  methods: {
    sendmessages() {
      this.$emit("getmessage", true);
    },
    changeSize(index) {
      this.showPlayer = false;
      this.kanBanSize = this.botton[index];
      setTimeout(() => {
        this.showPlayer = true;
      }, 100);
    },
    choicehead(item) {
      console.log(item);
      this.activeId = item.yjylHeadquartersId;
      this.initChoice(this.activeId);
    },

    initChoice(id) {},
    init(id) {
      headquarterslist({ missionId: id }).then((res) => {
        if (res.code == 200) {
          this.list = res.data.rows;
          this.zhbwidth = this.list.length * 100 + "px";
          if (this.activeId == 0) {
            this.activeId = res.data.rows[0].yjylHeadquartersId;
            this.initChoice(res.data.rows[0].yjylHeadquartersId);
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
  directives: {
    drag: {
      // 指令的定义
      bind: function (el, bindings, vnode) {
        let odiv = el; //获取当前元素
        el.onmousedown = (e) => {
          this.videoPlayer = false;
          console.log(e);
          let oldY = e.screenY;
          let oldX = e.screenX;
          let type = bindings.value;
          const _self = vnode.context;
          let disX = e.clientX - odiv.offsetLeft;
          let disY = e.clientY - odiv.offsetTop;
          let left = "";
          let top = "";
          document.onmousemove = (e) => {
            left = e.clientX - disX;
            top = e.clientY - disY;
            odiv.style.left = left + "px";
            odiv.style.top = top + "px";
          };
          document.onmouseup = (e) => {
            setTimeout(() => {
              this.showPlayer = true;
            }, 100);
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-table::before {
  height: 0px;
}
/deep/ .el-table,
/deep/ .el-table__expanded-cell {
  background-color: transparent;
}
/* 表格内背景颜色 */
/deep/ .el-table th,
/deep/ .el-table tr,
/deep/ .el-table td {
  border: none;
  background-color: transparent;
}
/deep/.el-table__row--striped td {
  background-color: #45797b33 !important;
  color: white !important;
}
//奇数行样式
/deep/.el-table__row:not(.el-table__row--striped) {
  background: #1439391c !important;
  color: white !important;
}
/deep/.el-table .cell {
  line-height: 31px;
  border: none;
}
/deep/.el-table--fit {
  background-color: rgba(0, 0, 0, 0);
}
.el-table {
  /deep/.el-table__row--striped {
    background: rgba(4, 16, 27, 0.8);
  }
  // .el-table th, .el-table tr{
  //   background-color: rgba(0,0,0,0);
  // }
  /deep/ td {
    padding: 0;
    background: rgba(0, 0, 0, 0);
    opacity: 0.7;
    font-size: 16px;
    font-family: DIN Alternate;
    color: #ffffff;
  }
}

.infoLock-zhb {
  &-list {
    width: 100px;
    height: 60px;
    float: left;
    position: relative;
    cursor: pointer;
    // transform: translateX(-50px);
    img {
      position: absolute;
      top: 13px;
      left: 10px;
    }
    div {
      width: 100%;
      text-align: center;
      line-height: 55px;
      position: absolute;
      top: 0px;
      color: white;
    }
  }
  width: 100%;
  height: 60px;
  &-right {
    float: right;
    padding-top: 8px;
  }
  &-left {
    float: left;
    padding-top: 8px;
  }
  &-container {
    float: left;
    height: 60px;
    width: 400px;
    overflow: hidden;
    // overflow: hidden;
    overflow-x: auto;
  }
}

.box {
  background-color: #ffd905ff;
  width: 3px;
  height: 3px;
  position: absolute;
}
.active {
  color: #fff600ff !important;
}
.infoLock-container {
  height: auto;
  overflow: hidden;
  position: relative;
  font-size: 14px;
  cursor: pointer;
  &-left {
    margin-top: 11px;
    background-color: #182d47;
    &-area {
      color: white;
      width: 100%;
      margin-top: 12px;
      line-height: 31px;
      font-size: 16px;
    }
    video {
      width: 300px;
      height: 168px;
      margin: auto;
      margin-top: 6px;
    }
  }
  &-table {
    margin-top: 20px;
  }
  // margin-top: 10px;
  &-right {
    position: absolute;
    right: 0px;
    top: 8px;
    height: 180px;
    width: 50px;
    &-list {
      text-align: center;
      width: 36px;
      height: 36px;
      margin-top: 9px;
      background: rgba(6, 53, 93, 0.4);
      border: 1px solid #175097;
      line-height: 36px;
      color: #ffffffff;
      font-size: 16px;
      font-weight: 400;
      border-radius: 50%;
      background: rgba(40, 130, 213, 0.3);
      border: 1px solid #2e95f4;
      &:hover {
        background: rgba(40, 130, 213, 0.2);
        border: 1px solid #2e95f4;
        opacity: 0.4;
      }
      div {
        float: left;
        width: 80px;
        text-align: left;
      }
    }
  }
}

/deep/.el-card__body {
  padding: 0px;
}
/deep/.el-card {
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
}
/deep/.el-timeline-item__timestamp {
  width: 153px;
  height: 24px;
  line-height: 19px;
  background: #167cfa;
  border-radius: 12px;
  font-size: 16px;
  font-family: Source Han Sans SC;
  font-weight: 400;
  color: #fefefe;
  text-align: center;
}
/deep/.el-timeline-item__tail {
  top: 11px;
  border-left: 2px solid #db3141ff;
  height: 94%;
}
/deep/.el-timeline-item__node {
  background-color: rgba(0, 0, 0, 0);
  border: 2px solid #db3141ff;
}
.el-timeline {
  padding: 0px;
}
.infoLock {
  position: absolute;
  top: 0px;
  height: auto;
  padding: 20px;
  background: rgba(4, 16, 27, 0.8);
  &-title {
    width: 100%;
    &-icon {
      float: left;
    }
    &-text {
      float: left;
      font-size: 18px;
      font-family: sbold;
      font-weight: 400;
      color: #fefefe;
      margin-left: 17px;
    }
    &-line {
      margin-top: -10px;
    }
  }
}
.player{
  display: inline-block;
  vertical-align: top;
}
.infoLock-container-bottpm{
  display: inline-block;
}
.button{
  display: block;
  margin: 5px;
}
</style>
