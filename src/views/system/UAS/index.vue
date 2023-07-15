<!--
 * 基础数据管理
 * 无人机管理
-->
<template>
  <div class='uas-container'>
    <el-form :model='searchdata' ref='searchdata' :inline='true' size='small' class='searchParams__style'>
      <el-form-item class='appendSelect'>
        <el-input
          style='width: 400px'
          prefix-icon='el-icon-search'
          placeholder='请输入关键字'
          v-model='searchdata[selectItem]'
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
            />
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          @click='initpage(pageNum, pageSize, searchdata)'
          icon='el-icon-search'
          style='background: transparent; color: white;border: 1px solid #007896;'
        >搜索
        </el-button
        >
        <el-button
          @click='reset'
          style='background: transparent; color: white;border: 1px solid #007896;'
          icon='el-icon-refresh'
        >重置
        </el-button
        >
      </el-form-item>
      <el-form-item style='float: right;margin-right: 0px'>
        <el-button
          @click='adduas'
          style='background: transparent; color: white;border: 1px solid #007896;'
          icon='el-icon-plus'
        >新增无人机
        </el-button>
      </el-form-item>
    </el-form>

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
        <el-table-column prop='jcsjUavId' label='无人机ID' min-width='130px' />
        <el-table-column prop='equipmentId' label='设备ID' min-width='80px' />
        <el-table-column prop='uavCode' label='无人机编码	' min-width='130px' />
        <el-table-column prop='uavName' label='无人机名称' min-width='100px' />
        <el-table-column label='操作' min-width='160px'>
          <template slot-scope='scope'>
            <el-button
              size='mini'
              type='text'
              style='color: #2999ebff'
              icon='el-icon-edit-outline'
              plain
              @click='editcol(scope.row)'
            >编辑
            </el-button>
            <el-button
              size='mini'
              type='text'
              style='color: #e02020ff'
              icon='el-icon-delete'
              plain
              @click='delcol(scope.row)'
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style='text-align: right;margin-top: 20px'>
        <el-pagination
          background
          @size-change='sizechange'
          @current-change='changepage'
          :current-page='currentPage'
          :page-sizes='[10, 20, 30, 40]'
          :page-size='100'
          layout='total, sizes, prev, pager, next, jumper'
          :total='total'
        />
      </div>
    </div>

    <!-- 添加无人机 -->
    <el-dialog
      :title='uastitle'
      v-if='dialogVisible'
      :visible.sync='dialogVisible'
      width='600px'
      :modal='false'
      :destroy-on-close='true'
      :close-on-click-modal='false'
      @close='closeWin'
      class='dialogReset__style'
    >
      <el-form ref='uasdata' :model='uasdata' label-width='100px' label-suffix=':'>
        <el-form-item prop='equipmentId' label='设备ID' :rules='ruleArray.equipmentId'>
          <el-input v-model='uasdata.equipmentId' placeholder='设备ID只可由英文或数字组成'></el-input>
        </el-form-item>
        <el-form-item prop='uavCode' label='无人机编码' :rules='ruleArray.rule'>
          <el-input v-model='uasdata.uavCode' placeholder='请输入' />
        </el-form-item>
        <el-form-item prop='uavName' label='无人机名称' :rules='ruleArray.rule'>
          <el-input v-model='uasdata.uavName' placeholder='请输入' />
        </el-form-item>
        <el-form-item prop='cameraCode' label='视频ID'>
          <el-input type='textarea' autosize v-model='uasdata.cameraCode' placeholder='请输入'></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer'>
        <el-button class='cancelBtns'
                   @click='
                dialogVisible = false;
                if (editOrAddNum == 1) {
                  uasdata = {};
                }
              '
        >取消
        </el-button>
        <el-button class='sureBtns' @click='query' type='primary'>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UpLoadImg from '@/components/imgLoader/index.vue'
import { adduav, uavlist, edituav, deluav } from '@/api/baseInfo'

export default {
  components: {
    UpLoadImg
  },
  data() {
    return {
      //验证规则
      ruleArray: {
        rule: [{ required: true, message: '该内容不能为空', trigger: 'blur' }],
        equipmentId: [
          {
            required: true,
            message: '设备ID不能为空',
            trigger: ['blur', 'change']
          },
          { validator: this.checkData, trigger: ['blur', 'change'] }
        ]
      },
      //当前上传照片url
      propsImgUrl: '',
      isshowimgs: '',
      value: 'uavName',
      options: [
        {
          label: '无人机名称',
          value: 'uavName'
        },
        {
          label: '无人机编码',
          value: 'uavCodeLike'
        }
      ],
      //无人机信息
      uasdata: {
        // gmtCreateUser:this.$Cookies.get('nickName'),
      },
      value1: [],
      dialogVisible: false,
      uastitle: '添加无人机',
      currentPage: 1,
      //查询条件
      searchdata: {
        uavCodeLike: '',
        uavName: '',
        uavNo: '',
        equipmentId: '',
        beginTime: '',
        endTime: ''
      },
      list: [],
      total: 0,
      pageNum: 0,
      pageSize: 10,
      editOrAddNum: 0, //0添加 1编辑
      selectItem: 'uavName'
    }
  },
  created() {
    this.initpage(this.pageNum, this.pageSize, this.searchdata)
  },
  methods: {
    /**
     * 检查输入内容格式
     */
    checkData(rule, value, callback) {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error('设备ID只可由英文或数字组成'))
        } else {
          callback()
        }
      }
      callback()
    },
    selected(e) {
      console.log(e)
      this.searchdata = {}
      this.selectItem = e
    },
    /**
     * 关闭弹窗触发
     */
    closeWin() {
      this.uasdata = {}
      this.dialogVisible = false
    },

    /**
     * 组件监听 变更照片监听
     */
    changeImg(data) {
      console.log(data)
      this.persondata.userPhoto = data
    },
    /**
     * 组件监听 删除照片监听
     */
    changedel(data) {
      this.isshowimgs = false
      this.persondata.userPhoto = ''
    },
    /**
     * 添加或更改无人机信息
     */
    query() {
      this.$refs.uasdata.validate((valid) => {
        if (valid) {
          console.log(this.persondata)
          if (this.editOrAddNum == 0) {
            adduav(this.uasdata).then((res) => {
              console.log(res)
              if (res.code == 200) {
                this.$message.success('添加成功')
                this.initpage(this.pageNum, this.pageSize)
              } else {
                this.$message.error(res.message)
              }
              this.dialogVisible = false
            })
          } else {
            // console.log(this.uasdata)
            edituav(this.uasdata).then((res) => {
              if (res.code == 200) {
                this.$message.success('添加成功')
                this.initpage(this.pageNum, this.pageSize)
              } else {
                this.$message.error(res.message)
              }
              this.dialogVisible = false
            })
          }
        }
      })
    },
    /**
     * 添加无人机按钮触发方法
     */
    adduas() {
      this.uastitle = '添加无人机'
      this.isshowimgs = false
      this.dialogVisible = true
      this.editOrAddNum = 0
    },
    /**
     * 编辑
     */
    editcol(row) {
      this.uastitle = '编辑无人机'
      this.editOrAddNum = 1
      this.dialogVisible = true
      this.uasdata = {
        id: row.jcsjUavId,
        equipmentId: row.equipmentId,
        uavCode: row.uavCode,
        uavName: row.uavName,
        uavNo: row.uavNo
      }
      // {beginTime:"",endTime:"",},
      console.log(this.uasdata)
      console.log(row)
    },
    /**
     * 删除
     */
    delcol(row) {
      console.log(row)
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deluav(row.jcsjUavId).then((res) => {
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
      console.log(row)
    },
    // 选择时间
    changetime(e) {
      this.searchdata.beginTime = e[0]
      this.searchdata.endTime = e[1]
    },
    // 重置
    reset() {
      this.searchdata = {
        uavCodeLike: '',
        uavName: '',
        uavNo: '',
        equipmentId: '',
        beginTime: '',
        endTime: ''
      };
      (this.value1 = []),
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
      console.log(e)
      this.pageNum = e
      this.initpage(this.pageNum, this.pageSize, this.searchdata)
    },
    // 初始化页面
    initpage(pageNum, pageSize, searchdata) {
      uavlist(pageNum, pageSize, searchdata).then((res) => {
        console.log(res)
        if (res.code == 200) {
          this.list = res.data.rows
          this.total = res.data.total
        }
      })
      console.log(pageNum, pageSize, searchdata)
    }
  }
}
</script>
<style scoped lang='less'>
.uas-container {
  background-color: transparent;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
