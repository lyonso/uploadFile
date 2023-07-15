<template>
  <div class='satelliteList'>
    <el-form ref='form' :model='form' :inline='true' label-width='82px'>
      <el-form-item label='选择门禁：'>
        <el-select v-model='form.doorIndexCode' placeholder='请选择'>
          <el-option
            v-for='(item , index) in optionList'
            :label='item.name'
            :value='item.indexCode' />
        </el-select>
      </el-form-item>
      <el-form-item label='选择时间：'>
        <el-date-picker
          v-model='form.time'
          type='datetimerange'
          value-format='yyyy-MM-dd HH:mm:ss'
          range-separator='至'
          :picker-options='pickerOptions'
          start-placeholder='开始日期'
          end-placeholder='结束日期'
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='onsubmit'>查询</el-button>
      </el-form-item>
    </el-form>
    <div class='body'>
      <div class='title'>
        门禁管理
        <i class='el-icon-s-unfold icon' @click='chageSteps'></i>
      </div>
      <div class='imgList'>

        <div class='vp-content'>
          <!-- 新增按钮 -->
          <!-- 表格 -->
          <div class='tableReset__style'>
            <el-table
              ref='multipleTable'
              :data='list'
              tooltip-effect='dark'
              :cell-style="{background: 'transparent',color:'#fff'}"
              :header-cell-style="{background: 'linear-gradient(0deg, rgba(0, 48, 83, 0.14), rgba(0, 143, 255, 0.14))'}"
            >
              <el-table-column prop='jcsjCameraId' label='抓拍图片' min-width='100px'>
                <template slot-scope='scope'>
                  <el-image
                    v-if='scope.row.picUri'
                    style='width: 30px; height: 30px'
                    :src='scope.row.picUri'
                    :preview-src-list='srcList'
                    @click='srcList=[scope.row.picUri]'
                  />
                  <span v-else>暂无图片</span>
                </template>
              </el-table-column>
              <el-table-column prop='personName' label='人员姓名' min-width='100px' />
              <el-table-column prop='jobNo' label='工号' min-width='184px' />
              <el-table-column prop='cardNo' label='卡号' min-width='100px' />
              <el-table-column prop='orgName' label='所属组织' min-width='100px' />
              <el-table-column prop='doorName' label='门禁点' min-width='100px' />
              <el-table-column prop='inAndOutType' label='出/入' min-width='100px' />
              <el-table-column prop='eventType' label='事件类型' min-width='100px' />
              <el-table-column prop='eventTime' label='时间' min-width='140px' />

            </el-table>
            <div style='text-align:right;margin-top: 20px'>
              <el-pagination
                background
                @size-change='sizechange'
                @current-change='changepage'
                :current-page='form.pageNum'
                :page-sizes='[10, 20, 30, 40]'
                :page-size='100'
                layout='total, sizes, prev, pager, next, jumper'
                :total='total'
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { map } from '@/api'
import DialogTitle from '@/components/DialogTitle'
import { formDate } from '@/utils/time'
import { mapGetters } from 'vuex'

export default {
  name: 'satelliteList',
  components: {
    DialogTitle
  },
  watch: {
    'form.time': {
      deep: true,
      handler(val) {
        if (val !== null) {
          this.form.beginTime = val[0]
          this.form.endTime = val[1]
        } else {
          this.form.beginTime = ''
          this.form.endTime = ''
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'mjID'
    ])
  },
  mounted() {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
    this.form.time = [start, end]
    this.form.beginTime = formDate(start, 'yyyy-MM-DD HH:mm:ss')
    this.form.endTime = formDate(end, 'yyyy-MM-DD HH:mm:ss')
    this.lzImgList()
    this.form.doorIndexCode = this.mjID
    this.$store.dispatch('map/setMask', true)
    map.acsDoorList().then(res => {
      this.optionList = res.data.data.list
    })
  },
  beforeDestroy() {
    this.$store.dispatch('map/setMask', false)
  },
  data() {
    return {
      // 表单
      form: {
        doorIndexCode: '',
        time: [],
        beginTime: '',
        endTime: '',
        pageNum: 1,
        limit: 10
      },
      srcList: [],
      // 分页信息
      total: 0,
      // 列表
      list: [],
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
      },
      optionList: []
    }
  },

  methods: {
    chageSteps() {
      this.$store.dispatch('map/setOpenDialog', 0)
    },
    onsubmit() {
      this.form.pageNum = 1
      this.total = 0
      this.lzImgList()
    },
    /**
     * 获取图片
     */
    lzImgList() {
      const obj = {
        doorIndexCode: this.form.doorIndexCode,
        startTime: this.form.beginTime,
        endTime: this.form.endTime,
        pageNo: this.form.pageNum,
        pageSize: this.form.limit
      }
      map.getDoorList(obj).then(res => {
        this.list = res.data.list
        this.total = res.data.data.total
      })
    },
    /**
     *  切换每页显示
     */
    //
    sizechange(e) {
      this.form.limit = e
      this.lzImgList()
    },
    /**
     *   切换每页显示
     */
    changepage(e) {
      this.form.pageNum = e
      this.lzImgList()
    }
  }
}
</script>

<style lang='less' scoped>
.satelliteList {
  position: absolute;
  width: 1880px;
  height: 960px;
  top: 90px;
  z-index: 1;
  padding: 20px 30px;

  .body {
    width: 1842px;
    border: 1px solid rgba(229, 229, 229, 0.31);
  }

  .imgList {
    color: #fff;
    height: calc(100vh - 280px);
    overflow: auto;
  }
}

.title {
  position: relative;
  height: 44px;
  background: rgba(14, 78, 116, 0.31);
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 44px;
  padding-left: 23px;

  .icon {
    position: absolute;
    right: 16px;
    top: 11px;
    opacity: 0.52;
    font-size: 24px;
    cursor: pointer;
  }

  :nth-child(2) {
    right: 60px;
  }

}

.down {
  text-align: center;
  color: #fff;
  opacity: 0.48;
}

::v-deep .el-button--primary {
  width: 116px;
  height: 40px;
  border: 1px solid #0089D7;
  opacity: 0.48;
  background: rgba(0, 137, 215, 0);
  border-radius: 3px;
  font-size: 20px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #FFFFFF
}

::v-deep .el-input__inner {
  background-color: rgba(0, 51, 76, 0.49);
  border: 1px solid #05556B;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.67)
}

::v-deep .el-button {
  padding-top: 9px;
}

::v-deep .el-range-input {
  background: rgba(0, 137, 215, 0);
  color: rgba(255, 255, 255, 0.67)
}

::v-deep .el-range-separator {
  color: #FFFFFF
}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}


.vp-content {
  background-color: transparent;
  //width: calc(100% - 50px);
  padding: 10px;
  box-sizing: border-box;
}
</style>
