<template>
  <div class='infoLock'>
    <div class='infoLock-title'>
      <img src='@/assets/title-icon.png' alt=''>
      <span>实时事件信息</span>
      <img src='@/assets/line.png' alt=''>
    </div>
    <div class='infoLock-container'>
      <el-timeline>
        <el-timeline-item v-for='(item,index) in list' :timestamp='item.messageTime' placement='top'>
          <el-card>
            <div class='infoLock-container-content'>
              <div class='infoLock-container-title'>
                【{{ item.messageName }}】
              </div>
              <div class='infoLock-container-text'>
                <div>{{ item.messageContent }}</div>
              </div>
              <div v-for='(item2,index) in item.fujian' @click='preWatch(item2.type,item2.url)' class='fujian'
                   style='color: #26D4F9FF;cursor: pointer;float: left;margin-right: 15px;margin-top: 5px;'>
                <div style='float: left;text-decoration: underline;'>{{ item2.name }}</div>
              </div>

              <div class='clearfloat'></div>
              <div class='infoLock-container-content-lefttop box' />
              <div class='infoLock-container-content-righttop box' />
              <div class='infoLock-container-content-rightbottom box' />
              <div class='infoLock-container-content-leftbottom box' />
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <el-dialog :append-to-body='true' title='预览' v-drag width='1056px' top='130px' :visible.sync='collect'>
      <div class='container' style='align-items: inherit;padding-top: 20px;height: auto;'
           v-if="type=='.png'||type=='.jpeg'||type=='.gif'||type=='.jpg'">
        <div
          style='width: 100%;align-items: center;text-align: center;display: flex;height: 100%;justify-content: center;'>
          <img style='width: 100%;' :src='imgurl' alt=''>
        </div>
      </div>
      <div class='container' v-else style='height: 600px;'>
        <iframe v-if="type=='.pdf'" :src='choiceurl' frameborder='0'></iframe>
        <div v-if="type=='.docx'||type=='.doc'" id='wordView' v-html='vHtml' />
        <div v-if="type=='.xlsx'" id='table'>
          <el-table :data='tableData' style='width: 100%'>
            <el-table-column
              v-for='(value,key,index) in tableData[0]'
              :key='index'
              :prop='key'
              :label='key'
            />
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import mammoth from 'mammoth'
import { missionMessageList } from '@/api/baseInfo'

export default {
  data() {
    return {
      list: [],
      imgurl: '',
      collect: false,
      tableData: [],
      workbook: {},
      excelURL: '',
      type: '',
      vHtml: '',
      choiceurl: '',
      zhbwidth: '2000px',
      activeId: 0,
      persondata: {},
      urldata: []
    }
  },
  mounted() {
    this.init()

  },
  methods: {
    preWatch(type, url) {
      this.collect = true
      this.type = type.toString().toLocaleLowerCase()
      console.log(type)
      if (this.type == '.docx') {
        let vm = this
        vm.wordURL = url
        const xhr = new XMLHttpRequest()
        xhr.open('get', this.wordURL, true)
        xhr.responseType = 'arraybuffer'
        xhr.onload = function() {
          if (xhr.status == 200) {
            mammoth
              .convertToHtml({ arrayBuffer: new Uint8Array(xhr.response) })
              .then(function(resultObject) {
                console.log(resultObject)
                vm.$nextTick(() => {
                  vm.vHtml = resultObject.value
                })
              })
          }
        }
        xhr.send()
        mammoth.convertToHtml({ path: url }).then(res => {
        })
        this.choiceurl = 'https://view.officeapps.live.com/op/view.aspx?src=' + url
      } else if (this.type == '.pdf') {
        this.choiceurl = url
        console.log('psd')
      } else if (this.type == '.xlsx') {
        this.excelURL = url
        this.readWorkbookFromRemoteFile(this.excelURL)
        console.log('excels')
      } else if (this.type == '.png' || this.type == '.jpeg' || this.type == '.gif' || this.type == '.jpg') {
        this.imgurl = url
        console.log('图片')
      }
    },
    readWorkbookFromRemoteFile: function(url) {
      var xhr = new XMLHttpRequest()
      xhr.open('get', url, true)
      xhr.responseType = 'arraybuffer'
      let _this = this
      xhr.onload = function(e) {
        if (xhr.status === 200) {
          var data = new Uint8Array(xhr.response)
          var workbook = XLSX.read(data, { type: 'array' })
          console.log(workbook)

          var sheetNames = workbook.SheetNames // 工作表名称集合
          _this.workbook = workbook
          _this.getTable(sheetNames[0])
        }
      }
      xhr.send()
    },
    getTable(sheetName) {
      console.log(sheetName)
      var worksheet = this.workbook.Sheets[sheetName]
      this.tableData = XLSX.utils.sheet_to_json(worksheet)
      console.log(this.tableData)
    },
    init() {
      missionMessageList({ missionId: this.$route.query.id }).then(res => {
        res.data.forEach(item => {
          if (item.messageFile && item.messageFile !== '') {
            item.fujian = []
            const list = item.messageFile.split(',')
            list.forEach(i => {
              const json = {
                url: i,
                name: i.substring(i.lastIndexOf('/')+1 , i.length),
                type: i.substring(i.lastIndexOf('.'), i.length)
              }
              item.fujian.push(json)
            })
          }
        })
        this.list = res.data
        console.log('2222222', this.list)
      })
    }
  },
  directives: {
    drag: {
      // 指令的定义
      bind: function(el, bindings, vnode) {
        let odiv = el   //获取当前元素
        el.onmousedown = (e) => {
          console.log(e)
          let oldY = e.screenY
          let oldX = e.screenX
          let type = bindings.value
          const _self = vnode.context
          let disX = e.clientX - odiv.offsetLeft
          let disY = e.clientY - odiv.offsetTop
          let left = ''
          let top = ''
          document.onmousemove = (e) => {
            left = e.clientX - disX
            top = e.clientY - disY
            odiv.style.left = left + 'px'
            odiv.style.top = top + 'px'
          }
          document.onmouseup = (e) => {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
.box {
  background-color: #FFD905FF;
  width: 3px;
  height: 3px;
  position: absolute;
}

.container {
  width: 100%;
  height: 1169px;
  overflow-y: auto;

  iframe {
    width: 100%;
    height: 100%;
  }
}

.infoLock-container {
  height: 375px;
  overflow: hidden;
  overflow-y: auto;
  padding: 5px;

  &-content {
    padding: 10px;
    height: auto;
    background: rgba(7, 51, 88, 0.4);
    border: 1px solid #084495;
    position: relative;

    &-lefttop {
      top: 0px;
      left: 0px;
    }

    &-leftbottom {
      bottom: 0px;
      left: 0px;
    }

    &-righttop {
      top: 0px;
      right: 0px;
    }

    &-rightbottom {
      bottom: 0px;
      right: 0px;
    }
  }

  &-title {
    color: #26D4F9FF;
    font-size: 14px;
    font-family: PingFang SC;
  }

  &-text {
    color: #FFFFFF;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    margin-top: 12px;
    text-indent: 2em;
    line-height: 23px;
  }
}

/deep/ .el-card__body {
  padding: 0px;
}

/deep/ .el-card {
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
}

/deep/ .el-timeline-item__timestamp {
  width: 200px;
  height: 24px;
  line-height: 19px;
  background: #167CFA;
  border-radius: 12px;
  font-size: 16px;
  font-family: Source Han Sans SC;
  font-weight: 400;
  color: #FEFEFE;
  text-align: center;

}

/deep/ .el-timeline-item__tail {
  top: 11px;
  border-left: 2px solid #DB3141FF;
  height: 94%;
}

/deep/ .el-timeline-item__node {
  background-color: rgba(0, 0, 0, 0);
  border: 2px solid #DB3141FF;
}

.el-timeline {
  padding: 0px;
}

.infoLock {
  width: 362px;
  height: 458px;
  padding: 20px;
  background: rgba(4, 16, 27, 0.8);

  &-title {
    width: 100%;

    :first-child {
      vertical-align: top;
    }

    :nth-child(2) {
      font-size: 18px;
      font-family: sbold;
      font-weight: 600;
      color: #FEFEFE;
      margin-left: 17px;
    }

    :last-child {
      width: calc(100% - 30px);
      margin-left: 30px;
    }
  }

}

::v-deep .el-dialog {
  margin: 90px auto 0 !important;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  width: 6px;
  background: rgba(#101F1C, 0.1);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(#101F1C, 0.5);
  background-clip: padding-box;
  min-height: 28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(#101F1C, 1);

}

::v-deep .el-timeline-item__tail {
  height: 92%;
  left: 6px;
  top: 16px;
}
</style>
