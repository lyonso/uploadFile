<template>
  <div class='satelliteList'>
    <el-form ref='form' :model='form' :inline='true' label-width='82px'>
      <el-form-item label='选择类型：'>
        <el-select v-model='form.fileTheme' placeholder='请选择'>
          <el-option label='卫星影像' value='卫星遥感影像'></el-option>
          <el-option label='草藻分布图' value='中分辨率太湖草藻分布图'></el-option>
          <el-option label='人工观测图' value='人工调查太湖蓝藻分布图'></el-option>
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
        蓝藻卫星影像及解译情况
        <i class='el-icon-s-unfold icon' @click='chageSteps'></i>
        <i class='el-icon-video-play icon' @click='openVideo'></i>
      </div>
      <div class='imgList'>
        <el-scrollbar style='height:100%;width: 100%;'>
          <el-row v-infinite-scroll='load'>
            <el-col v-for='(item,index) in imglist' :key='index' :span='3'>
              <el-image class='img' :src='item.selfUrl' :preview-src-list='srcList'
                        @click='srcList=[item.selfUrl]' />
              <div class='time'>{{ item.makeTime }}</div>
            </el-col>
          </el-row>
          <div v-if='show' class='down'>到底了!</div>
        </el-scrollbar>
      </div>
    </div>
    <div class='dialog' v-if='dialog'>
      <i class='el-icon-close' @click='closeVideo'></i>
      <img class='videoImg' :src="imglist[imgIndex]['selfUrl']">
    </div>
  </div>
</template>
<script>
import { map } from '@/api'
import DialogTitle from '@/components/DialogTitle'
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
      'fileTheme'
    ])
  },
  mounted() {
    this.form.fileTheme = this.fileTheme
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
    this.form.time = [start, end]
    this.lzImgList()
    this.$store.dispatch('map/setMask', true)
  },
  beforeDestroy() {
    this.$store.dispatch('map/setFileTheme', '卫星遥感影像')
    this.$store.dispatch('map/setMask', false)
    clearInterval(this.timer)

  },
  data() {
    return {
      // 表单
      form: {
        fileTheme: '卫星遥感影像',
        time: [],
        bookmark: '',
        beginTime: '',
        endTime: '',
        pageNum: 1,
        limit: 24
      },
      // 分页信息
      total: 0,
      // 图片列表
      imglist: [],
      // 图片预览list
      srcList: [],
      // loading
      Loading: true,
      //  无更多底部文字
      show: false,
      // 页面跳转进来的站点信息
      dialogDetails: {},
      // 动态预览图片弹框状态
      dialog: false,
      // 动态预览图片定时器
      timer: '',
      // 动态预览图片定时器Index
      imgIndex: 0,
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
  methods: {
    chageSteps() {
      this.$emit('chageSteps', 1)
    },
    onsubmit() {
      this.form.pageNum = 1
      this.total = 0
      this.imglist = []
      this.srcList = []
      this.lzImgList()
      this.Loading = false
    },
    /**
     * 获取图片
     */
    lzImgList() {
      const obj = {
        fileTheme: this.form.fileTheme,
        beginTime: this.form.beginTime,
        endTime: this.form.endTime,
        pageNum: this.form.pageNum,
        limit: this.form.limit
      }
      map.lzImgList(obj).then(res => {
        let data = this.imglist
        if (res.data.total == 0) this.show = true
        let imgList = res.data.rows
        imgList.forEach((item, index) => {
          // map.downloadImg({ imgId:item.imgId }).then(res=>{
          //   const dataInfo =res
          //   let reader = new window.FileReader()
          //   reader.readAsArrayBuffer(dataInfo)
          //   let url = ''
          //   reader.onload = function (e) {
          //     const result = e.target.result
          //     const contentType = dataInfo.type
          //     // 生成blob图片,需要参数(字节数组, 文件类型)
          //     const blob = new Blob([result], { type: contentType })
          //     // 使用 Blob 创建一个指向类型化数组的URL, URL.createObjectURL是new Blob文件的方法,可以生成一个普通的url,可以直接使用,比如用在img.src上
          //     url = window.URL.createObjectURL(blob)
          //     imgList[index]['selfUrl'] = url
          //   }
          // })
          this.imglist = imgList
          data.push(imgList[index])
        })
        this.imglist = data
        this.total = res.data.total
        this.Loading = false
      })
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
    /**
     * 打开图片自动预览
     */
    openVideo() {
      this.dialog = true
      this.imgIndex = this.imglist.length
      this.timer = setInterval(
        () => {
          this.imgIndex -= 1
          console.log(this.imgIndex)
          if (this.imgIndex === 0) {
            this.dialog = false
            clearInterval(this.timer)
          }
        }, 300)
    },
    /**
     * 关闭自动预览
     */
    closeVideo() {
      this.dialog = false
      clearInterval(this.timer)
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
      width: 208px;
      height: 208px;
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

.dialog {
  width: 100%;
  height: 100vh;
  position: absolute;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.5);
  top: -90px;
  left: -10px;

  :first-child {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 100px;
    right: 200px;
    font-size: 40px;
    color: aliceblue;
    cursor: pointer;
    opacity: .5;
  }
}

.videoImg {
  height: calc(100vh - 180px);
  display: block;
  text-align: center;
  margin: 90px auto;
}
</style>
