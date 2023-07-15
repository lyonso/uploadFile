<template>
  <div class='details'>
    <div class='dialogTitle'>
      <span>{{ videoID.roomName || '-' }}</span>
      <span>{{ nowToday }}</span>
      <SwSwitch v-model='isChecked' @change='changeOpen' />
      <span :class='chose===index? "tapItem chsoe":"tapItem"' v-for='(item , index) in tapList' :key='item'
            @click='chose=index'>
        {{ item }}
      </span>
      <i class='el-icon-close close' @click='closeDialog()' />
    </div>
    <div class='details_body'>
      <div v-if='chose===0'>
        <div class='table' v-if='ryqxList.length>0'>
          <el-scrollbar style='height: 300px;line-height: 60px'>
            <el-row :gutter='20'>
              <el-col v-for='(item, index) in ryqxList' :key='`row-${index + 1}`' :span='8'>
                <div class='item'>
                  <el-image :src='item.personPhoto' />
                  <div class='bt'>
                    <div class='row'><span>姓名：</span>{{ item.personName }}</div>
                    <div class='row'><span>所属科室：</span>{{ item.orgName }}</div>
                    <div class='row'><span>授权日期：</span>{{ item.configTime }}</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-scrollbar>
        </div>
        <div class='noThing' v-else>
          <span v-if="loading">加载中</span>
          <span v-else>暂无数据</span>
        </div>
      </div>
      <div v-else-if='chose===1'>
        <div class='table' v-if='kjlList.length>0'>
          <el-row :gutter='20'>
            <el-col :span='8' class='table_top'>人员姓名</el-col>
            <el-col :span='8' class='table_top'>时间</el-col>
            <el-col :span='8' class='table_top'>抓拍照片</el-col>
          </el-row>
          <el-scrollbar style='height: 300px;line-height: 60px'>
            <el-row :gutter='20' v-for='(item, index) in kjlList' :key='`row-${index + 1}`'>
              <el-col :span='8'>{{ item.personName || '-' }}</el-col>
              <el-col :span='8'>{{ item.eventTime || '-' }}</el-col>
              <el-col :span='8'>
                <el-image
                  @click='srcList=[item.picUri]'
                  style='width: 60px; height: 60px'
                  :src='item.picUri'
                  :preview-src-list='srcList'>
                </el-image>
              </el-col>
            </el-row>
          </el-scrollbar>
        </div>
        <div class='noThing' v-else>
          <span v-if="loading">加载中</span>
          <span v-else>暂无数据</span>
        </div>
      </div>
      <div v-else-if='chose===2'>
        <div class='table' v-if='gjjlList.length>0'>
          <el-row :gutter='20'>
            <el-col :span='8' class='table_top'>人员姓名</el-col>
            <el-col :span='8' class='table_top'>时间</el-col>
            <el-col :span='8' class='table_top'>抓拍照片</el-col>
          </el-row>
          <el-scrollbar style='height: 300px;line-height: 60px'>
            <el-row :gutter='20' v-for='(item, index) in gjjlList' :key='`row-${index + 1}`'>
              <el-col :span='8'>{{ item.personName || '-' }}</el-col>
              <el-col :span='8'>{{ item.eventTime || '-' }}</el-col>
              <el-col :span='8'>
                <el-image
                  @click='srcList=[item.picUrl]'
                  style='width: 60px; height: 60px'
                  :src='item.picUrl'
                  :preview-src-list='srcList'>
                </el-image>
              </el-col>
            </el-row>
          </el-scrollbar>
        </div>
        <div class='noThing' v-else>
          <span v-if="loading">加载中</span>
          <span v-else>暂无数据</span>
        </div>
      </div>
      <div v-if='chose===3'>
        <div class='table' v-if='znsbList.length>0'>
          <el-row :gutter='20'>
            <el-col :span='8' class='table_top'>人员姓名</el-col>
            <el-col :span='8' class='table_top'>时间</el-col>
            <el-col :span='8' class='table_top'>抓拍照片</el-col>
          </el-row>
          <el-scrollbar style='height: 300px;line-height: 60px'>
            <el-row :gutter='20' v-for='(item, index) in znsbList' :key='`row-${index + 1}`'>
              <el-col :span='8'>{{ item.personName || '-' }}</el-col>
              <el-col :span='8'>{{ item.eventTime || '-' }}</el-col>
              <el-col :span='8'>
                <el-image
                    @click='srcList=[item.picUri]'
                    style='width: 60px; height: 60px'
                    :src='item.picUri'
                    :preview-src-list='srcList'>
                </el-image>
              </el-col>
            </el-row>
          </el-scrollbar>
        </div>
        <div class='noThing' v-else>
          <span v-if="loading">加载中</span>
          <span v-else>暂无数据</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { map, DILaboratory } from '@/api'
import SwSwitch from '@/components/SwSwitch'
import { mapState } from 'vuex'

const tapList = ['人员权限','刷卡记录', '告警记录','智能识别']
export default {
  components: {
    SwSwitch
  },
  mounted() {
    this.init()
  },
  watch: {
    videoID: {
      deep: true,
      handler(val) {
        this.doorPerson()
        this.isChecked = false
        this.isRead()
        this.chose = 0
      }
    },
    chose(val) {
      switch (val) {
        case 0:
          this.doorPerson()
          break
        case 1:
          this.getDoorList()
          break
        case 2:
          this.doorEventRecord()
          break
        case 3:
          this.getDoorFaceList()
          break
      }
    }
  },
  computed: {
    ...mapState({
      videoID: state => state.security.videoID
    })
  },
  data() {
    return {
      tapList,
      chose: 0,
      isChecked: false,
      details: {},
      nowToday: '',
      nowToday1: [],
      kjlList: [],
      ryqxList: [],
      gjjlList: [],
      srcList: [],
      znsbList: [],
      loading: true
    }
  },
  beforeDestroy() {
    if (this.videoID.eventNum > 0) this.$store.dispatch('security/setCloseDialog', true)
  },
  methods: {
    /**
     * 页面初始化
     */
    async init() {
      await this.getCurrentTime()
      this.doorPerson()
      // this.isRead()
    },
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.$store.commit('security/SET_OPENDIALOG', 0)
    },
    /**
     * 获取当天时间`
     */
    async getCurrentTime() {
      let today = ''
      let today1 = ''
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1
      let dd = new Date().getDate()
      if (mm < 10) mm = '0' + mm
      if (dd < 10) dd = '0' + dd
      today = '（' + yy + '/' + mm + '/' + dd + '）'
      today1 = yy + '-' + mm + '-' + dd
      this.nowToday = today
      this.nowToday1 = [today1 + ' 00:00:00', today1 + ' 23:59:59']
    },
    /**
     * 门禁进出记录
     */
    getDoorList() {
      this.loading = true
      const obj = {
        doorIndexCode: this.videoID.relationId,
        endTime: this.nowToday1[1],
        pageNo: 1,
        pageSize: 50,
        startTime: this.nowToday1[0]
      }
      DILaboratory.getDoorList(obj).then(res => {
        this.kjlList = res.data
        this.loading = false
      })
    },
    /**
     * 门禁告警记录
     */
    doorEventRecord() {
      this.loading = true
      const obj = {
        beginDate: this.nowToday1[0],
        endDate: this.nowToday1[1],
        modelDeviceId: this.videoID.id
      }
      DILaboratory.doorEventRecord(obj).then(res => {
        this.gjjlList = res.data
        this.loading = false
      })
    },
    /**
     * 智能识别列表
     */
    getDoorFaceList() {
      this.loading = true
      const obj = {
        doorIndexCode: this.videoID.relationId,
        endTime: this.nowToday1[1],
        pageNo: 1,
        pageSize: 50,
        startTime: this.nowToday1[0]
      }
      DILaboratory.getDoorFaceList(obj).then(res => {
        this.znsbList = res.data
        this.loading = false
      })
    },
    /**
     * 打开门禁
     * @param e
     */
    changeOpen(e) {
      if (e) {
        map.doControl({
          controlType: this.isChecked ? '2' : '1',
          doorIndexCodes: this.videoID.relationId
        }).then(res => {
          this.$message({
            message: '打开成功',
            type: 'success'
          })
        })
      }
    },
    /**
     * 人员权限
     */
    doorPerson() {
      this.loading = true
      const obj = {
        pageNo: 1,
        pageSize: 999,
        roomId: this.videoID.roomId
      }
      DILaboratory.doorPerson(obj).then(res => {
        this.ryqxList = res.data
        this.loading = false
      })
    },
    isRead() {
      DILaboratory.read({ modelDeviceId: this.videoID.id })
    }
  }
}
</script>

<style lang='less' scoped>
.details {
  position: absolute;
  top: 400px;
  left: 241px;
  width: 997px;
  height: 381px;
  background: rgba(2, 19, 30, 0.6);

}

.dialogTitle {
  background: #2A3E41;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  > :first-child {
    margin-left: 20px;
  }

  .tapItem {
    margin: 0 15px;
    cursor: pointer;
  }

  .chsoe {
    color: rgba(206, 193, 0, 1);
  }

}

.noThing {
  text-align: center;
  color: #47A0DC;
  font-size: 35px;
  line-height: 337px;
}

.table {
  padding: 10px;
  font-size: 20px;
  font-family: PingFang SC;
  color: #FFFFFF;
  line-height: 36px;

  .item {
    display: flex;
    margin-right: 10px;
    margin-bottom: 10px;

    > :first-child {
      width: 67px;
      min-width: 67px;
      height: 92px
    }

    .bt {
      display: flex;
      flex-direction: column;
      width: 180px;
      height: 92px;
      background: rgba(17, 94, 117, 0.35);
      border: 1px solid #0D4B68;
      margin-left: 10px;
      padding: 0 10px;

      .row {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 36px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}

.table_top {
  color: #02ECEF;
}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}


.close {
  float: right;
  margin-top: 16px;
  margin-right: 20px;
  cursor: pointer;
}
</style>
