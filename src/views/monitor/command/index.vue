<template>
  <div class='command'>
    <div class='back'>
      <el-button type='primary' icon='el-icon-back' @click='goBack' size='mini'>返回</el-button>
    </div>
    <div class='uas-container'>
      <div class='header-search'>
        <div class='header-search-list'>
          <el-input
            style='width: 400px'
            prefix-icon='el-icon-search'
            placeholder='请输入关键字'
            v-model='searchdata[selectedItem]'
          >
            <el-select
              style='width: 188px; color: #1f2e4d'
              v-model='value'
              slot='append'
              @change='selected'
            >
              <el-option
                v-for='item in options'
                :key='item.value'
                :label='item.label'
                :value='item.value'
              >
              </el-option>
            </el-select>
          </el-input>
        </div>

        <div class='header-search-list'>
          <div class='header-search-picker'>
            <el-date-picker
              v-model='value1'
              @change='changetime'
              value-format='yyyy-MM-dd HH:mm:ss'
              type='daterange'
              range-separator='至'
              start-placeholder='开始日期'
              end-placeholder='结束日期'
            >
            </el-date-picker>
          </div>
          <div class='clearfloat'></div>
        </div>

        <div class='header-search-list'>
          <div class='header-sarch-button'>
            <el-button
              @click='initpage(pageNum, pageSize, searchdata)'
              icon='el-icon-search'
              style='background-color: #2999ebff; color: white'
            >搜索
            </el-button>
            <el-button
              style='color: #2999ebff'
              @click='reset'
              icon='el-icon-refresh'
            >重置
            </el-button>
          </div>
          <div class='clearfloat'></div>
        </div>
        <div class='clearfloat'></div>
      </div>


      <div class='uas-container-table'>
        <el-table
          ref='multipleTable'
          :data='list'
          tooltip-effect='dark'
          style='width: 100%'
          max-height='1000'
          border
          :header-cell-style="{ background: '#f4f4f5', color: '#1F2E4DFF' }"
        >
          <el-table-column
            prop='yjylCommandMissionId'
            label='任务编号'
            min-width='100px'
          />
          <el-table-column
            prop='missionName'
            label='任务名称'
            min-width='100px'
          />
          <el-table-column prop='missionType' label='任务类型' min-width='100px'>
            <template slot-scope='scope'>
              <span v-if='scope.row.missionType == 0'>演练任务</span>
              <span v-else>指挥任务</span>
            </template>
          </el-table-column>
          <el-table-column
            prop='missionDescribe'
            label='任务描述'
            min-width='100px'
          />
          <el-table-column
            prop='commander'
            label='指挥长'
            min-width='100px'
          />
          <el-table-column
            prop='missionDate'
            label='任务日期'
            min-width='100px'
          />
          <el-table-column label='操作' min-width='200px'>
            <template slot-scope='scope'>
              <el-button
                size='mini'
                type='text'
                style='color: #2999ebff'
                icon='el-icon-view'
                plain
                @click='goin(scope.row)'
              >进入场景
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class='uas-container-table-pagination'>
          <el-pagination
            background
            @size-change='sizechange'
            @current-change='changepage'
            :current-page='pageNum'
            :page-sizes='[10, 20, 30, 40]'
            :page-size='100'
            layout='total, sizes, prev, pager, next, jumper'
            :total='total'
          >
          </el-pagination>
        </div>
      </div>

      <!-- 添加无人机 -->
      <el-dialog
        :title='uastitle'
        :visible.sync='dialogVisible'
        width='420px'
        :close-on-click-modal='false'
        :show-close='false'
      >
        <div class='fc-container'>
          <div class='fc-container-list'>
            <div class='fc-container-list-title'>指挥长：</div>
            <div class='fc-container-list-input'>
              <el-input v-model='commdata.commander'></el-input>
            </div>
            <div class='clearfloat'></div>
          </div>
          <div class='fc-container-list'>
            <div class='fc-container-list-title'>任务编号：</div>
            <div class='fc-container-list-input'>
              <el-input v-model='commdata.missionCode'></el-input>
            </div>
            <div class='clearfloat'></div>
          </div>
          <div class='fc-container-list'>
            <div class='fc-container-list-title'>任务日期：</div>
            <div class='fc-container-list-input'>
              <el-date-picker
                v-model='commdata.missionDate'
                type='datetime'
                placeholder='选择日期'
                value-format='yyyy-MM-dd HH:mm:ss'
              >
              </el-date-picker>
            </div>
            <div class='clearfloat'></div>
          </div>
          <div class='fc-container-list'>
            <div class='fc-container-list-title'>任务描述：</div>
            <div class='fc-container-list-input'>
              <el-input v-model='commdata.missionDescribe'></el-input>
            </div>
            <div class='clearfloat'></div>
          </div>
          <div class='fc-container-list'>
            <div class='fc-container-list-title'>任务名称：</div>
            <div class='fc-container-list-input'>
              <el-input v-model='commdata.missionName'></el-input>
            </div>
            <div class='clearfloat'></div>
          </div>
          <div class='fc-container-list'>
            <div class='fc-container-list-title'>任务地点：</div>
            <div class='fc-container-list-input'>
              <el-input v-model='commdata.missionPlace'></el-input>
            </div>
            <div class='clearfloat'></div>
          </div>
          <div class='fc-container-list'>
            <div class='fc-container-list-title'>任务类型：</div>
            <div class='fc-container-list-input'>
              <el-select v-model='commdata.missionType' placeholder='请选择'>
                <el-option label='演练任务' :value='0'></el-option>
                <el-option label='指挥任务' :value='1'></el-option>
              </el-select>
            </div>
            <div class='clearfloat'></div>
          </div>

          <div class='fc-container-bottom'>
            <el-button @click='query' type='warning'>确定</el-button>
            <el-button
              @click='
              dialogVisible = false;
              if (editOrAddNum == 1) {
                uasdata = {};
              }
            '
            >取消
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  addcommand,
  commandlist,
  editcommand,
  delcommand
} from '@/api/command'

export default {
  name: 'command',
  data() {
    return {
      value1: '',
      value: 'missionName',
      options: [
        { label: '指挥长', value: 'commander' },
        { label: '任务名称', value: 'missionName' }
      ],
      commdata: {},
      dialogVisible: false,
      uastitle: '添加任务',
      currentPage: 1,
      searchdata: {},
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      editOrAddNum: 0, //0添加 1编辑
      selectedItem: 'missionName'
    }
  },
  created() {
    this.initpage(this.pageNum, this.pageSize, this.searchdata)
  },
  methods: {
    selected(e) {
      this.searchdata = {}
      this.selectedItem = e
    },
    // 进入场景
    goin(item) {
      this.$store.commit('security/SET_TASK_TIME', item.missionDate)
      this.$router.push({
        path: '/monitor/monitorMapCommand',
        query: { id: item.yjylCommandMissionId }
      })
    },

    query() {
      if (this.editOrAddNum == 0) {
        addcommand(this.commdata).then((res) => {
          if (res.code == 200) {
            this.$message.success('操作成功')
            this.reset()
          } else {
            this.$message.error(res.message)
          }
          this.dialogVisible = false
        })
      } else {
        editcommand(this.commdata).then((res) => {
          if (res.code == 200) {
            this.$message.success('操作成功')
            this.initpage(this.pageNum, this.pageSize)
          } else {
            this.$message.error(res.message)
          }
          this.dialogVisible = false
        })
      }
    },
    adduas() {
      this.dialogVisible = true
      this.editOrAddNum = 0
    },
    // 编辑
    editcol(row) {
      this.editOrAddNum = 1
      this.dialogVisible = true
      this.commdata = {
        id: row.yjylCommandMissionId,
        commander: row.commander,
        missionCode: row.missionCode,
        missionDate: row.missionDate,
        missionDescribe: row.missionDescribe,
        missionName: row.missionName,
        missionPlace: row.missionPlace,
        missionType: row.missionType
      }
    },
    // 删除
    delcol(row) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delcommand(row.yjylCommandMissionId).then((res) => {
            if (res.code == 200) {
              this.$message.success(res.message)
              this.initpage(this.pageNum, this.pageSize, this.searchdata)
            } else {
              this.$message.error(res.message)
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
    // 查看详情
    seecol(row) {
    },
    // 选择时间
    changetime(e) {
      this.searchdata.beginTime = e[0]
      this.searchdata.endTime = e[1]
    },
    // 重置
    reset() {
      this.pageNum = 1
      this.searchdata = {}
      this.value1 = ''
      this.initpage(this.pageNum, this.pageSize, this.searchdata)
    },
    // 切换每页显示
    sizechange(e) {
      this.pageSize = e
      this.initpage(this.pageNum, this.pageSize, this.searchdata)
    },
    // 换页
    changepage(e) {
      this.pageNum = e
      this.initpage(this.pageNum, this.pageSize, this.searchdata)
    },
    // 初始化页面
    initpage(pageNum, pageSize, searchdata) {
      commandlist(pageNum, pageSize, searchdata).then((res) => {
        if (res.code == 200) {
          this.list = res.data.rows
          this.total = res.data.total
        }
      })
    },
    goBack() {
      this.$router.push('/monitor/monitorList')
    }
  }
}
</script>
<style lang='less' scoped>
.command {
  padding: 90px 20px 0;
  height: 100vh;
  position: relative;
  z-index: 10;
  background: #F0F2F5;
}

.back {
  margin-bottom: 20px;
  padding: 10px 20px;
  background: #FFFFFF;
}

.closeZhb {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 20px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  z-index: 20;
}

.zhb {

  ::v-deep.el-input__inner {
    width: 200px;
  }

  ::v-deep.el-select {
    width: 200px;
  }

  width: 84%;
  height: auto;
  border: 1px solid #e3e3e3;
  padding: 10px;
  position: relative;
  margin-bottom: 20px;
}

.el-button--text {
  border: 0px;
  padding: 0px;
}

.fc-container {
  width: 100%;
  height: auto;

  &-bottom {
    width: 100%;
    height: 72px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    // background-color: #F5F5F5;
    padding-right: 20px;
    text-align: right;
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

.uas-container {
  padding: 20px;
  background: #fff;

  &-table {
    margin-top: 20px;
    padding: 5px;
    height: auto;

    &-pagination {
      text-align: right;
      margin-top: 20px;
    }
  }

  &-buttonContent {
    position: absolute;
    top: 160px;
    right: 40px;
    background: #09943bff;
    color: white
  }
}

.header-search-list {
  display: inline-block;
  margin-right: 20px;
}

::v-deep .el-dialog {
  margin-top: 10vh !important;
}

.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: 250px;
}
</style>
