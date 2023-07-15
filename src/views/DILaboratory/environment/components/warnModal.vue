<template>
  <div class='details'>
    <div class='dialogTitle'>
      <img src='../../../../assets/icon_title.png'>
      <span>详细信息</span>
      <el-date-picker
        v-model='dateValue'
        value-format='yyyy-MM-dd HH:mm:ss'
        :default-time="['00:00:00', '23:59:59']"
        type='daterange'
        size='mini'
        placeholder='选择日期'
        :picker-options='pickerOptions'
        style='position: absolute;right: 40px;top: 9px'
      />
      <i class='el-icon-close close' @click='closeDialog'></i>
    </div>
    <div class='table'>
      <el-row :gutter='20'>
        <el-col :span='6' class='table_top'>告警时间</el-col>
        <el-col :span='4' class='table_top'>告警地点</el-col>
        <el-col :span='14' class='table_top'>告警内容</el-col>
      </el-row>
      <div style='height: 400px;overflow:auto;  overflow-x: hidden;' v-infinite-scroll='load'>
        <el-row :gutter='20' v-if='details.length > 0' v-for='(item, index) in details' :key='`row-${index + 1}`'
                style='margin-bottom: 5px'>
          <el-col :span='6'>{{ item.eventTime || '-' }}</el-col>
          <el-col :span='4'>{{ item.roomName || '-' }}</el-col>
          <el-col :span='14'>{{ item.content || '-' }}</el-col>
        </el-row>
        <el-row v-if='details.length < 1'>
          <div style='text-align: center'>暂无数据</div>
        </el-row>
        <div />
      </div>
    </div>
  </div>
</template>

<script>
import DialogTitle from '@/components/DialogTitle'
import { mapState } from 'vuex'

export default {
  name: 'WarnModal',
  components: {
    DialogTitle
  },
  watch: {
    dateValue(val) {
      if (val != null && this.vb) {
        this.$store.commit('environment/SET_DETAIL', [])
        this.$store.dispatch('environment/showDetailModal', this.warnParam)
      }
    }
  },
  computed: {
    ...mapState({
      details: state => state.environment.detail,
      vb: state => state.environment.vb,
      warnParam: state => state.environment.warnParam,
      pageNum: state => state.environment.pageNum,
      total: state => state.environment.total
    }),
    dateValue: {
      get() {
        return this.$store.state.environment.dateValue
      },
      set(time) {
        this.$store.dispatch('environment/setDateValue', time)
      }
    }
  },
  data() {
    return {
      detailsList: [],
      moveDataelse: {
        x: null,
        y: null
      },
      chose: true,
      value1: [],
      // 时间快捷下拉
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  destroyed() {
    this.$store.commit('environment/SET_DETAIL', [])
    this.$store.commit('environment/SET_PAGENum', 1)
    this.$store.dispatch('environment/getCurrentTime')
  },
  methods: {
    closeDialog() {
      this.$store.commit('environment/SET_VB', false)
    },
    load() {
      if (this.pageNum * 10 < this.total) {
        this.$store.commit('environment/SET_PAGENum', this.pageNum + 1)
        this.$store.dispatch('environment/showDetailModal', this.warnParam)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.details {
  position: absolute;
  top: 400px;
  left: 241px;
  width: 992px;
  background: rgba(2, 19, 30, 0.6);

  > :last-child {
    padding: 15px 0;
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

.table {
  padding: 10px !important;

  .table-content {
    max-height: 300px;
  }
}
</style>
