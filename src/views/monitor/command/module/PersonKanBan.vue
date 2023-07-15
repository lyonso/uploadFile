<template>
  <div class='infoLock'>
    <div class='infoLock-title'>
      <img src='@/assets/title-icon.png' alt='' />
      <span class='infoLock-title-text'>简报</span>>
      <img src='@/assets/line.png' alt='' />
    </div>
    <div style='height:230px;overflow: auto'>
      <div>
        <!--        <div class='infoLock-container' style='margin-right: 10px;'-->
        <!--             v-for='(item,index) in persondata.yjylMissionHeadquartersList'>-->
        <div class='infoLock-container'>
          <div class='infoLock-container-list'>
              <div>{{ persondata.missionName }}</div>
            <!--            <div>{{ item.headName }}</div>-->
          </div>
          <!--          <div class='infoLock-container-list'>-->
          <!--            <div style='color: #16cff7ff; text-align: left; margin-left: 5px'>-->
          <!--              指挥：-->
          <!--            </div>-->
          <!--            <div>{{ item.commander }}</div>-->
          <!--          </div>-->
        </div>
      </div>
      <div class='infoLock-bottom'>
        <div class='infoLock-bottom-lefttop box'></div>
        <div class='infoLock-bottom-righttop box'></div>
        <div class='infoLock-bottom-rightbottom box'></div>
        <div class='infoLock-bottom-leftbottom box'></div>
        <div style='color: #16cff7ff; text-align: left; margin-left: 5px'>
          附件：
        </div>
        <div
          @click='perv(item.type, item.url)'
          class='infoLock-bottom-prew'
          style='text-align: left; margin-left: 5px; margin-top: 5px;cursor: pointer;'
          v-for='(item, index) in urldata'
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <el-dialog
      title='预览'
      width='1056px'
      top='130px'
      :append-to-body='true'
      :visible.sync='collect'
      :destroy-on-close='true'
      :close-on-click-modal='false'
      v-drag
    >
      <div v-if="type == '.jpg'||type == '.png'||type=='.jpeg'||type=='.gif'"
           class='container' style='align-items: inherit;padding-top: 20px;'>
        <div style='width: 100%;text-align: center;'>
          <img :src='imgUrl' width='1000'>
        </div>
      </div>
      <div class='container' v-else>
        <iframe v-if="type == '.pdf'" :src='choiceurl' frameborder='0'></iframe>
        <div v-if="type == '.docx'||type=='.doc'" id='wordView' v-html='vHtml' />
        <div v-if="type == '.xlsx'||type=='.xls'" id='table'>
          <el-table :data='tableData' style='width: 100%'>
            <el-table-column
              v-for='(value, key, index) in tableData[0]'
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
import pdf from 'vue-pdf'
import { getMissionInfo, headquarterslist, commandMissionById } from '@/api/baseInfo'

export default {

  data() {
    return {
      // cwidth: '200px',
      tableData: [],
      workbook: {},
      excelURL: '',
      imgUrl: '',
      type: '',
      vHtml: '',
      choiceurl: '',
      collect: false,
      zhbwidth: '2000px',
      list: [],
      activeId: 0,
      persondata: {},
      urldata: []
    }
  },
  mounted() {
    this.init(this.$route.query.id)
  },
  methods: {
    choicehead(item) {
      this.activeId = item.yjylHeadquartersId
      this.initChoice(this.activeId)
    },
    perv(type, url) {
      this.collect = true
      this.type = type.toString().toLocaleLowerCase()
      console.log(this.type)
      if (this.type == '.docx' || this.type == '.doc') {
        let vm = this
        vm.wordURL = url
        const xhr = new XMLHttpRequest()
        xhr.open('get', this.wordURL, true)
        xhr.responseType = 'arraybuffer'
        xhr.onload = function() {
          if (xhr.status == 0) {
            mammoth
              .convertToHtml({ arrayBuffer: new Uint8Array(xhr.response) })
              .then(function(resultObject) {
                vm.$nextTick(() => {
                  vm.vHtml = resultObject.value
                })
              })
          }
        }
        xhr.send()
        mammoth.convertToHtml({ path: url }).then((res) => {
        })
        // this.choiceurl = "https://view.officeapps.live.com/op/view.aspx?src=" + url;
      } else if (this.type == '.pdf') {
        this.choiceurl = url
      } else if (this.type == '.xlsx' || this.type == '.xls') {
        this.excelURL = url
        this.readWorkbookFromRemoteFile(url)
      } else if (this.type == '.jpg' || this.type == '.png' || this.type == '.jpeg' || this.type == '.gif') {
        this.imgUrl = url
      }
    },
    readWorkbookFromRemoteFile: function(url) {
      var xhr = new XMLHttpRequest()
      console.log(url)
      xhr.open('get', url, true)
      xhr.responseType = 'arraybuffer'
      let _this = this
      xhr.onload = function(e) {
        if (xhr.status === 200) {
          var data = new Uint8Array(xhr.response)
          var workbook = XLSX.read(data, { type: 'array' })

          var sheetNames = workbook.SheetNames // 工作表名称集合
          _this.workbook = workbook
          _this.getTable(sheetNames[0])
        }
      }
      xhr.send()
    },
    getTable(sheetName) {
      var worksheet = this.workbook.Sheets[sheetName]
      this.tableData = XLSX.utils.sheet_to_json(worksheet)
    },

    initChoice(id) {
    },
    init(id) {
      getMissionInfo(this.$route.query.id).then((res) => {
        console.log('------>', res)
        this.persondata = res.data
        // this.cwidth = (190 * res.data.yjylMissionHeadquartersList.length) + 'px'
        commandMissionById(this.$route.query.id).then(res => {
          if (res.data.missionFile) {
            let arr = res.data.missionFile.split(',')

            for (let i = 0; i < arr.length; i++) {
              var name1 = arr[i].substring(arr[i].lastIndexOf('/'))
              var name = name1.split('.')[0].substr(1)
              var msg = arr[i].substring(arr[i].lastIndexOf('.'))
              let json = {
                url: arr[i],
                type: msg,
                name: name
              }
              this.urldata.push(json)
            }

          }
        })
      })
    }
  },
  directives: {
    drag: {
      // 指令的定义
      bind: function(el, bindings, vnode) {
        let odiv = el   //获取当前元素
        el.onmousedown = (e) => {
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
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.box {
  background-color: #ffd905ff;
  width: 3px;
  height: 3px;
  position: absolute;
}

.infoLock-zhb {
  &-list {
    width: 100px;
    height: 60px;
    float: left;
    position: relative;
    cursor: pointer;
    // transform: translateX(-50px);
    img {
      position: absolute;
      top: 13px;
      left: 10px;
    }

    div {
      width: 100%;
      text-align: center;
      line-height: 55px;
      position: absolute;
      top: 0px;
      color: white;
    }
  }

  width: 100%;
  height: 60px;

  &-right {
    float: right;
    padding-top: 8px;
  }

  &-left {
    float: left;
    padding-top: 8px;
  }

  &-container {
    float: left;
    height: 60px;
    width: 272px;
    overflow: hidden;
    // overflow: hidden;
    overflow-x: auto;
  }
}

.container {
  width: 100%;
  height: 600px;
  overflow-y: auto;

  iframe {
    width: 100%;
    height: 100%;
  }
}

.active {
  color: #fff600ff !important;
}

.infoLock-container {
  height: 100%;
  overflow: hidden;
  position: relative;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #175097;
  padding: 10px;
  margin-bottom: 10px;

  &-list {
    width: 100%;
    color: #ffffffff;
    font-size: 16px;
    font-weight: 400;

    div {
      margin-top: 5px;
      margin-left: 5px;
      font-size: 16px;
      font-weight: 400;
      width: 100%;
      text-align: left;
    }
  }
}

.infoLock-bottom {
  padding: 10px;
  margin-top: 10px;
  height: auto;
  border: 1px dashed #919497;
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

  &-prew {
    border-bottom: solid 1px #ccc;
    line-height: 1.1;
    color: white;
    display: inline;

    &:hover {
      color: rgb(9, 149, 243);
      border-bottom: solid 1px rgb(9, 149, 243);
    }
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
  width: 153px;
  height: 24px;
  line-height: 19px;
  background: #167cfa;
  border-radius: 12px;
  font-size: 16px;
  font-family: Source Han Sans SC;
  font-weight: 400;
  color: #fefefe;
  text-align: center;
}

/deep/ .el-timeline-item__tail {
  top: 11px;
  border-left: 2px solid #db3141ff;
  height: 94%;
}

/deep/ .el-timeline-item__node {
  background-color: rgba(0, 0, 0, 0);
  border: 2px solid #db3141ff;
}

.el-timeline {
  padding: 0px;
}

.infoLock {
  width: 362px;
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

</style>
