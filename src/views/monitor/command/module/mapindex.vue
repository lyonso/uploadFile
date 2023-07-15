<template>
  <div class='map-container2' id='con_lf_top_div'>
    <div class='iframe-container' :style="{'height':height,'width':width}" :class='{activeheight:fullscreen}'>
      <commandMap class='commandMap' id='iframe' ref='commandMap' @mouseChange='mouseChange' />
      <div style='position: absolute;width: 100%;bottom: 23px;'>
        <BottomView :mid='rwid' @changepoint='changepoint' />
      </div>
      <div v-if='showMon' style='position: absolute;top: 180px;left: 31px;'>
        <sendInfo
          @sendtype='sendtype'
          :mtitle='mtitle'
          :showwen='showwen'
          :shuizhidata='shuizhidata'
        />
        <historyView
          v-if='history'
          style='position: absolute;top: 420px;z-index: 1'
          :choiceName='choiceName'
          :shuiwentype='shuiwenorshuizhi'
          :shuizhidata='shuizhidata'
          :pointCode='pointCode'
        />
      </div>
      <div v-if='showkanban' style='position: absolute;top: 180px;left: 31px;'>
        <carView :monitorDeviceNo='monitorDeviceNo' @getmessage='getmessage' />
      </div>
      <div style='position: absolute;top: 123px;left: 31px;'>
        <div class='showLabel'>
          <div class='showLabel-left'>
            <el-tooltip class='item' effect='dark' content='隐藏/显示 标签' placement='top-start'>
              <img @click='showLabel=false' v-if='showLabel' src='@/assets/show.png' alt=''>
              <img @click='showLabel=true;showMon = false;showkanban = false;showGjx=false' v-else
                   src='@/assets/hidden.png' alt=''>
            </el-tooltip>
          </div>
          <div class='showLabel-left' style='position: relative;'>
            <el-tooltip class='item' effect='dark' content='工具箱' placement='top-start'>
              <img src='@/assets/icon_gjx.png' alt=''
                   @click='showGjx=!showGjx;showLabel=false;showMon = false;showkanban = false'>
            </el-tooltip>

            <div v-if='showGjx' class='topC-seemore'>
              <div class='topC-seemore-seediv' @click='sendmes(1)'>
                <div style='float: left;width: 30px;'>
                  <img src='@/assets/celiang.png' style='width: 16px;height: 16px;opacity: 0.7' alt=''>
                </div>
                <div style='float: left;width: 120px;text-align: left;'>
                  <span>测量距离</span>
                </div>
              </div>
              <div class='topC-seemore-seediv' @click='sendmes(2)'>
                <div style='float: left;width: 30px;'>
                  <img src='@/assets/mianji.png' style='width: 16px;height: 16px;opacity: 0.7;' alt=''>
                </div>
                <div style='float: left;width: 120px;text-align: left;'>
                  <span>测量面积</span>
                </div>
              </div>
              <div class='topC-seemore-seediv' @click='sendmes(3)'>
                <div style='float: left;width: 30px;'>
                  <img src='@/assets/qingchu.png' style='width: 16px;height: 16px;opacity: 0.7' alt=''>
                </div>
                <div style='float: left;width: 120px;text-align: left;'>
                  <span>清除</span>
                </div>
              </div>
            </div>
          </div>
          <div class='showLabel-right'>
            <el-tooltip class='item' effect='dark' content='开启/关闭 全屏' placement='top-start'>
              <img v-if='isfullnum==0' @click='screen' src='@/assets/quanp.png' alt=''>
              <img v-else @click='closescreen' src='@/assets/closequanp.png' alt=''>
            </el-tooltip>
          </div>
        </div>
        <Label
          ref='label'
          v-show='showLabel'
          @selectall='selectall'
          @changelabel='changelabel'
          @changeData='changeData'
          :mid='rwid'
        />
      </div>
      <div :class='isOpen? "PersonKanBan ":"PersonKanBan close"'>
        <img v-if='isOpen' @click='isOpen=false' src='../../../../assets/closePanel.png'>
        <img v-else @click='isOpen=true' src='../../../../assets/openPanel.png'>
        <PersonKanBan />
      </div>
      <InformationKanban :class='isOpen? "InformationKanban ":"InformationKanban close"' ref='info' />
      <div class='exbottom'>
        <div class='exbottom-div' @click='changemap(1)'>
          <img src='@/assets/slt.png' alt='' style='width: 100%;height: 70px;'>
          <div class='choicebutton' :class='{activeImg:activeImgId==1}'>矢量图</div>
        </div>
        <div class='exbottom-div' @click='changemap(2)'>
          <img :class='qxsy? "qxsy":""' src='@/assets/qxsy.jpg' alt='' style='width: 100%;height: 70px;'>
          <div class='choicebutton' :class='{activeImg:activeImgId==2}'>倾斜摄影</div>
        </div>
        <div class='exbottom-div' @click='changemap(4)'>
          <img src='@/assets/yx.png' alt='' style='width: 100%;height: 70px;'>
          <div class='choicebutton' :class='{activeImg:activeImgId==3}'>影像</div>
        </div>
      </div>

      <el-button class='goBack' size='mini' type='primary' @click='goback'>退出场景</el-button>
    </div>
  </div>
</template>

<script>
import BottomView from './bottom.vue'
import InformationKanban from './InformationKanban.vue'
import EvenPop from './evenpop.vue'
import Label from './label.vue'
import PersonKanBan from './PersonKanBan.vue'
import sendInfo from './sendInfo.vue'
import historyView from './history.vue'
import carView from './carKanban.vue'
import commandMap from '@/views/commandMap2'
import panel from './panel'
import { swszyDataAuto } from '@/api/baseInfo'
import { layeredit } from '@/api/command'
import { uavDetails, collectionTagList, sceneSectionForId, collectionPointDes } from '@/api/baseInfo'
import { EventBus } from '@/mapJs/EventBus'
import { map } from '@/api'
import { mapState } from 'vuex'

export default {
  components: {
    BottomView, InformationKanban, EvenPop, Label, PersonKanBan, sendInfo, historyView, carView, commandMap, panel
  },
  computed: {
    ...mapState({
      taskTime: state => state.security.taskTime
    }),
    listData() {
      return this.$store.state.user.postnum
    }
  },

  watch: {
    fullscreen: {
      handler() {
        let height = document.documentElement.clientHeight
        let width = document.documentElement.clientWidth
        this.height = '100%'
        this.bottom = '40px'
        this.width = width + 'px'
      },
      deep: true
    }
  },
  data() {
    return {
      activeImgId: 2,
      showname: true,
      history: true,
      shuizhidata: [],
      showGjx: false,
      monitorDeviceNo: '',
      showkanban: false,
      title: '车辆信息',
      bottom: '80px',
      height: '',
      width: '',
      fullscreen: false,
      showdanwei: false,
      videName: '视频预览',
      videoCode: '',

      id: 0,
      isfullnum: 0,
      labelData: [],
      showLabel: true,
      showMon: false,
      pointCode: '',
      changeDatas: [],
      shuiwenorshuizhi: 'shuiwen',
      rwid: 0,
      postNum: this.$store.getters.postnum,
      showwen: true,
      choiceName: '',
      coList: [],
      mtitle: '',
      isOpen: true,
      qxsy: true
    }
  },
  created() {
    collectionTagList().then(res => {
      this.coList = res.data.rows
    })

    this.rwid = this.$route.query.id
    let j = JSON.stringify({ 'id': '1384026730499276802' })
    // this.
  },
  mounted() {
    let date = new Date()
    let year = date.getFullYear() // 年
    let month = date.getMonth() + 1 // 月
    let day = date.getDate() // 日
    let week = date.getDay() // 星期
    let lastDay = 0

    var yugi = function(n) {
      var now = new Date
      now.setDate(now.getDate() - n)
      return now
    }
    Date.prototype.format = function(format) {
      var o = {
        'M+': this.getMonth() + 1, //month
        'd+': this.getDate(), //day
        'h+': this.getHours(), //hour
        'm+': this.getMinutes(), //minute
        's+': this.getSeconds(), //second
        'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
        'S': this.getMilliseconds() //millisecond
      }
      if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o)
        if (new RegExp('(' + k + ')').test(format))
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      return format
    }


    document.body.oncontextmenu = function() {
      return false
    }
    // this.websocketonmessage()
    this.initWebSocket()
    this.$nextTick(() => {
      window.postEventsInfo = this.eventsInfo
    })

    let _self = this
    window.onresize = function temp() {
      if (_self.isfullnum == 0) {
        _self.fullscreen = false
        _self.isfullnum = 1
      } else {
        let height = document.documentElement.clientHeight
        _self.height = height + 'px'
        _self.bottom = '80px'
        _self.isfullnum = 0
      }
    }
    this.$refs.commandMap.initSceneGetData2(this.rwid)
    window.addEventListener('message', function(evn) {
      if (evn.data == '111') {
      }
    })

    let height = document.documentElement.clientHeight
    let width = document.documentElement.clientWidth
    this.height = height + 'px'
    this.width = width + 'px'
  },
  destroyed() {
    this.websock.close() //离开路由之后断开websocket连接
  },
  methods: {
    getmessage(data) {
      this.showkanban = false
    },
    // 返回上一页
    goback() {
      this.$router.go(-1)//返回上一层
    },
    sendtype(data) {
      if (data == 'shuiwen') {
        this.shuiwen()
      } else {
        this.shuizhi()
      }
    },
    // 水文
    shuiwen() {
      this.shuizhidata = []
      this.showwen = true
      this.shuiwenorshuizhi = 'shuiwen'
      this.history = false
      let _self = this
      setTimeout(function() {
        _self.history = true
      }, 100)
      if (this.choiceName == 'section') {
        // 人工
        const Time = this.taskTime.substring(0, 10)
        let data = {
          apiName: 'thwb.rtflow.info.getWxList',
          bizContent: JSON.stringify({
            'stcd': this.pointCode,
            'startTime': Time,
            'endTime': Time
          })
        }
        this.personSWdata(data)
      } else {
        // 自动
        let data = {
          'apiName': 'thwb.rthy.getNewestData',
          'bizContent': JSON.stringify({ 'stcds': this.pointCode })
        }
        this.autoSWData(data)
      }
    },
    personSWdata(data) {
      swszyDataAuto(data).then(res => {
        const resData = res.thwb_rtflow_info_getWxList_response
        let odata = []
        if (resData.data.records.length > 0) {
          const records = resData.data.records[0]
          this.mtitle = records.stnm
          // odata = [
          //   { name: '水位', shuizhi: records['shuiwei'], tagUnit: 'm', type: 'shuiwei' },
          //   { name: '断面流量', shuizhi: records['dmll'], tagUnit: 'm3/s', type: 'liuliang' }
          // ]
        }
        this.shuizhidata = odata
        this.showMon = true
        this.history = false
        const _self = this
        setTimeout(function() {
          _self.history = true
        }, 100)
      })
    },
    autoSWData(data) {
      swszyDataAuto(data).then(res => {
        console.log(res)
        if (res.thwb_rtwq_awqmd_getItemData_response.code == '10000') {
          if (res.thwb_rtwq_awqmd_getItemData_response.data.records.length > 0) {
            let newarry = []
            Object.keys(res.thwb_rtwq_awqmd_getItemData_response.data[0]).forEach(key => {
              let addjson = {}
              for (let i = 0; i < this.coList.length; i++) {
                if (key == 'SPT') {

                } else {
                  if (key == this.coList[i].tagIdentifier) {
                    addjson = {
                      name: this.coList[i].tagName,
                      tagUnit: this.coList[i].tagUnit,
                      shuzhi: res.thwb_rtwq_awqmd_getItemData_response.data[0][key],
                      type: key
                    }
                    newarry.push(addjson)
                  }
                }
              }
            })
            this.shuizhidata = newarry
          }
          this.showMon = true
          this.history = false
          const _self = this
          setTimeout(function() {
            _self.history = true
          }, 100)
        }
      })
    },
    // 水质
    shuizhi() {
      this.shuiwenorshuizhi = 'shuizhi'
      this.history = false
      let _self = this
      setTimeout(function() {
        _self.history = true
      }, 100)
      if (this.choiceName == 'section') {
        // 人工
        let data = {
          'apiName': 'thwb.rtwq.swnorm.getNewestData',
          'bizContent': JSON.stringify({ 'stcds': this.pointCode, 'taskName': '' })
        }
        this.personSZdata(data)
      } else {
        // 自动
        let data = {
          'apiName': 'thwb.rtwq.awqmd.getNewestData',
          'bizContent': JSON.stringify({ 'stcds': this.pointCode })
        }
        this.autoSZdata(data)
      }
    },
    autoSZdata(data) {
      swszyDataAuto(data).then(res => {
        if (res.thwb_rtwq_awqmd_getNewestData_response.code == '10000') {
          let newarry = []
          Object.keys(res.thwb_rtwq_awqmd_getNewestData_response.data[0]).forEach(key => {
            let addjson = {}
            for (let i = 0; i < this.coList.length; i++) {
              if (key == 'SPT') {
              } else if (key == 'STNM') {
                this.mtitle = res.thwb_rtwq_awqmd_getNewestData_response.data[0][key]
              } else if (key == 'STCD') {
                this.mtitle = res.thwb_rtwq_awqmd_getNewestData_response.data[0][key]
              } else {
                if (key == this.coList[i].tagIdentifier) {
                  addjson = {
                    name: this.coList[i].tagName,
                    tagUnit: this.coList[i].tagUnit,
                    shuzhi: res.thwb_rtwq_awqmd_getNewestData_response.data[0][key],
                    type: key
                  }
                  newarry.push(addjson)
                }
              }
            }
          })
          this.shuizhidata = newarry
          this.showMon = true
          this.history = false
          const _self = this
          setTimeout(function() {
            _self.history = true
          }, 100)
          this.showwen = false
        }
      })
    },
    personSZdata(data) {
      this.shuizhidata = []
      swszyDataAuto(data).then(res => {
        if (res.thwb_rtwq_swnorm_getNewestData_response.code == '10000') {
          if (res.thwb_rtwq_swnorm_getNewestData_response.data.records.length > 0) {
            let newarry = []
            //  thwb_rtwq_swnorm_getNewestData_response:
            Object.keys(res.thwb_rtwq_swnorm_getNewestData_response.data.records[0]).forEach(key => {
              let addjson = {}
              for (let i = 0; i < this.coList.length; i++) {
                if (key == 'SPT') {
                } else if (key == 'STNM') {
                  this.mtitle = res.thwb_rtwq_swnorm_getNewestData_response.data.records[0][key]
                  if (this.pointCode == '63203184') {
                    this.mtitle = '梅堰大桥'
                  }


                } else if (key == 'STCD') {
                  this.mtitle = res.thwb_rtwq_swnorm_getNewestData_response.data.records[0][key]
                  if (this.pointCode == '63203184') {
                    this.mtitle = '梅堰大桥'
                  }


                } else {
                  if (key == this.coList[i].tagIdentifier) {
                    addjson = {
                      name: this.coList[i].tagName,
                      tagUnit: this.coList[i].tagUnit,
                      shuzhi: res.thwb_rtwq_swnorm_getNewestData_response.data.records[0][key],
                      type: key
                    }
                    newarry.push(addjson)
                  }
                }
              }
            })
            this.shuizhidata = newarry
          } else {
            // let odata = [
            //   { name: '氨氮', shuizhi: '0.95', tagUnit: 'mg/L', type: 'andan' },
            //   { name: '总磷', shuizhi: '0.180', tagUnit: 'mg/L', type: 'zongling' },
            //   { name: '总氮', shuizhi: '3.22', tagUnit: 'mg/L', type: 'zongdan' },
            //   { name: '高锰酸盐指数', shuizhi: '6.0', tagUnit: 'mg/L', type: 'gaomangsan' }
            // ]
            // this.shuizhidata = odata
            this.history = false
          }
          this.showMon = true
          this.showwen = false
          this.history = true
        }
      })
    },
    selectall(data) {
      const _self = this
      let arry = this.changeDatas
      for (let i = 0; i < arry.length; i++) {
        let params = {
          sysLayerId: arry[i].sysLayerId,
          status: data.status,
          yjylCommandMissionId: this.rwid
        }
        let data = JSON.stringify(params)
        _self.$refs.commandMap.changeLayerStatus(str)
      }
    },
    changeData(data) {
      this.changeDatas = data.item
    },
    sendmes(val) {
      EventBus.$emit('tool', val)
    },
    initWebSocket() { //初始化weosocket
      const wsuri = 'ws://127.0.0.1:8088/websocket/' + `${this.rwid}`
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() { //连接建立之后执行send方法发送数据
      let actions = { 'test': '12345' }
      this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror() {//连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage(e) { //数据接收
      const redata = JSON.parse(e.data)
      if (redata.websocketType === 'message') {
        this.$refs.info.init()
      } else {
        if (redata.data) {
          if (redata.data.layerType === 'car') {
            EventBus.$emit('websocket', redata.data)
          }
        }
        const data = JSON.parse(e.data)
        if (data.missionId === this.$route.query.id) {
          this.$refs.label.initLabel()
        }
      }
    },
    websocketsend(Data) {//数据发送
      this.websock.send(Data)
    },
    websocketclose(e) {  //关闭
      EventBus.$emit('closeWeb', false)
    },
    changemap(val) {
      if (val === 2) {
        if (this.qxsy) {
          this.qxsy = false
          console.log(3)
          EventBus.$emit('baseMap', 3)
        } else {
          this.qxsy = true
          console.log(2)
          EventBus.$emit('baseMap', val)
        }
      } else {
        EventBus.$emit('baseMap', val)
      }
    },
    mouseChange(data) {
      console.log(data)
      let params = JSON.parse(data)
      this.choiceName = params.name
      this.showLabel = false
      this.showkanban = false
      this.showMon = false
      this.history = false
      this.monitorDeviceNo = params.cameraCode
      if (params.name == 'camera_ls' || params.name == 'camera_gd' || params.name == 'uav') {
        if (params.name == 'uav') {
          uavDetails(params.id).then(res => {
            if (res.code == 200) {
              this.monitorDeviceNo = res.data.uavCode
              this.showkanban = true
            }
          })
        } else if (params.name == 'camera_gd') {
          map.getCameraCode(params.id).then(res => {
            if (res.code == 200) {
              this.monitorDeviceNo = res.data.cameraCode
              this.showkanban = true
            }
          })
        } else {
          this.showkanban = true
        }
      } else if (params.name == 'monitor' || params.name == 'section') {
        this.showMon = true
        // 自动监测站
        if (params.name == 'monitor') {
          collectionPointDes(params.id).then(res => {
            this.mtitle = res.data.hqnm
            this.pointCode = res.data.pointCode
            let data = {
              'apiName': 'thwb.rthy.getNewestData',
              'bizContent': JSON.stringify({ 'stcds': res.data.pointCode })
            }
            this.autoSWData(data)
          })
        } else {
          // 人工监测断面
          sceneSectionForId(params.id).then(res => {
            this.mtitle = res.data.sectionName
            const Time = this.taskTime.substring(0, 10)
            this.pointCode = res.data.sectionCode
            let data = {
              // 单站流量成果数据
              apiName: 'thwb.rtflow.info.getWxList',
              bizContent: JSON.stringify({
                stcd: this.pointCode,
                startTime: Time,
                endTime: Time
              })
            }
            this.personSWdata(data)
          })
        }
      }
    },
    eventsInfo(data) {
    },
    // 切换 状态
    changelabel(data) {
      let params = {
        sysLayerId: data.item.sysLayerId,
        status: data.status,
        yjylCommandMissionId: this.rwid
      }
      let jjj = { layerStatus: data.status, id: data.item.sysLayerId }
      layeredit(jjj).then(res => {
      })
      let str = JSON.stringify(params)
      this.$refs.commandMap.changeLayerStatus(str)
      // if(data.status==0){
      //   this.$refs.commandMap.events(str)
      // }else{
      //   this.$refs.commandMap.ajaxRemoveDataEntity(data.sysLayerId,this.rwid)
      // }


    },
    changepoint(data) {
      this.$refs.commandMap.flyTo(data)
    },
    // 关闭全屏
    closescreen() {
      let element = document.getElementById('con_lf_top_div')//设置后就是   id==con_lf_top_div 的容器全屏
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    },
    // 全屏
    screen() {
      let element = document.getElementById('con_lf_top_div')//设置后就是   id==con_lf_top_div 的容器全屏
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        // IE11
        element.msRequestFullscreen()
      }
      this.fullscreen = !this.fullscreen
    }
  }
}
</script>

<style lang='less' scoped>
.map-container2 {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100vh;
}

.activeImg {
  background: #3cb79c !important;
}

.topC-seemore {
  background-color: white;
  position: absolute;
  width: 197px;
  height: auto;
  top: 50px;
  left: 0px;
  border-radius: 4px;
  padding: 10px;

  &-seediv {
    width: 100%;
    height: 30px;
    // padding: 7px;
    text-align: center;
    cursor: pointer;
  }
}

* {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}

.choicebutton {
  cursor: pointer;
  width: auto;
  padding: 10px;
  color: #FFFFFF;
  background: #257DD0;
  border: 1px solid #167CFA;
  border-radius: 4px;
  position: absolute;
  bottom: 33px;
  right: 5px;
}

.exbottom {
  position: absolute;
  bottom: -7px;
  left: 20px;

  &-div {
    float: left;
    width: 128px;
    height: 98px;
    margin-right: 20px;
    position: relative;

  }

}

.showLabel {
  width: 150px;
  height: 40px;
  background-color: rgba(3, 23, 41, 0.8);
  border: 1px solid #8B97B8;
  border-radius: 20px;
  margin-bottom: 10px;

  &-left {
    float: left;
    margin-top: 8px;
    text-align: center;
    margin-left: 21px;
  }

  &-right {
    float: left;
    margin-top: 8px;
    margin-left: 19px;
    font-size: 24px;
  }
}

.map-comm {
  position: absolute;
  top: 0px;
  left: 0px;
}

.activeheight {
  height: 100%;
}

.PersonKanBan {
  position: absolute;
  top: 100px;
  right: 20px;
  transition: right 1s;

  > img {
    position: absolute;
    left: -24px;
    top: 0;
    width: 24px;
    right: -24px;
    cursor: pointer;
    transform: rotate(180deg);
  }
}

.InformationKanban {
  position: absolute;
  top: 422px;
  right: 20px;
  transition: right 1s;

}

.close {
  right: -400px;
  transition: right 1s;
}

.qxsy {
  border: 2px solid #00FFFF;
}

.goBack {
  position: absolute;
  top: 115px;
  right: 50px;
}
</style>
