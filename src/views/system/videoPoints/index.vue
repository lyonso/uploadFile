<!--
 * 基础数据管理
 * 视频点信息管理
-->
<template>
  <div class='vp-content'>
    <!-- 查询表单 -->
    <el-form :model='searchData' ref='searchData' :inline='true' size='small' class='searchParams__style'>
      <el-form-item>
        <el-input
          prefix-icon='el-icon-search'
          placeholder='请输入视频名称'
          clearable
          v-model='searchData.cameraName'
        />
      </el-form-item>
      <el-form-item>
        <el-button
          icon='el-icon-search'
          style='background: transparent; color: white;border: 1px solid #007896;'
          @click='submitForm()'
        >搜索
        </el-button>
        <el-button
          style='background: transparent; color: white;border: 1px solid #007896;'
          @click='reset()'
          icon='el-icon-refresh'
        >重置
        </el-button>
      </el-form-item>
      <el-form-item style='float: right;margin-right: 0px'>
        <el-button
          type='primary'
          @click='adduas'
          icon='el-icon-plus'
          style='background: transparent; color: white;border: 1px solid #007896;'
        >新增视频点
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 新增按钮 -->
    <!-- 表格 -->
    <div class='tableReset__style'>
      <el-table
        ref='multipleTable'
        :data='list'
        tooltip-effect='dark'
        style='width: 100%'
        max-height='670'
        :cell-style="{background: 'transparent',color:'#fff'}"
        :header-cell-style="{background: 'linear-gradient(0deg, rgba(0, 48, 83, 0.14), rgba(0, 143, 255, 0.14))'}"
      >
        <el-table-column prop='jcsjCameraId' label='ID' min-width='100px' />
        <el-table-column prop='cameraName' label='视频名称' min-width='100px' />
        <el-table-column prop='cameraCode' label='视频ID' min-width='184px' />
        <el-table-column prop='longitude' label='经度' min-width='100px' />
        <el-table-column prop='latitude' label='纬度' min-width='100px' />
        <el-table-column prop='gmtCreate' label='创建时间' min-width='100px' />
        <el-table-column label='操作' min-width='150px'>
          <template slot-scope='scope'>
            <el-button
              size='mini'
              type='text'
              style='color: #2999ebff'
              icon='el-icon-view'
              @click='showVideo(scope.row)'
            >预览
            </el-button>
            <el-button
              size='mini'
              type='text'
              style='color: #2999ebff'
              icon='el-icon-edit'
              @click='editcol(scope.row)'
            >编辑
            </el-button>
            <el-button
              size='mini'
              type='text'
              style='color: #e02020ff'
              icon='el-icon-delete'
              @click='delcol(scope.row)'
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style='text-align:right;margin-top: 20px'>
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

    <!-- 视频预览弹窗 -->
    <el-dialog
      title='视频详情'
      v-if='videoVisible'
      :visible.sync='videoVisible'
      width='410px'
      class='dialogReset__style'
      :modal='false'
      :close-on-click-modal='false'
      @close='closeVideo'
    >
      <div class='video'>
        <video-player
          v-bind:monitorDeviceNo='monitorDeviceNo'
          :detail='detail'
        />
      </div>
    </el-dialog>

    <!-- 新增视频弹窗 -->
    <el-dialog
      class='dialogReset__style'
      :title='videoTitle'
      v-if='dialogVisible'
      :visible.sync='dialogVisible'
      width='1264px'
      :modal='false'
      :close-on-click-modal='false'
      @close='closeWin'
    >
      <el-row :gutter='10'>
        <el-col :span='12'>
          <el-form ref='videodata' :model='videodata' label-width='100px'>
            <el-form-item prop='cameraCode' label='视频ID:' :rules='ruleArray.cameraCode'>
              <el-input v-model='videodata.cameraCode' placeholder='视频ID只可由英文或数字组成'></el-input>
            </el-form-item>
            <el-form-item prop='cameraName' label='视频名称:' :rules='ruleArray.cameraName'>
              <el-input v-model='videodata.cameraName' placeholder='请输入'></el-input>
            </el-form-item>
            <el-form-item prop='latitude' label='纬度:' :rules='ruleArray.latitude'>
              <el-input v-model='videodata.latitude' placeholder='请从小地图中选取坐标'
                        oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
            </el-form-item>
            <el-form-item prop='longitude' label='经度:' :rules='ruleArray.longitude'>
              <el-input v-model='videodata.longitude' placeholder='请从小地图中选取坐标'
                        oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span='12'>
          <mapView
            @send-longitude='getLongitutde'
            @send-latitude='getLatitude'
            :currentLat='videodata.latitude'
            :currentLng='videodata.longitude'
          />
        </el-col>
      </el-row>
      <div slot='footer' class='dialog-footer'>
        <el-button class='cancelBtns' @click='dialogVisible = false;videodata = {};'>取消</el-button>
        <el-button class='sureBtns' type='primary' @click='addVideo'>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  videoList,
  addVideoPoint,
  delVideo,
  editVideoPoint
} from '@/api/bbaseInfo'
import mapView from '@/components/map/index'
import videoPlayer from '@/components/video/index'

export default {
  components: {
    mapView,
    videoPlayer
  },
  data() {
    return {
      //表单验证条件
      ruleArray: {
        cameraCode: [
          {
            required: true,
            message: '视频编码不能为空',
            trigger: ['blur', 'change']
          },
          {
            validator: this.checkData,
            trigger: ['blur', 'change']
          }
        ],
        cameraType: [
          {
            required: true,
            message: '视频类型不能为空',
            trigger: 'blur'
          }
        ],
        cameraName: [
          {
            required: true,
            message: '视频名称不能为空',
            trigger: ['blur', 'change']
          }
        ],
        latitude: [
          {
            required: true,
            message: '请输入纬度',
            trigger: ['blur', 'change']
          }
        ],
        longitude: [
          {
            required: true,
            message: '请输入经度',
            trigger: ['blur', 'change']
          }
        ]
      },
      //时间选择器绑定数据
      value1: '',
      //视频code
      monitorDeviceNo: '',
      videoVisible: false,

      //下拉框数据
      options: [
        {
          label: '按视频名称查询',
          value: 'cameraName'
        }
      ],
      //下拉框默认选项
      value: 'cameraName',
      //视频信息
      videodata: {
        longitude: 120.239307,
        latitude: 31.551029
      },
      dialogVisible: false,
      videoTitle: '',

      //筛选条件
      searchData: {
        cameraName: '',
        beginTime: '',
        endTime: ''
      },
      //判断新增与编辑
      addOrEdit: 0,
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      searchItem: '',
      detail: {}
    }
  },
  created() {
    this.initpage(this.pageNum, this.pageSize, this.searchData)
  },
  methods: {
    /*
     * 重置表单验证
     */
    resetRuleForm() {
      this.$nextTick(() => {
        this.$refs.videodata.clearValidate()
      })
    },
    /*
     * 验证输入内容格式
     */
    checkData(rule, value, callback) {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error('视频ID只可由英文或数字组成'))
        } else {
          callback()
        }
      }
      callback()
    },
    /*
     * 关闭弹窗触发的方法
     */
    closeWin() {
      this.resetRuleForm()
      this.dialogVisible = false
      this.videodata = {
        longitude: 120.239307,
        latitude: 31.551029
      }
    },
    /*
     *子组件监听方法获取经度
     */
    getLongitutde(value) {
      this.videodata.longitude = value
      console.log('From the child:', value)
    },
    /*
     *子组件监听方法获取纬度
     */
    getLatitude(value) {
      this.videodata.latitude = value
      console.log('From the child:', value)
    },
    /*
 *视频预览方法
 */
    showVideo(row) {
      this.videoVisible = true
      this.monitorDeviceNo = row.cameraCode
      this.detail = row
    },
    /*
 *关闭视频触发防止视频延迟销毁
 */
    closeVideo() {
      this.videoVisible = false
    },

    selected() {
      this.searchItem = this.value
    },

    addVideo() {
      this.$refs.videodata.validate((valid) => {
        if (valid) {
          if (this.addOrEdit == 0) {
            addVideoPoint(this.videodata)
              .then((res) => {
                if (res.code == 200) {
                  this.$message.success('添加成功')
                  this.reset()
                  this.dialogVisible = false
                } else {
                  this.$message.error(res.message)
                }
              })
              .catch((err) => Error(err))
          } else {
            editVideoPoint(this.videodata)
              .then((res) => {
                if (res.code == 200) {
                  this.$message.success('修改成功')
                  this.initpage(this.pageNum, this.pageSize)
                  this.dialogVisible = false
                } else {
                  this.$message.error(res.message)
                }
              })
              .catch((err) => Error(err))
          }
        }
      })
    },
    submitForm() {
      this.$refs.searchData.validate((valid) => {
        if (valid) {
          this.initpage(this.pageNum, this.pageSize, this.searchData)
        } else {
          alert('错误的信息')
        }
      })
    },
    resetForm() {
      this.$refs.requestData.resetFields()
    },
    adduas() {
      this.dialogVisible = true
      this.addOrEdit = 0
      this.videoTitle = '添加视频点信息'
    },
    // 编辑
    editcol(row) {
      console.log(row)
      this.addOrEdit = 1
      this.videoTitle = '编辑视频点信息'
      this.dialogVisible = true
      this.videodata = {
        cameraCode: row.cameraCode,
        cameraName: row.cameraName,
        cameraType: row.cameraType,
        latitude: row.latitude,
        longitude: row.longitude,
        id: row.jcsjCameraId
      }
    },
    // 删除
    delcol(row) {
      console.log(row)
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delVideo(row.jcsjCameraId)
            .then((res) => {
              console.log(res)
              this.$message.success('删除成功')
              this.initpage(this.pageNum, this.pageSize, this.searchdata)
            })
            .catch((err) => Error(err))
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
      console.log(row)
      this.$router.push({
        name: '视频点预览',
        query: {
          data: row.cameraCode
        }
      })
    },
    // 选择时间
    changetime(e) {
      this.searchData.beginTime = e[0]
      this.searchData.endTime = e[1]
    },
    // 重置
    reset() {
      this.searchData = {
        cameraCode: '',
        cameraName: '',
        cameraType: '',
        latitude: '',
        longitude: ''
      };
      (this.value1 = []), (this.pageNum = 1)
      this.initpage(this.pageNum, this.pageSize, this.searchdata)
    },
    // 切换每页显示
    sizechange(e) {
      console.log(e)
      this.pageSize = e
      this.initpage(this.pageNum, this.pageSize, this.searchdata)
    },
    // 换页
    changepage(e) {
      console.log(this.currentPage)
      this.pageNum = e
      this.initpage(this.pageNum, this.pageSize, this.searchdata)
    },
    // 初始化页面
    initpage(pageNum, pageSize, searchdata) {
      videoList(pageNum, pageSize, searchdata)
        .then((res) => {
          console.log(res)
          this.list = res.data.rows
          this.total = res.data.total
        })
        .catch((err) => Error(err))
    }
  }
}
</script>
<style scoped lang='less'>
.vp-content {
  background-color: transparent;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
