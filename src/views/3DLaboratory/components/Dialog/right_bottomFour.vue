<template>
  <!--  <div class="details"  ref="details" @mousedown="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">-->
  <div class='details'>
    <div class='dialogTitle'>
      <img src='../../../../assets/icon_title.png'>
      <span>详细信息</span>
      <span v-if='chose' style='margin-left: 30px'>{{ details[0]['CreateTime'] }}</span>
      <span class='warningData' @click='chose=!chose'>{{ chose ? '告警信息' : '返回' }}</span>
      <i class='el-icon-close close' @click='closeDialog'></i>
    </div>
    <el-row v-if='chose==true' :gutter='20'>
      <el-col :span='4' class='table_top'>监测项</el-col>
      <el-col :span='5' class='table_top'>数值</el-col>
      <el-col :span='5' class='table_top'>状态</el-col>
      <el-col :span='5' class='table_top'>告警内容</el-col>
      <el-col :span='5' class='table_top'>标准范围</el-col>

      <div v-for='(item,index) in details '>
        <el-col :span='4'>{{ item.name || '-' }}</el-col>
        <el-col :span='5'>{{ item.value || '-' }}</el-col>
        <el-col :style="{'color': (item.status == '异常' ? 'red':'#fff')}" :span='5'>{{ item.status || '-' }}</el-col>
        <el-col :span='5'>{{ item.warningMessage || '-' }}</el-col>
        <el-col :span='5'>{{ item.standard || '-' }}</el-col>
      </div>
    </el-row>
    <div class='' v-else>
      <el-date-picker
        v-model='value1'
        size='mini'
        type='datetimerange'
        start-placeholder='开始日期'
        end-placeholder='结束日期'
        value-format='yyyy-MM-dd HH:mm:ss'
        :default-time="['00:00:00', '23:59:59']"
      >
      </el-date-picker>
      <el-row :gutter='20'>
        <el-col :span='3' class='table_top'>监测项</el-col>
        <el-col :span='4' class='table_top'>数值</el-col>
        <el-col :span='7' class='table_top'>告警时间</el-col>
        <el-col :span='5' class='table_top'>告警内容</el-col>
        <el-col :span='5' class='table_top'>标准范围</el-col>
      </el-row>
      <div style='height:200px'>
        <el-scrollbar style='height:100%'>
          <div v-for='(item,index) in detailsList '>
            <el-row :gutter='20'>
              <el-col :span='3'>{{ item.name || '-' }}</el-col>
              <el-col :span='4'>{{ item.value || '-' }}</el-col>
              <el-col :span='7'>{{ item.CreateTime || '-' }}</el-col>
              <el-col :span='5'>{{ item.warningMessage || '-' }}</el-col>
              <el-col :span='5'>{{ item.standard || '-' }}</el-col>
            </el-row>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
import DialogTitle from '@/components/DialogTitle'
import { map } from '@/api'
import { mapGetters } from 'vuex'
import { EventBus } from '@/mapJs/EventBus'

export default {
  name: '',
  components: {
    DialogTitle
  },
  watch: {
    equipmentId() {
      map.getEnvironmentInfo({ deviceID: this.equipmentId }).then(res => {
        this.details = res.data
        this.getCurrentTime()
      })
    },
    value1: {
      handler(val) {
        this.getEnvironmentWarningList()
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'equipmentId',
      'buildingControl'
    ])
  },
  data() {
    return {
      details: [{
        'CreateTime': '-'
      }],
      detailsList: [],
      moveDataelse: {
        x: null,
        y: null
      },
      chose: true,
      value1: []
    }
  },
  beforeDestroy() {
    EventBus.$emit('floor', this.buildingControl)
  },
  mounted() {
    EventBus.$emit('setLookDown', '')
    map.getEnvironmentInfo({ deviceID: this.equipmentId }).then(res => {
      this.details = res.data
    })
    this.getCurrentTime()
  },
  methods: {
    closeDialog() {
      this.$store.dispatch('map/setOpenDialog', 0)
    },
    mouseDownHandleelse(event) {
      this.moveDataelse.x = event.pageX - this.$refs.details.offsetLeft
      this.moveDataelse.y = event.pageY - this.$refs.details.offsetTop
      event.currentTarget.style.cursor = 'move'
      window.onmousemove = this.mouseMoveHandleelse
    },
    mouseMoveHandleelse(event) {
      let moveLeft = event.pageX - this.moveDataelse.x + 'px'
      let moveTop = event.pageY - this.moveDataelse.y + 'px'
      this.$refs.details.style.left = moveLeft
      this.$refs.details.style.top = moveTop
    },
    mouseUpHandleelse(event) {
      window.onmousemove = null
      event.currentTarget.style.cursor = 'move'
    },
    getEnvironmentWarningList() {
      const obj = {
        deviceID: '05701711',
        // deviceID: this.equipmentId,
        beginTime: this.value1[0],
        endTime: this.value1[1]
      }
      map.getEnvironmentWarningList(obj).then(res => {
        this.detailsList = res.data
      })
    },
    async getCurrentTime() {
      let today = ''
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1
      let dd = new Date().getDate()
      today = yy + '-' + mm + '-' + dd
      this.value1 = [today + ' 00:00:00', today + ' 23:59:59']
    }
  }
}
</script>
<style lang='less' scoped>
.details {
  position: absolute;
  top: 540px;
  left: 430px;
  width: 838px;
  background: rgba(2, 19, 30, 0.6);

  > :last-child {
    padding: 15px;
    font-size: 20px;
    font-family: PingFang SC;
    color: #FFFFFF;
    line-height: 36px;
  }
}

.dialogTitle {
  position: relative;
  background: rgba(0, 51, 76, 0.49);
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  > :first-child {
    margin: 12px;
    vertical-align: top;
  }
}

.top {
  margin: 16px 33px;
  height: 40px;
  border: 1px solid rgba(0, 235, 253, 0.34);
  border-radius: 20px;
  color: #FFFFFF;

  span {
    display: inline-block;
    width: 33%;
    height: 38px;
    text-align: center;
    cursor: pointer;
  }
}

.warningData {
  position: absolute;
  right: 60px;
  height: 33px;
  color: rgba(9, 236, 240, 1);
  cursor: pointer;
  border-bottom: 1px solid rgba(9, 236, 240, 1);
}

.close {
  float: right;
  margin-top: 16px;
  margin-right: 20px;
  cursor: pointer;
}

.table_top {
  color: #02ECEF;
}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}

</style>
