<template>
  <div class='satelliteList'>
    <el-form ref='form' :model='form' :inline='true' label-width='82px'>
      <el-form-item label='选择站点：'>
        <el-select v-model='form.pointCode' @change='changeVal()' placeholder='请选择'>
          <el-option
            v-for='(item,index) in optionsList'
            :key='index'
            :label='item.pointName'
            :value='item.pointCode'
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if='dialogDetails.type===2' label='预置点：'>
        <el-select v-model='form.presetPoint' clearable placeholder='请选择'>
          <el-option
            v-for='(item,index) in optionsTwoList'
            :key='index'
            :label="'预置点'+item"
            :value='item'
          />
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
        {{ title }}
        <i class='el-icon-s-unfold icon' @click='chageSteps'></i>
      </div>
      <div v-if='dialogDetails.type===2' class='imgList'>
        <el-scrollbar style='height:100%;width: 100%;'>
          <el-row v-infinite-scroll='load'>
            <el-col v-for='(item,index) in imglist' :key='index' :span='3'>
              <div style='margin-bottom: 10px'>{{ item.originalDate }}</div>
              <el-image class='img' :src='item.selfUrl'
                        @click='srcList=[item.selfUrl]' :preview-src-list='srcList' />
              <div style='text-align: center;margin:0 20px 10px 0'>{{ item.eventType }}</div>
              <div :style="{paddingRight: (index+1)%8 == 0 ? '20px' : '0px' }">
                <el-divider></el-divider>
              </div>
            </el-col>
          </el-row>
          <div v-if='show' class='down'>到底了!</div>
        </el-scrollbar>
      </div>
      <div v-else class='imgList'>
        <el-scrollbar style='height:100%;width: 100%;'>
          <el-row v-infinite-scroll='load'>
            <el-col v-for='(item,index) in imglist' :key='index' :span='3'>
              <div>时间: {{ item.makeTime }}</div>
              <el-image class='img' :src='item.selfUrl' style='width: 210px; height: 160px'
                        @click='srcList=[item.selfUrl]' :preview-src-list='srcList' />
            </el-col>
          </el-row>
          <div v-if='show' class='down'>到底了!</div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
import { map } from '@/api'
import DialogTitle from '@/components/DialogTitle'
import _ from 'lodash'
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
      'BlueDialogDetails'
    ])
  },

  mounted() {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
    this.form.time = [start, end]

    const details = JSON.parse(this.BlueDialogDetails)
    this.dialogDetails = details
    this.form.pointCode = details.pointCode

    if (details.type === 2) this.optionsTwoList = details.presetPoint.split(';')
    this.lzImgList()
    this.spjkPoint()
    this.$store.dispatch('map/setMask', true)
  },
  data() {
    return {
      // 表单
      form: {
        pointCode: '',
        presetPoint: '',
        time: [],
        beginTime: '',
        endTime: '',
        pageNum: 1,
        limit: 40
      },
      // 分页信息
      total: 0,
      // 站点下拉
      optionsList: [],
      // 预置点下拉
      optionsTwoList: [],
      // 图片列表
      imglist: [],
      // 图片预览list
      srcList: [],
      //  站点名称
      title: '',
      // loading
      Loading: true,
      //  无更多底部文字
      show: false,
      // 页面跳转进来的站点信息
      dialogDetails: {},
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
  beforeDestroy() {
    this.$store.dispatch('map/setMask', false)
  },
  methods: {
    /**
     * 站点下拉
     */
    spjkPoint() {
      map.picturePoint({ type: this.dialogDetails.type }).then(res => {
        this.optionsList = res.data
        res.data.forEach(item => {
          if (item.pointCode == this.dialogDetails.pointCode) this.title = item.pointName
        })
      })
    },
    /**
     * 返回详情
     */
    chageSteps() {
      let type = 0
      console.log()
      switch (this.dialogDetails.type) {
        case 0:
          type = 2
          break
        case 1:
          type = 2
          break
        case 2:
          type = 3
          break
        case 4:
          type = 5
          break
      }
      this.$emit('chageSteps', type)
    },
    /**
     * 搜索
     */
    onsubmit() {
      this.form.pageNum = 1
      this.total = 0
      this.imglist = []
      this.srcList = []
      this.lzImgList()
      this.Loading = false
      this.optionsList.forEach(item => {
        if (item.pointCode == this.form.pointCode) {
          this.title = item.pointName
        }
      })
    },
    /**
     * 获取图片
     */
    lzImgList() {
      const obj = {
        beginTime: this.form.beginTime,
        endTime: this.form.endTime,
        pageNum: this.form.pageNum,
        limit: this.form.limit,
        pointCode: this.form.pointCode
      }
      if (this.dialogDetails.type == 2) {
        obj.presetPoint = this.form.presetPoint
        map.imglist(obj).then(res => {
          if (res.data.total == 0) this.show = true
          let data = this.imglist
          res.data.rows.forEach(item => {
            data.push(item)
          })
          this.imglist = data
          this.total = res.data.total
          this.Loading = false
        })
      } else {
        map.lzImgList(obj).then(res => {
          if (res.data.total == 0) this.show = true
          let data = this.imglist
          res.data.rows.forEach(item => {
            data.push(item)
          })
          this.imglist = data
          this.total = res.data.total
          this.Loading = false
        })
      }
    },
    /**
     *瀑布流加载
     */
    load() {
      if (!this.Loading) {
        this.Loading = true
        if (this.form.pageNum * this.form.limit >= this.total) {
          this.show = true
        } else {
          this.form.pageNum++
          this.lzImgList()
        }
      }
    },
    changeVal() {
      const id = this.form.pointCode
      this.form.presetPoint = ''
      this.optionsList.forEach(item => {
        if (item.pointCode === id) {
          console.log(item)
          this.optionsTwoList = item.presetPointList
        }
      })
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
    margin: 20px 0 20px 20px;

    .img {
      margin-right: 20px;
      margin-bottom: 4px;
    }

    .time {
      margin-bottom: 24px;
    }
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
  color: #FFFFFF
}

::v-deep .el-button {
  padding-top: 9px;
}

::v-deep .el-range-input {
  background: rgba(0, 137, 215, 0);
  color: #FFFFFF;
}

::v-deep .el-range-separator {
  color: #FFFFFF
}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
::v-deep .el-divider--horizontal {
  margin: 20px 0 24px;
}
::v-deep .el-divider {
  background-color: #05556B;
}
</style>
