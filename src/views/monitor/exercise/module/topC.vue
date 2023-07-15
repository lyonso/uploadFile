<template>
  <div class="topC">
    <div class="topC-list" @click="gotonew">
      <div style="margin-left: 14px;">
        <img src="@/assets/map_icon_kb.png" alt="">
      </div>
      <div style="margin-left: 5px;">看板维护</div>
      <div>
      </div>
    </div>
    <!-- <div class="topC-list"  >
      <div style="margin-left: 18px;" @click="tcshow=!tcshow">
        <img src="../../../assets/map_icon_gjx.png" alt="">
      </div>
      <div style="margin-left: 5px;" @click="tcshow=!tcshow">图层</div>
      <div>
        <img v-if="!tcshow"  @click="tcshow=!tcshow" src="../../../assets/sys_icon_arrow.png" alt="">
        <img v-else @click="tcshow=!tcshow"  src="../../../assets/sys_icon_arrow.png" alt="">
      </div>
      <div v-if="tcshow" class="topC-seemore">
        <div class="topC-seemore-seediv"  v-for="(item,index) in checkdata">
          <div style="float: left;margin-top: 5px;">
            <el-switch
              @change="choicecheck($event,item)"
              v-model="item.layerStatus"
              active-color="#3377FFFF"
              inactive-color="#D3DBEBFF"
              :active-value="0"
              :inactive-value="1"
              >
            </el-switch>
          </div>
          <div style="float: left;width: 30px;"><img :src="item.iconurl" style="width: 16px;height: 16px;" alt=""></div>
          <div style="float: left;width: 100px;text-align: left;"> <span>{{item.layerName}}</span></div>
        </div>
      </div>
    </div> -->
    <div class="topC-list" style="border: none;" @click="gjshow=!gjshow">
      <div style="margin-left: 18px;">
        <img src="@/assets/map_icon_gjx.png" alt="">
      </div>
      <div style="margin-left: 5px;">工具箱</div>
      <div>
        <img src="@/assets/sys_icon_arrow.png" alt="">
      </div>
      <div v-if="gjshow" class="topC-seemore">
        <div class="topC-seemore-seediv" @click="sendmes(1)">
          <div style="float: left;width: 30px;">
            <img src="@/assets/celiang.png" style="width: 16px;height: 16px;opacity: 0.7" alt="">
          </div>
          <div style="float: left;width: 120px;text-align: left;">
            <span>测量距离</span>
          </div>
        </div>
        <div class="topC-seemore-seediv" @click="sendmes(2)">
          <div style="float: left;width: 30px;">
            <img src="@/assets/mianji.png" style="width: 16px;height: 16px;opacity: 0.7;" alt="">
          </div>
          <div style="float: left;width: 120px;text-align: left;">
            <span>测量面积</span>
          </div>
        </div>
        <div class="topC-seemore-seediv" @click="sendmes(3)">
          <div style="float: left;width: 30px;">
            <img src="@/assets/qingchu.png" style="width: 16px;height: 16px;opacity: 0.7" alt="">
          </div>
          <div style="float: left;width: 120px;text-align: left;">
            <span>清除</span>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import {layeredit, layerlist} from '@/api/command'
import {EventBus} from '@/mapJs/EventBus';

export default {
  data() {
    return {
      checkdata: [],
      tcshow: false,
      kbshow: false,
      gjshow: false,
    }
  },
  mounted() {
    this.init(1, 10, {})
  },
  methods: {
    choicecheck(e, item) {
      let params = {
        sysLayerId: item.sysLayerId,
        status: e,
        yjylCommandMissionId: this.$route.query.id
      }

      let str = JSON.stringify(params)
      console.log(str)
      this.$emit('changestaus', str)
      console.log(item)
    },
    goback() {
      this.$router.push({path: "/monitor/exercise"})
    },
    gotonew() {
      this.$router.push({path: "/monitor/kanban", query: {id: this.$route.query.id}})
    },
    sendmes(val) {
      EventBus.$emit("tool",val)
    },
    init(pageNum, pageSzie, params) {
      layerlist(pageNum, pageSzie, params).then(res => {
        console.log(res)
        if (res.code == 200) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].layerName == "定位点") {
              res.data[i].iconurl = require(`../../../../assets/yanlian/1.png`)
            } else if (res.data[i].layerName == "事件标注点") {
              res.data[i].iconurl = require(`../../../../assets/yanlian/2.png`)
            } else if (res.data[i].layerName == "临时视频") {
              res.data[i].iconurl = require(`../../../../assets/yanlian/10.png`)
            } else if (res.data[i].layerName == "临时指挥部") {
              res.data[i].iconurl = require(`../../../../assets/yanlian/11.png`)
            } else if (res.data[i].layerName == "巡测断面") {
              res.data[i].iconurl = require(`../../../../assets/yanlian/12.png`)
            } else if (res.data[i].layerName == "标注") {
              res.data[i].iconurl = require(`../../../../assets/yanlian/3.png`)
            } else if (res.data[i].layerName == "自动监测站") {
              res.data[i].iconurl = require(`../../../../assets/yanlian/13.png`)
            } else if (res.data[i].layerName == "单兵人员") {
              res.data[i].iconurl = require(`../../../../assets/yanlian/5.png`)
            } else if (res.data[i].layerName == "船舶") {
              res.data[i].iconurl = require(`../../../../assets/yanlian/6.png`)
            } else if (res.data[i].layerName == "车辆") {
              res.data[i].iconurl = require(`../../../../assets/yanlian/7.png`)
            } else if (res.data[i].layerName == "固定视频") {
              res.data[i].iconurl = require(`../../../../assets/yanlian/9.png`)
            } else if (res.data[i].layerName == "无人机") {
              res.data[i].iconurl = require(`../../../../assets/yanlian/8.png`)
            }
            res.data[i].layerStatus = 0
            this.checkdata.push(res.data[i])
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.topC {
  width: 410px;
  padding: 11px;
  background-color: #FFFFFF;
  border-radius: 4px;
  display: flex;
  &-seemore {
    position: absolute;
    width: 197px;
    height: auto;
    top: 50px;
    left: 0px;
    border-radius: 4px;
    background-color: white;
    padding: 10px;

    &-seediv {
      width: 100%;
      height: 30px;
      // padding: 7px;
      text-align: center;
      cursor: pointer;
    }
  }
  &-list {
    flex: 1;
    height: 28px;
    border-right: 1px solid #E6E9F0FF;
    line-height: 30px;
    position: relative;
    font-size: 14px;

    div {
      float: left;
    }

    img {
      margin-left: 10px;
      margin-top: 7px;
    }
  }
}
</style>
