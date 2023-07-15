<template>
  <div class='details' ref='details'>
    <div class='dialogTitle'>
      <img src='../../../../assets/icon_title.png'>
      <span>详细信息</span>
      <!--      <span style='margin-left: 30px'>{{ details[0]['gmtCreate'] }}</span>-->
      <el-date-picker
        v-model='value'
        value-format='yyyy-MM-dd'
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
        <el-col :span='6' class='table_top'>告警地点</el-col>
        <el-col :span='6' class='table_top'>告警类型</el-col>
        <el-col :span='6' class='table_top'>抓拍照片</el-col>
      </el-row>
      <div style='height: 300px;line-height: 60px;overflow:auto;  overflow-x: hidden;' v-infinite-scroll='load'>
        <el-row
          :gutter='20' v-for='(item, index) in detailsList'
          :key='`row-${index + 1}`'>
          <el-col :span='6'>{{ item.eventTime || '-' }}</el-col>
          <el-col :span='6'>{{ item.roomName || '-' }}</el-col>
          <el-col :span='6'>{{ item.name || '-' }}</el-col>
          <el-col :span='4'>
            <el-image
              @click='srcList=[item.picUrl]'
              style='width: 60px; height: 60px'
              :src='item.picUrl'
              :preview-src-list='srcList'>
            </el-image>
          </el-col>
          <el-col v-if='openDialog===3' :span='2'>
            <el-button type='text' @click='deleteOne(item)'>删除</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import DialogTitle from '@/components/DialogTitle'
import { DILaboratory } from '@/api'
import { mapState } from 'vuex'

export default {
  name: 'Modal',
  components: {
    DialogTitle
  },
  watch: {
    dialogCode() {
      this.pageNum = 1
      this.detailsList = []
      this.environmentWarnDetail()
    },
    value(val) {
      if (val != null) {
        this.pageNum = 1
        this.detailsList = []
        this.environmentWarnDetail()
      }
    }
  },
  computed: {
    ...mapState({
      dialogCode: state => state.security.dialogCode,
      openDialog: state => state.security.openDialog
    })
  },

  data() {
    return {
      details: [{
        'gmtCreate': '-'
      }],
      value: [],
      detailsList: [],
      srcList: [],
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
      },
      pageNum: 1,
      total: 0
    }
  },
  mounted() {
    const Data = new Date()
    const year = Data.getFullYear().toString()
    let month = (Data.getMonth() + 1).toString()
    let data = Data.getDate().toString()
    if (month.length < 2) month = '0' + month
    if (data.length < 2) data = '0' + data
    this.value = [year + '-' + month + '-' + data, year + '-' + month + '-' + data]
    this.environmentWarnDetail()
  },
  methods: {
    closeDialog() {
      this.$store.commit('security/SET_OPENDIALOG', 0)
    },
    environmentWarnDetail() {
      let obj = {
        type: [1, 2],
        beginTime: this.value[0] + ' 00:00:00',
        endTime: this.value[1] + ' 23:59:59',
        pageNum: this.pageNum,
        limit: 10
      }
      if (this.dialogCode !== '1') {
        obj = {
          ...obj,
          eventType: [this.dialogCode]
        }
      }
      DILaboratory.environmentWarnDetail(obj).then(res => {
        console.log(res)
        this.detailsList = this.detailsList.concat(res.data.rows)
        this.total = res.data.total

      })
    },

    deleteOne(item) {
      this.$confirm('是否删除该条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DILaboratory.deleteEvent({ eventId: item.id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.environmentWarnDetail()
        })


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    load() {
      if (this.pageNum * 10 < this.total) {
        this.pageNum += 1
        this.environmentWarnDetail()
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
  width: 900px;
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
}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
