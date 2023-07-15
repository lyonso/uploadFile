<template>
  <div class='kanban'>
    <div class='kanban-M'>
      <div class='kanban-M-top'>
        <el-button type='primary' @click='goback' icon='el-icon-back' style='float: left'>返回</el-button>
        <div style='margin-left: 12px; float: left; line-height: 32px'> 当前位置：看板维护</div>
      </div>
      <div class='kanban-M-container'>
        <div class='kanban-M-container-list'>
          <div class='kanban-M-container-list-left'>
            <div style='background-color: #ffa902ff'>
              <span class='el-icon-date'></span>
            </div>
          </div>
          <div class='kanban-M-container-list-right'>
            <div class='kanban-M-container-list-right-title'>
              {{ commdata.missionName }}
            </div>
            <div class='kanban-M-container-list-right-content'>
              <div class='kanban-M-container-list-right-content-topdiv'>
                <span>任务类型：</span
                ><span style='color: rgba(0, 0, 0, 0.65)'>
                  <span v-if='commdata.missionType == 0'>演练任务</span>
                  <span v-else>指挥任务</span>
                </span>
              </div>
              <div class='kanban-M-container-list-right-content-topdiv'>
                <span>任务日期：</span>
                <span style='color: rgba(0, 0, 0, 0.65)'>{{ commdata.missionDate }}</span>
              </div>
              <div class='clearfloat'></div>
              <div class='kanban-M-container-list-right-content-btodiv'>
                <span>任务描述：</span>
                <span style='color: rgba(0, 0, 0, 0.65)'>{{ commdata.missionDescribe }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class='clearfloat'></div>
      </div>
      <div class='kanban-M-table'>
        <div class='kanban-M-table-topSearch'>
          <div class='header-search'>
            <div class='header-search-list'>
              <div class='header-sarch-button'>
                <el-date-picker
                  v-model='value1'
                  @change='changetime'
                  value-format='yyyy-MM-dd HH:mm:ss'
                  type='daterange'
                  range-separator='至'
                  start-placeholder='开始日期'
                  end-placeholder='结束日期'
                />
                <el-button icon='el-icon-search' style='background-color: #2999ebff; color: white;margin-left: 20px'
                           @click='initTable'>
                  搜索
                </el-button>
                <el-button style='color: #2999ebff' icon='el-icon-refresh' @click='reset'>重置</el-button>
              </div>
              <div class='clearfloat'></div>
            </div>
            <div class='clearfloat'></div>
          </div>

          <div style='position: absolute; top: 0px; right: 30px'>
            <el-button
              style='background: #09943bff; color: white'
              @click='
                dialogVisible2 = true;
                editoradd = 0;
                ruleForm = { messageTime: time, missionId: rwid };
                clear()
              '
              icon='el-icon-plus'
            >新增记录
            </el-button>
          </div>
        </div>
        <div class='kanban-M-table-content'>
          <el-table
            ref='multipleTable'
            :data='tabledata'
            row-key='id'
            tooltip-effect='dark'
            style='width: 100%'
            height='100%'
            border
            :header-cell-style="{ background: '#f4f4f5', color: '##1F2E4DFF' }"
          >
            <el-table-column
              v-for='(item, index) in col'
              :key='`col_${index}`'
              :prop='dropCol[index].prop'
              :label='item.label'>
            </el-table-column>
            <el-table-column label='操作' min-width='200px'>
              <template slot-scope='scope'>
                <el-button
                  size='mini'
                  type='text'
                  style='color: #2999ebff'
                  icon='el-icon-edit-outline'
                  plain
                  @click='
                    editlabel(scope.row);
                    editoradd = 1;
                  '
                >编辑
                </el-button>
                <!--                <el-button-->
                <!--                  size='mini'-->
                <!--                  type='text'-->
                <!--                  style='color: #2999ebff'-->
                <!--                  icon='el-icon-edit-outline'-->
                <!--                  plain-->
                <!--                  @click='fabu(scope.row)'-->
                <!--                >发布-->
                <!--                </el-button>-->
                <el-button
                  size='mini'
                  type='text'
                  style='color: #e02020ff'
                  icon='el-icon-delete'
                  plain
                  @click='dellabel(scope.row)'
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog
      title='添加/编辑过程记录'
      :visible.sync='dialogVisible2'
      width='480px'
      :modal-append-to-body='true'
      :append-to-body='true'
      :close-on-click-modal='false'
    >
      <el-form
        :model='ruleForm'
        :rules='rules'
        ref='ruleForm'
        label-width='100px'
        class='fc-container'
      >
        <el-form-item label='信息名称:' prop='messageName'>
          <div class='fc-container-list-input'>
            <el-input v-model='ruleForm.messageName'></el-input>
          </div>
        </el-form-item>
        <el-form-item label='信息时间:' prop='messageTime'>
          <div class='fc-container-list-input'>
            <el-date-picker
              style='width: 250px'
              v-model='ruleForm.messageTime'
              type='datetime'
              placeholder='选择日期'
              value-format='yyyy-MM-dd HH:mm:ss'
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label='信息内容:' prop='messageContent'>
          <div class='fc-container-list-input'>
            <el-input
              type='textarea'
              v-model='ruleForm.messageContent'
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label='信息文件:'>
          <div class='fc-container-list-input'>
            <el-upload
              class='upload-demo'
              drag
              ref='uploadimg'
              action='*'
              multiple
              :http-request='upLoadOnSelf'
            >
              <i class='el-icon-upload'></i>
              <div class='el-upload__text'>点击或将文件拖拽到这里上传</div>
            </el-upload>
            <div v-if='editoradd==1&&filelist.length>0'>
              <div>已上传文件</div>
              <div style='width: 100%;height: auto;position: relative;'>
                <div v-for='(item,index) in filelist' :key='index'
                     style='position: relative;width: 100%;height: auto;line-height: 30px;'>
                  {{ item }}
                  <div @click='delfile(index)' style='position: absolute;color: red;bottom: 0px;right: -10px;'>删除</div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class='fc-container-bottom'>
            <el-button @click='dialogVisible2 = false'>取消</el-button>
            <el-button @click='submitForm' type='primary'>确定</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class='fc-container'></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  missionMessageDel,
  missionMessageEdit,
  missionMessageList,
  missionMessageAdd,
  fileupload,
  commandMissionByid,
  missionMessageSort
} from '@/api/baseInfo'
import Sortable from 'sortablejs'

export default {
  components: {},
  data() {
    return {
      filelist: [],
      value1: [],
      rwid: this.$route.query.id,
      currentPage: 1,
      total: 0,
      ruleForm: {
        missionId: this.$route.query.id
      },
      rules: {
        messageName: [
          { required: true, message: '请输入信息名称', trigger: 'blur' }
        ],
        messageContent: [
          { required: true, message: '请输入信息内容', trigger: 'blur' }
        ],
        messageTime: [
          {
            type: 'string',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ]
      },
      col: [
        {
          label: 'ID',
          prop: 'yjylMissionMessageId'
        },
        {
          label: '信息名称',
          prop: 'messageName'
        },
        {
          label: '信息内容',
          prop: 'messageContent'
        },
        {
          label: '创建时间',
          prop: 'messageTime'
        }
      ],
      dropCol: [
        {
          label: 'ID',
          prop: 'yjylMissionMessageId'
        },
        {
          label: '信息名称',
          prop: 'messageName'
        },
        {
          label: '信息内容',
          prop: 'messageContent'
        },
        {
          label: '创建时间',
          prop: 'messageTime'
        }
      ],
      dialogVisible2: false,
      searchdata: { missionId: '' },
      commdata: {},
      tabledata: [],
      pageNum: 1,
      pageSize: 10,
      editoradd: 0,
      time: ''
    }
  },
  created() {
    let date = new Date()
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    var d = date.getDate()
    d = d < 10 ? '0' + d : d
    var h = date.getHours()
    h = h < 10 ? '0' + h : h
    var minute = date.getMinutes()
    minute = minute < 10 ? '0' + minute : minute
    var second = date.getSeconds()
    second = second < 10 ? '0' + second : second
    this.ruleForm.messageTime =
      y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    this.time = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
  },
  watch: {
    // tabledata:{
    //   handler(newName, oldName) {
    //     this.missionMessageSort(newName)
    //   },
    //   deep: true
    // }
  },
  mounted() {
    this.searchdata.missionId = this.$route.query.id
    this.initTable()
    this.initpage(this.$route.query.id)
    this.rowDrop()
  },
  methods: {
    clear() {
    },
    missionMessageSort(obj) {
      missionMessageSort(this.tabledata).then((res) => {
        console.log(res)
      })
    },
    reset() {
      this.searchdata.beginTime = '',
        this.searchdata.endTime = '',
        this.value1 = ''
      this.pageNum = 1

      this.initTable()
    },
    fabu(item) {
    },
    sizechange(e) {
      this.pageSize = e
      this.initTable(this.$route.query.id)
    },
    changepage(e) {
      this.pageNum = e
      this.initTable(this.$route.query.id)
    },
    delfile(index) {
      this.filelist.splice(index, 1)
      let filearr = ''
      for (let i = 0; i < this.filelist.length; i++) {
        if (i == 0) {
          filearr = this.filelist[i]
        } else {
          filearr = filearr + ',' + this.filelist[i]
        }
      }
      this.ruleForm.messageFile = filearr
    },
    editlabel(item) {
      this.dialogVisible2 = true
      this.ruleForm = item
      if (this.ruleForm.messageFile) {
        this.filelist = []
        this.filelist = this.ruleForm.messageFile.split(',')
      }
    },
    submitForm(formName) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.editoradd == 0) {
            missionMessageAdd(this.ruleForm).then((res) => {
              this.$message.success('添加成功')
              this.dialogVisible2 = false
              this.reset()
            })
          } else {
            this.ruleForm.id = this.ruleForm.yjylMissionMessageId
            missionMessageEdit(this.ruleForm).then((res) => {
              this.$message.success('修改成功')
              this.dialogVisible2 = false
              this.initTable()
            })
          }
        } else {
          return false
        }
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning('最多只能上传10个文件')
    },
    upLoadOnSelf(fileParam) {
      const fileObj = fileParam.file
      const form = new FormData()
      // form.append("type", this.$props.typenum);
      form.append('file', fileObj)
      fileupload(form).then((res) => {

        if (this.ruleForm.messageFile) {
          this.ruleForm.messageFile = this.ruleForm.messageFile + ',' + res.data
        } else {
          this.ruleForm.messageFile = res.data
        }
      })
    },
    dellabel(item) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          missionMessageDel(item.yjylMissionMessageId).then((res) => {
            if (res.code == 200) {
              this.$message.success('删除成功')
              this.initTable(this.rwid)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    initTable() {
      let obj = {
        missionId: this.$route.query.id
      }
      if (this.value1.length > 1) {
        obj.beginTime = this.value1[0]
        obj.endTime = this.value1[1]
      }
      missionMessageList(obj).then((res) => {
        if (res.code == 200) {
          this.tabledata = res.data
        }
      })
    },
    initpage(id) {
      commandMissionByid(id).then((res) => {
        if (res.code == 200) {
          this.commdata = res.data
        }
      })
    },
    changetime(e) {
      this.searchdata.beginTime = e[0]
      this.searchdata.endTime = e[1]
    },
    goback() {
      this.$router.push({
        path: '/monitor/monitorExmap',
        query: { id: this.$route.query.id }
      })
    },
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tabledata.splice(oldIndex, 1)[0]
          _this.tabledata.splice(newIndex, 0, currRow)
          _this.missionMessageSort()
        }
      })
      this.$forceUpdate()
    }

  }
}
</script>

<style lang='less'>
.uas-container-table-pagination {
  text-align: right;
  width: 100%;
  padding-top: 20px;
}

.el-upload-dragger {
  width: 332px;
  height: 160px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  border: 1px solid #d3dbeb;
}

.el-form-item__label {
  width: 100px;
  text-align: right;
  padding: 0px;
  margin-right: 12px;
  font-size: 14px;
  font-weight: 400;
  color: #3d4966;
}

.fc-container {
  width: 100%;
  height: auto;

  &-bottom {
    width: 100%;
    height: 72px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    text-align: right;
    padding-right: 20px;
    line-height: 72px;
  }

  &-list {
    width: 100%;
    padding: 0px 10px;
    margin-bottom: 10px;
    height: auto;

    &-title {
      width: 100px;
      text-align: right;
      float: left;
      line-height: 40px;
    }

    &-input {
      width: 250px;
      float: left;
    }
  }
}

.kanban {
  position: relative;
  z-index: 10;
  background: #F0F2F5;

  &-M {
    &-table {
      &-topSearch {
        position: relative;
        margin: 20px 35px;
      }

      width: calc(100vw - 60px);
      margin: auto;
      height: calc(100vh - 350px);
      background-color: white;
      overflow-y: auto;

      &-content {
        height: calc(100vh - 500px);
        padding: 34px;
        padding-top: 0px;
      }
    }

    width: 100vw;
    height: 100vh;
    padding-top: 160px;
    position: relative;

    &-container {
      width: 100%;
      padding: 0px 30px 20px 30px;

      &-list {
        &-right {
          &-content {
            &-btodiv {
              margin-top: 8px;
            }

            width: 100%;
            margin-top: 18px;

            &-topdiv {
              float: left;
              height: 20px;
              margin-right: 50px;
            }
          }

          &-title {
            font-size: 20px;
            font-weight: 500;
          }

          float: left;
        }

        padding: 23px;
        width: calc(100% - 100px);
        float: left;
        display: flex;
        background-color: white;
        border-radius: 4px;

        &-left {
          div {
            width: 28px;
            height: 28px;
            border-radius: 4px;
            margin: auto;
            text-align: center;
            font-size: 17px;
            line-height: 28px;
          }

          color: white;
          float: left;
          width: 54px;
          height: 100%;
        }
      }
    }

    &-top {
      width: 100%;
      background-color: white;
      position: fixed;
      top: 95px;
      padding: 11px 30px;

      .el-button {
        padding: 6px 13px;
      }

      font-size: 14px;
    }
  }
}
</style>
