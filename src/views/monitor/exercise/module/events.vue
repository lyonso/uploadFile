<template>
  <div class="events">
    <!-- 事件 -->
    <div class="events-container">
      <div class="events-container-drag">
        <div class="events-container-list" v-if="item.show" :style="{'top':item.top,'left':'0px'}"
             v-for="(item,index) in newdata" :key="index" v-drag=item.type>
          <div :style="{'background':`url(${item.img})`}" style=";width: 28px;height: 28px;margin: auto;"></div>
          <div>{{ item.name }}</div>
        </div>
      </div>
      <!-- 标注库 -->
      <div class="seemore" v-if="seeEvent">
        <div class="seemore-title">
          <span>添加标注</span>
          <div class="el-icon-close"></div>
        </div>
        <div class="seemore-container">
          <div class="seemore-container-taps">
            <div v-for="(item,index) in tapsdata" @click="choicetaps(item)" :class="{seemoreactive:seemoreNum==item.type}">
              {{ item.name }}
            </div>
          </div>
          <div class="events-container-drag">
            <div class="events-container-list" style="z-index: 999;" v-for="(item,index) in newmarkdata" :key="index"
                 v-drag=item.type>
              <div v-if="item.markIcon" :style="{'background':`url(${item.markIcon})`}"
                   style=";width: 30px;height: 30px;margin: auto;"></div>
              <div style="color: #1F2E4D;font-size: 12px;">{{ item.markName }}</div>
            </div>
          </div>
          <div class="seemore-container-content">
            <div v-if="showsee">
              <div @click="newmark(item,index)" class="seemore-container-list" v-for='(item,index) in seemoreData'
                   :key="index">
                <div v-if="item.markIcon">
                  <img :src="item.markIcon" style="width: 30px;height: 30px;border-radius: 4px;" alt="">
                </div>
                <div>{{ item.markName }}</div>
              </div>
            </div>
            <div v-else style="color: #e3e3e3;width: 100%;text-align: center;line-height: 130px;">暂无数据</div>
          </div>
          <div class="seemore-botton">
            <el-button @click="seeEvent=false">取消</el-button>
            <el-button @click="seeEvent=false" type="primary">确定</el-button>
          </div>
        </div>
      </div>
      <div class="events-container-drag" style="height: 440px;position: relative;background-color: rgb(234, 232, 235);">
        <div class="events-container-list" style="z-index: 999;" :style="{'top':index*70+'px'}"
             v-for="(item,index) in dragdata" :key="index" v-drag=item.type>
          <!-- <img :src="item.img" alt=""> -->
          <div :style="{'background':`url(${item.img})`}" style=";width: 28px;height: 28px;margin: auto;"></div>
          <div>{{ item.name }}</div>
        </div>
        <div style="width: 78px;height: 12px;border-bottom:1px solid #ECECEC;position: absolute;bottom: 0rem;left: 11px;" />
      </div>
      <div class="events-container-click" style="height: 430px;position: relative;">
        <div class="events-container-list" @click="choiceItem(item)" :style="{'top':index*70+'px'}"
             v-for="(item,index) in clickdata" :key="index">
          <img :src="item.img" alt="">
          <div>{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { marklist} from '@/api/baseInfo'

export default {
  data() {
    return {
      movetype: "",
      top: '200px',
      left: '-100px',
      seeEvent: false,
      newmarkdata: [],
      seemoreData: [],
      showsee: false,
      tapsdata: [
        {name: '文字', type: 0},
        {name: '图标', type: 1},
        {name: '符号', type: 2},
        {name: '三维', type: 3},
      ],
      seemoreNum: 0,
      newdata: [
        {name: '定位点', img: require('../../../../assets/yanlian/1.png'), type: 'anchor', show: false},
        {name: '事件', img: require('../../../../assets/yanlian/2.png'), type: 'event', top: "74px", show: false},
        {name: '临时视频', img: require('../../../../assets/yanlian/10.png'), type: 'camera_ls', top: "144px", show: false},
        {name: '临时指挥部',img: require('../../../../assets/yanlian/11.png'), type: 'headquarters', top: "214px", show: false},
        {name: '巡测断面', img: require('../../../../assets/yanlian/12.png'), type: 'section', top: "284px", show: false},
        {name: '标注', img: require('../../../../assets/yanlian/3.png'), type: 'mark', top: "354px", show: false},
      ],
      loading: true,
      dragdata: [
        {name: '定位点', img: require('../../../../assets/yanlian/1.png'), type: 'anchor'},
        {name: '事件', img: require('../../../../assets/yanlian/2.png'), type: 'event'},
        {name: '临时视频', img: require('../../../../assets/yanlian/10.png'), type: 'camera_ls'},
        {name: '临时指挥部', img: require('../../../../assets/yanlian/11.png'), type: 'headquarters', show: false},
        {name: '巡测断面', img: require('../../../../assets/yanlian/12.png'), type: 'section', show: false},
        {name: '标注', img: require('../../../../assets/yanlian/3.png'), type: 'mark', show: false},
      ],
      clickdata: [
        {name: '自动监测站', img: require('../../../../assets/yanlian/13.png'), type: 'monitor'},
        {name: '单兵人员', img: require('../../../../assets/yanlian/5.png'), type: 'person'},
        {name: '船舶', img: require('../../../../assets/yanlian/6.png'), type: 'ship'},
        {name: '车辆', img: require('../../../../assets/yanlian/7.png'), type: 'car'},
        {name: '无人机', img: require('../../../../assets/yanlian/8.png'), type: 'uav'},
        {name: '固定视频', img: require('../../../../assets/yanlian/9.png'), type: 'camera_gd'},
      ]
    }
  },
  mounted() {
    this.initmark(1, 10000, {markType: this.seemoreNum})
  },
  methods: {
    newmark(item, index) {
      console.log(item)
      item.top = "330px"
      item.left = index * 50 + "px"
      this.newmarkdata.push(item)
    },
    choicetaps(item) {
      this.seemoreNum = item.type
      this.initmark(1, 10000, {markType: this.seemoreNum})
    },
    newEl(item, index) {
      item.top = index * 84 + 'px'
      this.newdata.push(item)
    },
    init() {
      this.$forceUpdate()
    },
    choiceItem(item) {
      if (item.type == "mark") {
        this.seeEvent = true
      } else {
        this.$emit('addEvents', {type: item.type})
      }
    },
    initmark(pageNum, pageSize, params) {
      marklist(pageNum, pageSize, params).then(res => {
        console.log(res)
        if (res.code == 200 && res.data.rows.length > 0) {
          this.showsee = true
          this.seemoreData = res.data.rows
        } else {
          this.showsee = false
        }
      })
    },
    move(e) {
      console.log(e)
      this.top = e.clientY + 'px'
      this.left = e.clientX + 'px'
    }
  },
  directives: {
    drag: {
      // 指令的定义
      bind: function (el, bindings, vnode) {
        let odiv = el;   //获取当前元素
        el.onmousedown = (e) => {
          let oldY = e.screenY
          let oldX = e.screenX
          let type = bindings.value
          const _self = vnode.context
          if (type == "anchor") {
            _self.newdata[0].show = true
          } else if (type == "event") {
            _self.newdata[1].show = true
          } else if (type == "camera_ls") {
            _self.newdata[2].show = true
          } else if (type == "section") {
            _self.newdata[4].show = true
          } else if (type == 'headquarters') {
            _self.newdata[3].show = true
          } else if (type == 'mark') {
            _self.newdata[5].show = true
          }
          let disX = e.clientX - odiv.offsetLeft;
          let disY = e.clientY - odiv.offsetTop;
          let left = '';
          let top = '';
          document.onmousemove = (e) => {
            !+"\v1"? e.selection.empty() : window.getSelection().removeAllRanges();
            left = e.clientX - disX;
            top = e.clientY - disY;
            odiv.style.left = left + 'px';
            odiv.style.top = top + 'px';
          };
          document.onmouseup = (e) => {
            if (e.screenX == oldX && e.screenY == oldY) {
              console.log(".....")
            } else {
              let screenX = e.screenX
              let screenY = e.screenY
              let data
              if (typeof (bindings.value) == 'string') {
                data = {
                  screenX: e.screenX,
                  screenY: e.screenY,
                  type: type,
                  left: left,
                  top: top,
                }
              } else {
                data = {
                  screenX: e.screenX,
                  screenY: e.screenY,
                  type: 'mark',
                  val: type,
                  left: left,
                  top: top,
                }
              }
              _self.$emit('addEvents', data)
            }
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }
    }
  }
}
</script>

<style lang="less">
.seemoreactive {
  color: #1890FFFF !important;
  border: 1px solid #1890FFFF !important;
}

.seemore {
  &-container {
    width: 100%;
    padding: 20px;
    height: auto;
    position: relative;

    &-list {
      cursor: pointer;
      width: 50px;
      color: #1F2E4D;
      font-size: 12px;
      text-align: center;
      margin-left: 10px;
      float: left;

      div {
        margin-top: 5px;
      }

    }

    &-content {
      width: 100%;
      border: 1px solid #BDBDBD;
      height: auto;
      margin-top: 20px;
      border-radius: 4px;
      height: 137px;
      overflow-y: auto;
      position: relative;
    }

    &-taps {
      width: 100%;
      height: 25px;

      div {
        width: 52px;
        height: 22px;
        cursor: pointer;
        text-align: center;
        border: 1px solid #BDBDBD;
        border-radius: 4px;
        float: left;
        margin-right: 15px;
        line-height: 22px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }

  &-botton {
    margin-top: 20px;
    width: 100%;
    height: auto;
    text-align: right;
  }

  &-list {
    width: 100%;
    height: auto;
    font-size: 14px;
    line-height: 21px;
    margin-top: 20px;

    &-title {
      width: 100px;
      text-align: right;
      color: #62697A;
      float: left;
    }

    &-content {
      width: 224px;
      color: #1F2E4D;
      float: left;

      div {
        float: left;
        margin-right: 10px;

        img {
          width: 60px;
          height: 60px;
          border-radius: 4px;
        }
      }
    }
  }

  position: absolute;
  top: 363px;
  left: -329px;
  width: 318px;
  height: auto;
  background: #FFFFFF;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.5);
  border-radius: 4px;

  &-title {
    width: 318px;
    height: 50px;
    background: #E4EAF1;
    border-radius: 4px 4px 0px 0px;
    line-height: 50px;
    padding-left: 20px;
    font-weight: 500;

    div {
      float: right;
      line-height: 50px;
      width: 50px;
      text-align: center;
    }
  }
}

.drag {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: red;
}

.events {
  &-container {
    width: 100px;
    height: auto;
    background-color: #FFFFFFFF;
    border-radius: 4px;
    padding-top: 4px;
    position: relative;
    float: right;
    margin-right: 30px;
    margin-top: 100px;

    &-list {
      position: absolute;
      width: 100px;
      height: 70px;
      text-align: center;
      padding-top: 15px;
      font-size: 14px;
      cursor: pointer;

      div {
        margin-top: 8px;
      }
    }
  }
}

.events-container-list:hover {
  background-color: #E1E8EA66;
  color: #368BFEFF;
}
</style>
